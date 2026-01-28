import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { usePrivy } from '@privy-io/react-auth'
import { useStarknet } from './privy-starknet-provider'
import { Counter } from './components/Counter'
import { AccountInfo } from './components/AccountInfo'
import { LoginButton } from './components/LoginButton'
import { GitHubCorner } from './components/GitHubCorner'

function App() {
    const { ready } = usePrivy()
    const {
        isInitializing,
    } = useStarknet()

    if (!ready) return <div>Loading...</div>

    if (isInitializing) {
        return <h1>Initializing Starknet...</h1>
    }

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <div>
                <h1>Starknet Counter by 0xdb</h1>
                <Counter />
                <AccountInfo />
                <LoginButton />
                <GitHubCorner />
            </div>
        </>
    )
}

export default App
