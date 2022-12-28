import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import NxWelcome from './nx-welcome';

import { init } from '@dgca/use-typechain-contracts';
import { factories } from '@dgca/example-contracts';

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [alchemyProvider({ apiKey: 'demo' }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const { TypeChainProvider, useContracts } = init(factories, {
  Greeter: '0x0',
});

export function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <TypeChainProvider>
          <Child />
          <NxWelcome title="example-frontend" />
        </TypeChainProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function Child() {
  const contracts = useContracts();

  contracts.Greeter();
  contracts.Todos('');

  return <p>Hello world</p>;
}

export default App;
