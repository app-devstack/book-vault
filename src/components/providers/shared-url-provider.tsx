import { SharedUrlData, useSharedUrl } from "@/hooks/useSharedUrl";
import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";

interface SharedUrlContextType {
  sharedUrl: SharedUrlData | null;
  isProcessing: boolean;
  clearSharedUrl: () => void;
  acceptSharedUrl: (callback?: (url: string) => void | Promise<void>) => Promise<void>;
}

const SharedUrlContext = createContext<SharedUrlContextType | undefined>(undefined);

export const useSharedUrlContext = () => {
  const context = useContext(SharedUrlContext);
  if (context === undefined) {
    // プロバイダーが初期化されていない場合はデフォルト値を返す
    return {
      sharedUrl: null,
      isProcessing: false,
      clearSharedUrl: () => {},
      acceptSharedUrl: async () => {}
    };
  }
  return context;
};

interface SharedUrlProviderProps {
  children: ReactNode;
}

export const SharedUrlProvider: React.FC<SharedUrlProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  // プロバイダーの初期化を遅延
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // 初期化が完了していない場合は子コンポーネントのみレンダリング
  if (!isReady) {
    return <>{children}</>;
  }

  return <SharedUrlProviderContent>{children}</SharedUrlProviderContent>;
};

const SharedUrlProviderContent: React.FC<SharedUrlProviderProps> = ({ children }) => {
  const sharedUrlHook = useSharedUrl();

  return (
    <SharedUrlContext.Provider value={sharedUrlHook}>
      {children}
    </SharedUrlContext.Provider>
  );
};