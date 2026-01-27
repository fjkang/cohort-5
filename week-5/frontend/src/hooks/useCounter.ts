import { useEffect, useRef, useState } from "react";
import { useStarknet } from "../privy-starknet-provider";
import { contractAddress } from "../env";

export function useCounter() {
  const [counter, setCounter] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const {
    provider: starknetProvider,
    address: starknetAddress,
  } = useStarknet();
  const refreshCounter = async () => {
    if (!starknetProvider) return;
    if (!starknetAddress) return;

    try {
      const result = await starknetProvider.callContract({
        contractAddress,
        entrypoint: "get_count",
        calldata: [starknetAddress],
      });

      const counterValue = Number(result[0]);
      console.log("✅ Counter value read from blockchain:", counterValue);
      setCounter(counterValue);
    } catch (err: any) {
      console.error("Failed to read counter:", err);
      if (err.message.includes("429")) {
        console.log(
          "⚠️   RPC rate limited. Get your own Alchemy API key at https://www.alchemy.com/",
        );
      }
      setCounter(0);
    }
  };
  useEffect(() => {
    refreshCounter();
    timerRef.current = window.setInterval(refreshCounter, 2000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [starknetProvider]);
  return {
    counter,
  };
}
