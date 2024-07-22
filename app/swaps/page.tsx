"use client";
import {API_KEY} from "@/constants";
import {useCallback, useEffect, useState, useRef} from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {formatNumberEUA} from "../utils/data";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

interface Swap {
  origin: string;
  id: string;
  timestamp: string;
  __typename: string;
  pool: {
    id: string;
    token0: {
      symbol: string;
    };
    token1: {
      symbol: string;
    };
  };
  sender: string;
  amount0: string;
  amount1: string;
  amountUSD: string;
}

export default function Swaps() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(swaps?.length / itemsPerPage) || 1;
  const [wallet, setWallet] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSwaps = useCallback(async (wallet: string) => {
    const cacheData = localStorage.getItem("swaps");
    const cacheTime = localStorage.getItem("swapsTime");

    if (cacheData && cacheTime) {
      const now = new Date().getTime();

      if (now - parseInt(cacheTime) < 300000) {
        setSwaps(JSON.parse(cacheData));
        return;
      }
    }

    const query = `{
      swaps(where: { 
        pool: "0xd5d3022d63b220609bb52842c1b47157e046f5ca",
        origin: "${wallet}" 
      }, orderBy: timestamp, orderDirection: desc) {
        origin
        id
        timestamp
        __typename
        pool {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
        }
        sender
        amount0
        amount1
        amountUSD
      }
    }
    `;

    try {
      setLoading(true);
      const response = await fetch(
        `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({query}),
          cache: "force-cache",
          next: {
            revalidate: 300,
          },
        }
      );

      const {data} = await response.json();
      setSwaps(data.swaps);
      localStorage.setItem("swaps", JSON.stringify(data.swaps));
      localStorage.setItem("swapsTime", new Date().getTime().toString());
      localStorage.setItem("wallet", wallet);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      setWallet(savedWallet);
      fetchSwaps(savedWallet);
    }
  }, [fetchSwaps]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = swaps.slice(indexOfFirstItem, indexOfLastItem);

  const humanDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputRef.current) {
      const walletValue = inputRef.current.value;

      if (walletValue) {
        localStorage.removeItem("swaps");
        localStorage.removeItem("swapsTime");
        fetchSwaps(walletValue);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-5xl mb-5 text-center">Swaps</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex w-full  items-center space-x-2">
          <Input type="text" placeholder="Wallet" ref={inputRef} />
          <Button type="submit">Search</Button>
        </div>
      </form>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : currentItems.length ? (
          currentItems.map((swap) => (
            <li key={swap.id} className="mb-3">
              <a href={`https://polygonscan.com/tx/${swap.id}`} target="_blank">
                Hash: {swap.id}
              </a>
              <p>Origin: {swap.origin}</p>
              <p>Timestamp: {humanDate(swap.timestamp)}</p>
              <p>Type: {swap.__typename}</p>
              <p>Sender: {swap.sender}</p>
              <p>
                Amount {swap.pool.token0.symbol}:{" "}
                {formatNumberEUA(Number(swap.amount0))}
              </p>
              <p>
                Amount {swap.pool.token1.symbol}:{" "}
                {formatNumberEUA(Number(swap.amount1))}
              </p>
              <p>Amount USD: $ {formatNumberEUA(Number(swap.amountUSD))}</p>
            </li>
          ))
        ) : (
          <p>No Swaps</p>
        )}
      </ul>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={index + 1 === page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
