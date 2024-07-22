"use client";
import {API_KEY} from "@/constants";
import {useCallback, useEffect, useState} from "react";

const query = `
 {
  token(id:"0x66f364f908c662772f5b7ecd58488f372c584833") {
    id,
    symbol,
    name,
    decimals,
    poolCount,
    txCount,
    untrackedVolumeUSD,
    volumeUSD,
    feesUSD,
    totalValueLocked,
    totalValueLockedUSD,
    totalValueLockedUSDUntracked,
    derivedETH,
    whitelistPools {
      id
    },
    totalSupply,
    
  }
}

`;

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  decimals: string;
  poolCount: string;
  txCount: string;
  untrackedVolumeUSD: string;
  volumeUSD: string;
  feesUSD: string;
  totalValueLocked: string;
  totalValueLockedUSD: string;
  totalValueLockedUSDUntracked: string;
  derivedETH: string;
  whitelistPools: {
    id: string;
  }[];
  totalSupply: string;
}

export default function Home() {
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchToken = useCallback(async () => {
    const cacheData = localStorage.getItem("tokenData");
    const cacheTime = localStorage.getItem("tokenDataTime");

    if (cacheData && cacheTime) {
      const now = new Date().getTime();

      if (now - parseInt(cacheTime) < 300000) {
        setToken(JSON.parse(cacheData));
        return;
      }
    }

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
      setToken(data.token);
      localStorage.setItem("tokenData", JSON.stringify(data.token));
      localStorage.setItem("tokenDataTime", new Date().getTime().toString());
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-5xl mb-5 text-center">Token Data</h1>

      {loading ? (
        <p>Loading...</p>
      ) : token ? (
        <ul>
          <li>Token ID: {token.id}</li>
          <li>Symbol: {token.symbol}</li>
          <li>Name: {token.name}</li>
          <li>Decimals: {token.decimals}</li>
          <li>Pool Count: {token.poolCount}</li>
          <li>Transaction Count: {token.txCount}</li>
          <li>Untracked Volume USD: {token.untrackedVolumeUSD}</li>
          <li>Volume USD: {token.volumeUSD}</li>
          <li>Fees USD: {token.feesUSD}</li>
          <li>Total Value Locked: {token.totalValueLocked}</li>
          <li>Total Value Locked USD: {token.totalValueLockedUSD}</li>
          <li>
            Total Value Locked USD (Untracked):{" "}
            {token.totalValueLockedUSDUntracked}
          </li>
          <li>Derived ETH: {token.derivedETH}</li>
          <li>Total Supply: {token.totalSupply}</li>
          <li>
            Whitelist Pools:{" "}
            {token.whitelistPools.map((pool) => pool.id).join(", ")}
          </li>
        </ul>
      ) : (
        <p>No token data available.</p>
      )}
    </main>
  );
}
