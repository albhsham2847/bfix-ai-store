"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Customer = {
  name: string;
  phone: string;
  email: string;
};

const CustomerCtx = createContext<{
  customer: Customer | null;
  login: (c: Customer) => void;
  logout: () => void;
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
}>({
  customer: null,
  login: () => {},
  logout: () => {},
  showAuth: false,
  setShowAuth: () => {},
});

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bfix-customer");
      if (stored) setCustomer(JSON.parse(stored));
    } catch {}
  }, []);

  const login = useCallback((c: Customer) => {
    setCustomer(c);
    localStorage.setItem("bfix-customer", JSON.stringify(c));
    setShowAuth(false);
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    localStorage.removeItem("bfix-customer");
  }, []);

  return (
    <CustomerCtx.Provider value={{ customer, login, logout, showAuth, setShowAuth }}>
      {children}
    </CustomerCtx.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerCtx);
}
