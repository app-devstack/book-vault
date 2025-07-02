import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

interface SharedUrlData {
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
        if (initialUrl) {
          setSharedUrl({
            url: initialUrl,
            timestamp: Date.now(),
          });
          Toast.show({
            type: 'info',
            text1: 'Shared URL Detected',
            text2: initialUrl,
          });
        }
      } catch (error) {
        console.error('Failed to get initial URL:', error);
      }
    };

    const handleUrlChange = ({ url }: { url: string }) => {
      if (url) {
        setSharedUrl({
          url: url,
          timestamp: Date.now(),
        });
        Toast.show({
          type: 'info',
          text1: 'Shared URL Detected',
          text2: url,
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
