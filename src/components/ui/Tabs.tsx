import { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';

interface TabsContextValue {
    active: string;
    setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('Tab components must be used inside <Tabs>');
    return ctx;
};

export const Tabs = ({
    defaultTab,
    children,
    className,
}: {
    defaultTab: string;
    children: React.ReactNode;
    className?: string;
}) => {
    const [active, setActive] = useState(defaultTab);
    return (
        <TabsContext.Provider value={{ active, setActive }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

export const TabList = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={cn(
            'flex items-center gap-0.5 border-b border-border',
            className,
        )}
    >
        {children}
    </div>
);

export const Tab = ({
    id,
    children,
    count,
}: {
    id: string;
    children: React.ReactNode;
    count?: number;
}) => {
    const { active, setActive } = useTabs();
    const isActive = active === id;
    return (
        <button
            onClick={() => setActive(id)}
            className={cn(
                'relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium',
                'transition-colors duration-150 select-none',
                isActive
                    ? 'text-text'
                    : 'text-text-tertiary hover:text-text-secondary',
            )}
        >
            {children}
            {count !== undefined && (
                <span
                    className={cn(
                        'inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-semibold',
                        isActive
                            ? 'bg-accent text-white'
                            : 'bg-bg-secondary text-text-tertiary',
                    )}
                >
                    {count}
                </span>
            )}
            {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent" />
            )}
        </button>
    );
};

export const TabPanel = ({
    id,
    children,
    className,
}: {
    id: string;
    children: React.ReactNode;
    className?: string;
}) => {
    const { active } = useTabs();
    if (active !== id) return null;
    return (
        <div className={cn('animate-fade-in', className)}>
            {children}
        </div>
    );
};