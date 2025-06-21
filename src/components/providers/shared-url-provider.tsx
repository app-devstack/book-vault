import { SharedUrlData, useSharedUrl } from "@/hooks/useSharedUrl";
import React, { createContext, ReactNode, useContext } from "react";

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
    throw new Error("useSharedUrlContext must be used within a SharedUrlProvider");
  }
  return context;
};

interface SharedUrlProviderProps {
  children: ReactNode;
}

export const SharedUrlProvider: React.FC<SharedUrlProviderProps> = ({ children }) => {
  const sharedUrlHook = useSharedUrl();

  return (
    <SharedUrlContext.Provider value={sharedUrlHook}>
      {children}
    </SharedUrlContext.Provider>
  );
};