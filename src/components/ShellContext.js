import { createContext, useContext } from 'react';

export const ShellCtx = createContext({
  ready: false,
  leaveTo: () => {},
  menuOpen: false,
  toggleMenu: () => {},
  closeMenu: () => {},
});

export const useShell = () => useContext(ShellCtx);
