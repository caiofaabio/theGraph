export interface Swap {
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

export interface TokenData {
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
