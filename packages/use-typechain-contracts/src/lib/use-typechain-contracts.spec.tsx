import { render } from '@testing-library/react';

import { init } from './use-typechain-contracts';

const { TypeChainProvider, useContracts } = init({});

describe('TypeChainProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TypeChainProvider>
        <div>Hello world</div>
      </TypeChainProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});

describe('useContracts', () => {
  it('should render successfully', () => {
    expect(useContracts).toBeTruthy();
  });
});
