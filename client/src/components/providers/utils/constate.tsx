import React from 'react';

/**
 * プロバイダー作成関数
 *
 * @example
 * const useCount = () => {
 *  const [count, setCount] = React.useState(0);
 * const increment = () => setCount((prev) => prev + 1);
 * return { count, increment };
 * }
 *
 * const constate = createConstate(useCount);
 *
 * export default function CountProvider({ children }: { children: React.ReactNode }) {
 *   return (
 *    <constate.Provider>
 *     {children}
 *    </constate.Provider>
 *  );
 *
 * export const useCountContext = constate.useContextValue;
 */
export function createConstate<Props, Value>(useValue: (props: Props) => Value) {
  const Context = React.createContext<Value | null>(null);

  const Provider = ({ children, ...props }: React.PropsWithChildren<Props>) => {
    const value = useValue(props as Props);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useContextValue = () => {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error('Context must be used within its Provider');
    }
    return context;
  };

  return {
    Provider,
    useContextValue,
  };
}
