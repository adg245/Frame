import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

interface TabsContextValue { active: string; setActive: (v: string) => void; }
const TabsCtx = createContext<TabsContextValue | null>(null);
const useTabsCtx = () => { const c = useContext(TabsCtx); if (!c) throw new Error('Tabs context missing'); return c; };

interface TabsProps { defaultValue: string; children: React.ReactNode; className?: string; onChange?: (v: string) => void; }
export function Tabs({ defaultValue, children, className = '', onChange }: TabsProps) {
  const [active, setActiveState] = useState(defaultValue);
  const setActive = (v: string) => { setActiveState(v); onChange?.(v); };
  return <TabsCtx.Provider value={{ active, setActive }}><div className={className}>{children}</div></TabsCtx.Provider>;
}

interface TabsListProps { children: React.ReactNode; className?: string; }
export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={['flex gap-0.5 p-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]', className].join(' ')}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps { value: string; children: React.ReactNode; }
export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { active, setActive } = useTabsCtx();
  const isActive = active === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={[
        'relative px-4 py-1.5 text-sm rounded-md transition-colors duration-150 font-medium',
        isActive
          ? 'text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
      ].join(' ')}
    >
      {isActive && (
        <motion.span
          layoutId="tab-indicator"
          className="absolute inset-0 rounded-md bg-[var(--bg-card)] border border-[var(--border)]"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

interface TabsContentProps { value: string; children: React.ReactNode; className?: string; }
export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { active } = useTabsCtx();
  if (active !== value) return null;
  return <div role="tabpanel" className={className}>{children}</div>;
}
