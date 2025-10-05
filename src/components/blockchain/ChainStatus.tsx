"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains"; // We can use any chain as a placeholder

const ChainStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const checkChainStatus = async () => {
      try {
        const publicClient = createPublicClient({
          chain: mainnet, // Placeholder, will be overridden by transport
          transport: http("http://localhost:8545"),
        });

        const id = await publicClient.getChainId();
        setChainId(id);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
        setChainId(null);
      }
    };

    checkChainStatus();
    const interval = setInterval(checkChainStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`h-3 w-3 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      <span>{isOnline ? `Online (Chain ID: ${chainId})` : "Offline"}</span>
    </div>
  );
};

export default ChainStatus;
