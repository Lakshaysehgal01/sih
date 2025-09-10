import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface DrawerContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function useDrawerContext() {
  const ctx = useContext(DrawerContext);
  if (!ctx)
    throw new Error("useDrawerContext must be used within DrawerProvider");
  return ctx;
}

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}
