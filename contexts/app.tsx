import React from 'react';

export interface AppState {
    flexpaJwt: string;
    patient: string;
    fhirBaseURL: string;
}

export interface AppContext {
    app: AppState | null;
    setApp: (app: AppState) => void;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);

export function useAppContext() {
    const ctx = React.useContext(AppContext);
    if (!ctx) {
        throw new Error("AppContext is undefined. Make sure you're calling useAppContext inside of AppProvider.");
    }

    return ctx;
}

interface AppProviderProps {
    children?: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [app, setApp] = React.useState<AppState | null>(null);
    return <AppContext.Provider value={{ app, setApp }}>{children}</AppContext.Provider>;
}
