import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

/**
 * AsyncStorageを使用した汎用的なデータ永続化フック
 * @param key ストレージキー
 * @param initialValue 初期値
 * @returns [storedValue, setValue, removeValue]
 */
export const useAsyncStorage = <T>(key: string, initialValue: T | null = null) => {
  const [storedValue, setStoredValue] = useState<T | null>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // ストレージから値を読み込む
  const loadValue = useCallback(async () => {
    try {
      setIsLoading(true);
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        const parsedValue = JSON.parse(item) as T;
        setStoredValue(parsedValue);
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Failed to load value from AsyncStorage (key: ${key}):`, error);
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  // ストレージに値を保存する
  const setValue = useCallback(
    async (value: T | null) => {
      try {
        if (value === null) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        }
        setStoredValue(value);
      } catch (error) {
        console.error(`Failed to save value to AsyncStorage (key: ${key}):`, error);
        throw error;
      }
    },
    [key]
  );

  // ストレージから値を削除する
  const removeValue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Failed to remove value from AsyncStorage (key: ${key}):`, error);
      throw error;
    }
  }, [key]);

  // 初回読み込み
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  return {
    storedValue,
    setValue,
    removeValue,
    isLoading,
  };
};
