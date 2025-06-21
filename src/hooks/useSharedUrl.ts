import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';

export interface SharedUrlData {
  url: string;
  timestamp: number;
}

export const useSharedUrl = () => {
  const [sharedUrl, setSharedUrl] = useState<SharedUrlData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && (initialUrl.startsWith('http') || initialUrl.startsWith('https'))) {
          console.log('Initial URL received:', initialUrl);
          setSharedUrl({
            url: initialUrl,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to get initial URL:', error);
      }
    };

    const handleUrlChange = ({ url }: { url: string }) => {
      if (url && (url.startsWith('http') || url.startsWith('https'))) {
        console.log('URL received:', url);
        setSharedUrl({
          url: url,
          timestamp: Date.now(),
        });
      }
    };

    // 初期化処理を少し遅らせる
    const timeoutId = setTimeout(() => {
      handleInitialUrl();
    }, 100);

    const subscription = Linking.addEventListener('url', handleUrlChange);

    return () => {
      clearTimeout(timeoutId);
      subscription?.remove();
    };
  }, []);

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