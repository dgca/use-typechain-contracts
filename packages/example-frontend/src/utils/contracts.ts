import { init } from '@dgca/use-typechain-contracts';
import { factories } from '@dgca/example-contracts';

const { TypeChainProvider, useContracts } = init(factories, {
  Greeter: '0x123xDEMOxADDRESSx420',
});

export { TypeChainProvider, useContracts };
