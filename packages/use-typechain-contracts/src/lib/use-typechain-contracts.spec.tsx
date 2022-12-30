import { render } from '@testing-library/react';
import * as typechain from '@dgca/example-contracts';

import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { init } from './use-typechain-contracts';

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

const { TypeChainProvider, useContracts } = init(typechain, {
  Greeter: '0x123',
});

const factoryKeys = Object.keys(typechain).filter((key) =>
  key.endsWith('__factory')
);

describe('TypeChainProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <WagmiConfig client={wagmiClient}>
        <TypeChainProvider>
          <div>Hello world</div>
        </TypeChainProvider>
      </WagmiConfig>
    );
    expect(baseElement).toBeTruthy();
  });
});

describe('useContracts', () => {
  it('should include all factory keys', () => {
    let hookValue: Record<string, any> = {};

    function TestContext() {
      hookValue = useContracts();
      return null;
    }

    render(
      <WagmiConfig client={wagmiClient}>
        <TypeChainProvider>
          <TestContext />
        </TypeChainProvider>
      </WagmiConfig>
    );

    const contractKeys = Object.keys(hookValue);

    const hasAllFactories =
      contractKeys.length === factoryKeys.length &&
      factoryKeys.every((key) => {
        return !!hookValue[key.replace('__factory', '')];
      });

    expect(hasAllFactories).toBeTruthy();
  });
});
