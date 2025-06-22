import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';

 interface SharedUrlData {
  url: string;
  timestamp: number;
}

export const useSharedUrl = () => {
  const [sharedUrl, setSharedUrl] = useState<SharedUrlData | null>({url: "https://claude.ai/chat/d2a75ea7-3a80-4738-a4a1-b88f6a1083a3", timestamp: 0});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && (initialUrl.startsWith('http') || initialUrl.startsWith('https'))) {
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
        setSharedUrl({
          url: url,
          timestamp: Date.now(),
        });
      }
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener('url', handleUrlChange);

    return () => {
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