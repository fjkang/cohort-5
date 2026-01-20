import { useEffect } from "react";
import { useStarknet } from "../privy-starknet-provider";
import { useCounter } from "../hooks/useCounter";
import { toast } from "react-toastify";
import { contractAddress } from "../env";

export function Counter() {
  const { counter } = useCounter();
  const { address, executeGaslessTransaction, txPending, txHash } =
    useStarknet();

  useEffect(() => {
    if (txHash) {
      let txUrl = `https://sepolia.voyager.online/tx/${txHash}`;
      toast.success(
        <span>
          Transaction pending... View tx:{" "}
          <a
            className="underline"
            href={txUrl}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 10)}…
          </a>
        </span>,
        { autoClose: 6000 },
      );
    }
  }, [txPending, txHash]);

  const handleIncrementGasless = async () => {
    const result = await executeGaslessTransaction([
      {
        contractAddress,
        entrypoint: "increment",
        calldata: [],
      },
    ]);

    if (result.success) {
      console.log("✅ Gasless transaction confirmed!");
    } else {
      toast.error(result.error, { autoClose: 5000 });
    }
  };

  if (!address) {
    return null;
  }

  return (
    <button
      onClick={handleIncrementGasless}
      style={{
        width: "160px",
        height: "160px",
        borderRadius: "50%",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        background: "rgba(255, 255, 255, 0.05)",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <h1>{counter}</h1>
    </button>
  );
}
