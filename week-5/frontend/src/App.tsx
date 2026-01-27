import "./App.css";

import { usePrivy } from "@privy-io/react-auth";
import { useStarknet } from "./privy-starknet-provider";
import { LoginButton } from "./components/LoginButton";
import { AccountInfo } from "./components/AccountInfo";
import { Counter } from "./components/Counter";

function App() {
  const { ready } = usePrivy();
  const { isInitializing } = useStarknet();

  if (!ready) {
    return <h1>Initializing Privy...</h1>;
  }

  if (isInitializing) {
    return <h1>Initializing Starknet...</h1>;
  }

  return (
    <>
      <Counter />
      <AccountInfo />
      <LoginButton />
    </>
  );
}

export default App;
