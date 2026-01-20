// Main exports
export { StarknetProvider } from "./StarknetProvider";
export { useStarknet } from "./useStarknet";

// Type exports
export type {
  BalanceInfo,
  DeploymentStatus,
  StarknetContext,
  StarknetContextActions,
  StarknetContextState,
  StarknetProviderConfig,
  TransactionResult,
} from "./types";

// Utility exports
export {
  ARGENTX_CLASS_HASH,
  checkAccountDeployment,
  createStarknetAccount,
  createStarknetProvider,
  derivePrivateKey,
  ETH_TOKEN_ADDRESS,
  fetchBalances,
  generateDeploymentData,
  STRK_TOKEN_ADDRESS,
} from "./utils";
