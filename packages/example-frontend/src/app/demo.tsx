import { useContracts } from '../utils/contracts';

export function Demo() {
  const contracts = useContracts();

  return (
    <div>
      <h1>Demo</h1>
      <p>I have the following contracts:</p>
      <ul>
        {Object.entries(contracts).map(([name, factory], i) => {
          return (
            <li key={i}>
              Name: {name}
              <br />
              Address:{' '}
              {/* Ugly hack to force the default argument to be shown */}
              {factory(undefined as unknown as string).address ||
                'No default address provided'}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
