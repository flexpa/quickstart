import React from 'react';

export interface AppState {
    flexpaAccessToken: string;
    patient: string;
    fhirBaseURL: string;
}

export interface AppContext {
    app: AppState | null;
    setApp: (app: AppState) => void;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);

export function useAppContext() {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("AppContext is undefined. Make sure you're calling useAppContext inside of AppProvider.");
    }

    return context;
}

interface AppProviderProps {
    children?: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [app, setApp] = React.useState<AppState | null>(null);
    return <AppContext.Provider value={{ app, setApp }}>{children}</AppContext.Provider>;
}
