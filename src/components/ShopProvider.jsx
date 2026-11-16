import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { loadShop, shopReducer } from '../data/shop';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [shop, dispatch] = useReducer(shopReducer, undefined, loadShop);
  useEffect(() => {
    try { localStorage.setItem('drip-store-shop', JSON.stringify(shop)); }
    catch { /* Keep the current session usable when storage is unavailable. */ }
  }, [shop]);
  return <ShopContext.Provider value={{ ...shop, dispatch }}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
