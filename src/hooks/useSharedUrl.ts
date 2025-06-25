import { useShareIntentContext } from 'expo-share-intent';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

 interface SharedUrlData {
  url: string;
  timestamp: number;
}

export const useSharedUrl = () => {
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntentContext();
  const [sharedUrl, setSharedUrl] = useState<SharedUrlData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (hasShareIntent) {
      setSharedUrl({
        url: shareIntent.webUrl || shareIntent.text || '',
        timestamp: Date.now(),
      });

      Toast.show({
        type: 'success',
        text1: 'Shared URL Received',
        text2: shareIntent.webUrl || shareIntent.text || '',
      });
      resetShareIntent();  // 次回受信に備えてリセット
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

  const clearSharedUrl = () => {
    setSharedUrl(null);
  };

  const acceptSharedUrl = async (callback?: (url: string) => void | Promise<void>) => {
    if (!sharedUrl) return;

    setIsProcessing(true);
    try {
      if (callback) {
        await callback(sharedUrl.url);
      }
      clearSharedUrl();
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
    clearSharedUrl,
    acceptSharedUrl,
  };
};