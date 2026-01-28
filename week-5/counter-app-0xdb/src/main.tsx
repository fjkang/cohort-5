import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivyProvider } from '@privy-io/react-auth';
import { StarknetProvider } from './privy-starknet-provider';
import { ToastContainer } from "react-toastify"
import { privyAppId, privyClientId, rpcUrl, avnuApiKey } from './env.ts';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrivyProvider appId={privyAppId} clientId={privyClientId}>
            <StarknetProvider
                config={{
                    rpcUrl,
                    avnuApiKey,
                }}
            >
                <App />
                <ToastContainer
                    position="bottom-right"
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="dark"
                />
            </StarknetProvider>
        </PrivyProvider>
    </StrictMode>
)
