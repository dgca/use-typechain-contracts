import { init } from '@dgca/use-typechain-contracts';
import * as typechain from '@dgca/example-contracts';

const { TypeChainProvider, useContracts } = init(typechain, {
  Greeter: '0x123xDEMOxADDRESSx420',
});

export { TypeChainProvider, useContracts };
