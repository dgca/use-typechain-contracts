# use-typechain-contracts

React hook and context provider that allows you to easily consume connected TypeChain contract factories.

---

## Features

* Access all of your contracts via a single `useContracts()` hook
* Contracts are automatically connected to the available ethers Provider
* Optionally set default contract addresses
* Contracts returned by `useContracts()` are entirely type-safe

## Requirements

* `react >=16`
* `ethers ^5.7.0`
* `wagmi ^0.9.0 || ^0.10.0`
* [TypeChain](https://github.com/dethcrypto/TypeChain)
  * Not a dependency of the project, but this library wraps TypeChain's generated contract factories to work.

## Usage

### Installation

You know the drill...

* `npm install use-typechain-contracts`
* `yarn add use-typechain-contracts`

### Initialization

First, initialize the system by calling the `init` function and passing all of TypeChain's exports (e.g. do this via `import * as typechain from '...'`) as the first argument.

If you'd like to set up some default contract addresses, you may optionally do so by passing an object as a second argument where the keys are the name of the contracts, and the values are the address for that contract. If you do not pass a default contract address for a contract, you'll have to provide it when using the `useContracts` hook.

`init` returns a `TypeChainProvider` context provider and a `useContracts` hook. Export these items, as these are what you'll be using in your application.

```tsx
// src/utils/contracts.ts
import { init } from 'use-typechain-contracts';

import * as typechain from 'path/to/typechain';

/*
 * Assume my project has two contracts, Greeter and Todos. Greeter is a singleton that
 * only has one contract address, and Todos may be deployed multiple times (i.e. it will
 * have multiple contract addresses). I can set the deafult contract address for Greeter here,
 * and now when I use it by using `const greeter = useContracts().Greeter()`, it'll automatically
 * connect to the default contract address.
 *
 * In order to use a Todo instance, I'll have to specify the address when using `useContracts()`.
 * E.g. `const todoInstance = useContracts().Todos('0xEXAMPLExADDRESS')`.
 */
const { TypeChainProvider, useContracts } = init(typechain, {
  Greeter: '0x123xDEMOxADDRESSx420',
});

export { TypeChainProvider, useContracts };
```

### Provider

Next, wrap your application in the `TypeChainProvider`. Make sure your `WagmiConfig` provider is higher up in the component tree, as `TypeChainProvider` uses `wagmi` under the hood.

```tsx
// src/app/app.tsx
import { TypeChainProvider } from '../utils/contracts';

export function App() {
  return (
    <WagmiConfig client={...}>
      <TypeChainProvider>
        <Demo />
      </TypeChainProvider>
    </WagmiConfig>
  );
}
```

### `useContracts` hook

Finally, to use your contracts, import the `useContracts` hook you created earlier.

If you set a default contract address for a given contract, you can omit the contract address when getting that contract. If you did not set a default contract address, you must provide the contract address or you will see a type error.

```tsx
// src/app/demo.tsx
import { useState, useEffect } from 'react';
import { useContracts } from '../utils/contracts';

export function Greeter() {
  const contracts = useContracts();
  const greeter = contracts.Greeter();

  const [greeting, setGreeting] = useState('Loading...');

  useEffect(() => {
    const fetchGreeting = async () => {
      const currentGreeting = await greeter.getGreeting();
      setGreeting(currentGreeting);
    };

    fetchGreeting();
  }, []);

  return (
    <div>
      <h1>Greeter</h1>
      <p>{greeting}</p>
    </div>
  );
}
```
