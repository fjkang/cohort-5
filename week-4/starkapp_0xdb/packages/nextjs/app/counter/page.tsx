"use client";

import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { useBlockNumber } from "@starknet-react/core";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";

const DemoCounter = () => {
  const { targetNetwork } = useTargetNetwork();
  const { data: blockNumber } = useBlockNumber();
  const { data: counter } = useDeployedContractInfo("Counter");
  const { data: counterValue } = useScaffoldReadContract({
    contractName: "Counter",
    functionName: "get",
  });
  const { sendAsync: incCounter } = useScaffoldWriteContract({
    contractName: "Counter",
    functionName: "inc",
  });
  const { sendAsync: decCounter } = useScaffoldWriteContract({
    contractName: "Counter",
    functionName: "dec",
  });
  const { data: events } = useScaffoldEventHistory({
    contractName: "Counter",
    eventName: "ValueChanged",
    fromBlock: blockNumber
      ? (blockNumber > 50n ? BigInt(blockNumber - 50) : 0n)
      : 0n,
    watch: true,
  });

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto p-8">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full border border-gradient">
        <h2 className="text-3xl font-bold text-center mb-6">Demo Counter</h2>

        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => decCounter()}
            className="btn btn-circle btn-secondary btn-lg text-2xl"
          >
            -
          </button>
          <div className="text-6xl font-bold min-w-[120px] text-center">
            {counterValue?.toString() || "0"}
          </div>
          <button
            onClick={() => incCounter()}
            className="btn btn-circle btn-primary btn-lg text-2xl"
          >
            +
          </button>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
            <span className="font-semibold">Network:</span>
            <span className="text-primary">{targetNetwork.name}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
            <span className="font-semibold">Block:</span>
            <span>{blockNumber?.toString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
            <span className="font-semibold">Contract:</span>
            <span className="truncate ml-2 font-mono text-xs">
              {counter?.address}
            </span>
          </div>
        </div>
      </div>

      {events && events.length > 0 && (
        <div className="bg-base-100 rounded-2xl shadow-lg p-6 w-full border border-gradient">
          <h3 className="text-xl font-bold mb-4">Recent Events</h3>
          <div className="flex flex-wrap gap-2">
            {events.slice(0, 10).map((e, i) => (
              <div key={i} className="badge badge-outline badge-lg">
                {e.args.value.toString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCounter;
