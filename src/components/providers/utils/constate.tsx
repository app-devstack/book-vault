import React from 'react';

/**
 * プロバイダー作成関数
 */
export function createConstate<T>(useValue: () => T) {
  const Context = React.createContext<T | null>(null);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const value = useValue();
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

// function useCount() {
//   const [count, setCount] = React.useState(0);
//   const increment = () => setCount((prev) => prev + 1);
//   return { count, increment };
// }

// const constate = createConstate(useCount);

// export default function LayoutProvider({ children }: { children: React.ReactNode }) {
//   useInitSessionUser();

//   return (
//     <constate.Provider>
//       {children}
//       <Toaster />
//     </constate.Provider>
//   );
// }

// export const useLayoutContext = constate.useContextValue;