"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  balance: number;
};

const CustomerCtx = createContext<{
  customer: Customer | null;
  login: (c: Customer) => void;
  logout: () => void;
  refreshBalance: () => void;
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
}>({
  customer: null,
  login: () => {},
  logout: () => {},
  refreshBalance: () => {},
  showAuth: false,
  setShowAuth: () => {},
});

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bfix-customer");
      if (stored) {
        const c = JSON.parse(stored) as Customer;
        setCustomer(c);
        // Refresh balance from server
        fetch(`/api/customers/${c.id}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d) setCustomer((prev) => prev ? { ...prev, balance: Number(d.balance ?? 0) } : prev);
          })
          .catch(() => {});
      }
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

  const refreshBalance = useCallback(async () => {
    if (!customer) return;
    try {
      const r = await fetch(`/api/customers/${customer.id}`);
      if (r.ok) {
        const d = await r.json();
        const updated = { ...customer, balance: Number(d.balance ?? 0) };
        setCustomer(updated);
        localStorage.setItem("bfix-customer", JSON.stringify(updated));
      }
    } catch {}
  }, [customer]);

  return (
    <CustomerCtx.Provider value={{ customer, login, logout, refreshBalance, showAuth, setShowAuth }}>
      {children}
    </CustomerCtx.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerCtx);
}
