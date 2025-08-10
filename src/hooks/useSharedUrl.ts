import { useShareIntentContext } from 'expo-share-intent';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAsyncStorage } from './useAsyncStorage';

/*
interface BaseShareIntent {
    meta?: ShareIntentMeta | null;
    text?: string | null;
}

export type ShareIntent = BaseShareIntent & {
    files: ShareIntentFile[] | null;
    type: "media" | "file" | "text" | "weburl" | null;
    webUrl: string | null;
};

 */

interface SharedUrlData {
  url: string;
  timestamp: number;
}

export const useSharedUrl = () => {
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntentContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // AsyncStorageを使用した永続化
  const {
    storedValue: sharedUrl,
    setValue: setSharedUrl,
    removeValue: removeSharedUrl,
    isLoading,
  } = useAsyncStorage<SharedUrlData>('sharedUrlData');

  useEffect(() => {
    if (hasShareIntent) {
      const newSharedUrlData = {
        url: shareIntent.webUrl || shareIntent.text || '',
        timestamp: Date.now(),
      };
      setSharedUrl(newSharedUrlData);

      Toast.show({
        type: 'success',
        text1: 'Shared URL Received',
        text2: shareIntent.webUrl || shareIntent.text || '',
      });
      resetShareIntent(); // 次回受信に備えてリセット
    }

    if (error) {
      console.error('Share Intent Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Share Intent Error',
        text2: error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasShareIntent]);

  const clearSharedUrl = async () => {
    await removeSharedUrl();
  };

  const acceptSharedUrl = async (callback?: (url: string) => void | Promise<void>) => {
    if (!sharedUrl) return;

    setIsProcessing(true);
    try {
      if (callback) {
        await callback(sharedUrl.url);
      }
      await clearSharedUrl();
    } catch (error) {
      console.error('Failed to process shared URL:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    sharedUrl,
    isProcessing,
    isLoading,
    clearSharedUrl,
    acceptSharedUrl,
  };
};
