import { useCallback, useState } from "react";

interface LoadingStates {
  initialize: boolean;
  addBook: boolean;
  removeBook: boolean;
  createSeries: boolean;
}

export const useLoadingStates = () => {
  const [loading, setLoading] = useState<LoadingStates>({
    initialize: false,
    addBook: false,
    removeBook: false,
    createSeries: false
  });

  const withLoadingState = useCallback(<T,>(
    operation: keyof LoadingStates,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    return new Promise(async (resolve, reject) => {
      setLoading(prev => ({ ...prev, [operation]: true }));

      try {
        const result = await asyncFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(prev => ({ ...prev, [operation]: false }));
      }
    });
  }, []);

  return {
    loading,
    withLoadingState,
  };
};