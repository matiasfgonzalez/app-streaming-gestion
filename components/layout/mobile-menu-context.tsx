"use client";

import { createContext, useContext, useState } from "react";

type MobileMenu = { open: boolean; setOpen: (v: boolean) => void };

const MobileMenuContext = createContext<MobileMenu>({
  open: false,
  setOpen: () => {},
});

/** Comparte el estado del drawer mobile entre Navbar y BottomNav (para ocultarlo). */
export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MobileMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export const useMobileMenu = () => useContext(MobileMenuContext);
