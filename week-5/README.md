参考代码: [frontend](./frontend)

效果预览: https://starknet-privy-avnu-counter.surge.sh

## Step 0

部署 Counter 合约

```
cd contract
scarb build
sncast deploy --contract-name Counter --network sepolia
```

## Step 1

创建新前端项目

```bash
bun create vite counter-app --template react-ts
```

进入项目目录并安装依赖

```bash
cd counter-app
bun i starknet # Starknet.js
bun i @privy-io/react-auth # Privy React SDK
bun i react-toastify # React 气泡提示
```

配置环境变量, 参考 [./frontend/.env.example](./frontend/.env.example)

1. **Privy App ID & Client ID** - Create an app at https://dashboard.privy.io
2. **AVNU API Key** - Request at https://docs.avnu.fi
3. **Alchemy RPC** - Get key at https://alchemy.com (or use any Starknet RPC)
4. **Counter Contract** - Deploy [Counter](./contract) contract to sepolia

```
VITE_PRIVY_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxx
VITE_PRIVY_CLIENT_ID=client-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

VITE_AVNU_API_KEY=c37c52b7-ea5a-4426-8121-329a78354b0b

VITE_STARKNET_RPC_URL=https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/xxxxxxxxxxxxxxxxxxxxx

VITE_CONTRACT_ADDRESS=0x01c697b8bfe1dcff8439e34089177eb70659b1ca7bec24b3da768abd2b98e0c6
```

从 `./src/env.ts` 导出环境变量:

```
export const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
export const privyClientId = import.meta.env.VITE_PRIVY_CLIENT_ID;
export const rpcUrl = import.meta.env.VITE_STARKNET_RPC_URL;
export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
export const avnuApiKey = import.meta.env.VITE_AVNU_API_KEY;
```

## Step 2

通过 `@privy-io/react-auth` 的 PrivyProvider, 配置 Privy 登陆按钮

1. Import the PrivyProvider in `./src/main.tsx`

```
import {PrivyProvider} from '@privy-io/react-auth';

// Wrap any components that will use the Privy SDK with the PrivyProvider – for example, in your `app` or `index` file
<PrivyProvider appId="<your-privy-app-id>" clientId="your-privy-client-id">
  <Component {...pageProps} />
</PrivyProvider>;
```

2. Import the usePrivy hook in `./src/App.tsx`

```
import {usePrivy} from '@privy-io/react-auth';

// Call usePrivy() from inside your React components
const {ready, authenticated, user, login, logout} = usePrivy();

...
  <p>
    {`Hello, ${user?.id || 'Guest'}!`}
  </p>
  {authenticated ? (
    <button onClick={logout}>
      Logout
    </button>
  ) : (
    <button onClick={login}>
      Login
    </button>
  )}
...
```

参考: https://www.npmjs.com/package/@privy-io/react-auth

## Step 3

通过 `privy-starknet-provider` 的 StarknetProvider, 配置 Starknet RPC 与 AVNU
Paymaster

从 `./frontend/src/privy-starknet-provider` 拷贝 Privy Starknet SDK

1. Wrap your app in `./src/main.tsx`

```
import { PrivyProvider } from '@privy-io/react-auth';
import { StarknetProvider } from './privy-starknet-provider';

<PrivyProvider appId="your-privy-app-id" clientId="your-privy-client-id">
  <StarknetProvider
    config={{
      rpcUrl: 'https://starknet-sepolia.g.alchemy.com/v2/YOUR_KEY',
      avnuApiKey: 'your-avnu-api-key', // Required for gasless transactions
    }}
  >
    <App />
  </StarknetProvider>
</PrivyProvider>
```

2. Use the hook in `./src/App.tsx`

```
import { useStarknet } from './privy-starknet-provider';

function App() {
  const {
    isInitializing,
    address,
    balance,
    isDeployed,
    txPending,
    executeGaslessTransaction,
  } = useStarknet();

  if (isInitializing) {
    return <h1>Initializing Starknet...</h1>;
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>ETH Balance: {balance?.eth}</p>
      <p>STRK Balance: {balance?.strk}</p>
      <p>Deployed: {isDeployed ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

参考: https://github.com/keep-starknet-strange/privy/#usage

## Step 4

使用 [useCounter](./frontend/src/hooks/useCounter.ts) 读取 Counter 地址

Use the hook in `./src/App.tsx`

```
import { useCounter } from './hooks/useCounter';

  const { counter } = useCounter();

  <p>Counter: {counter}</p>
```

## Step 5

增加 increment 按钮

Update `./src/App.tsx`

```
  const handleTransaction = async () => {
    const result = await executeGaslessTransaction([
      {
        contractAddress: contractAddress,
        entrypoint: "increment",
        calldata: [],
      },
    ]);

    if (result.success) {
      console.log("✅ Gasless transaction confirmed!");
    }
  };

  <button
    onClick={handleTransaction}
    disabled={txPending}
  >
    Increment
  </button>
```

## Step 6

显示交易气泡通知

Add ToastContainer in `./src/main.tsx`

```
import { ToastContainer } from "react-toastify";

<PrivyProvider ...>
  <StarknetProvider ... >
    {children}
    <ToastContainer
      position="bottom-right"
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="dark"
    />
  </StarknetProvider>
</PrivyProvider>
```

Update `./src/App.tsx`

```
  const handleTransaction = async () => {
    toast.info("Transaction submitted!", { autoClose: 1000 });

    const result = await executeGaslessTransaction([
      ...
    ]);

    if (result.success) {
      console.log("✅ Gasless transaction confirmed!");
      toast.success("Transaction confirmed!", { autoClose: 1000 });
    } else {
      toast.error(result.error, { autoClose: 1000 });
    }
  };
```

## Step 7

- 优化样式
- 调整代码结构
- 修复编译错误
- 部署应用上线: Vercel, Surge, GitHub Pages, Cloudflare Pages...

参考代码: [frontend](./frontend)

```
bun run build
```