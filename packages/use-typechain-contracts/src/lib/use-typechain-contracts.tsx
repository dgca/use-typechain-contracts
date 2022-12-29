import { ContractFactory, Signer, providers } from 'ethers';
import React, { useContext, useMemo } from 'react';
import { useProvider } from 'wagmi';

type Provider = providers.Provider;

type TypechainFactory = Omit<typeof ContractFactory, 'connect'> & {
  connect(address: string, signerOrProvider: Signer | Provider): any;
};

export function init<
  T extends Record<string, TypechainFactory>,
  U extends Record<string, string>
>(factories: T, defaultAddresses?: U) {
  type FactoriesMap = T extends Record<infer R, any>
    ? {
        [K in R]: T[K];
      }
    : never;

  type FactoryKeys = T extends Record<infer R, any> ? R : never;

  type Factories = FactoriesMap extends never
    ? never
    : FactoriesMap[FactoryKeys];

  type ContractNames = FactoryKeys extends string
    ? {
        [K in FactoryKeys]: K extends `${infer Name}__factory` ? Name : never;
      }[FactoryKeys]
    : never;

  type ContractNamesToContracts = ContractNames extends never
    ? never
    : {
        [K in ContractNames]: ReturnType<
          FactoriesMap[`${K}__factory`]['connect']
        >;
      };

  type HasDefaultAddresses = U extends infer R
    ? Record<string, string> extends R
      ? false
      : true
    : never;

  type TypeChainProviderValue = ContractNames extends never
    ? never
    : {
        [K in ContractNames]: HasDefaultAddresses extends true
          ? K extends keyof U
            ? (address?: string) => ContractNamesToContracts[K]
            : (address: string) => ContractNamesToContracts[K]
          : (address: string) => ContractNamesToContracts[K];
      };

  const factoryKeysLookup = new Set(
    Object.keys(factories).filter((key): key is FactoryKeys =>
      key.endsWith('__factory')
    )
  );

  function isFactoryKey(maybeKey: string): maybeKey is FactoryKeys {
    return (factoryKeysLookup as Set<unknown>).has(maybeKey);
  }

  function applyProvider<T extends Factories>(
    name: string,
    factory: T,
    provider: Signer | Provider
  ) {
    const defaultAddress = defaultAddresses?.[name] ?? '';
    return (address: string = defaultAddress) =>
      factory.connect(address, provider);
  }

  function isTypeChainProviderValue(
    obj: Record<string, unknown>
  ): obj is TypeChainProviderValue {
    const contractNames = Object.keys(factories).map((name) =>
      name.replace(/__factory$/, '')
    );

    return contractNames.every((key) => key in obj);
  }

  const TypeChainContext = React.createContext<TypeChainProviderValue | null>(
    null
  );

  /**
   * Returns an object that contains utilities to connect to deployed contracts.
   * The object contains a function for every contract that will return a contract instance.
   *
   * @example
   * ```
   * function MyComponent() {
   *   const address = '0x123abc';
   *   const greeter = useContracts().Greeter(address);
   *
   *   useEffect(() => {
   *     greeter
   *       .greet()
   *       .then((value) => console.log(value));
   *   }, []);
   *
   *   return null;
   * }
   * ```
   */
  function useContracts() {
    const value = useContext(TypeChainContext);
    if (value === null) {
      throw new Error('TypeChainProvider not found in React tree');
    }
    return value;
  }

  function TypeChainProvider({ children }: { children: React.ReactNode }) {
    const provider = useProvider();

    const value = useMemo(() => {
      const factoryEntries = Object.entries(factories)
        .filter((entry): entry is [string, Factories] => {
          const [name] = entry;
          return isFactoryKey(name);
        })
        .map<[string, ReturnType<typeof applyProvider>]>(([name, factory]) => {
          const formattedName = name.replace(/__factory$/, '');
          return [
            formattedName,
            applyProvider(formattedName, factory, provider),
          ];
        });

      const maybeFactoryObject = Object.fromEntries(factoryEntries);

      if (!isTypeChainProviderValue(maybeFactoryObject)) {
        throw new Error('Invalid object found.');
      }

      return maybeFactoryObject;
    }, [provider]);

    return (
      <TypeChainContext.Provider value={value}>
        {children}
      </TypeChainContext.Provider>
    );
  }

  return {
    useContracts,
    TypeChainProvider,
  };
}
