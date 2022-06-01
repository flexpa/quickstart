import React from 'react';

export interface AppState {
    flexpaAccessToken: string;
    patient: string;
    fhirBaseURL: string;
}

export interface AppContext {
    app: AppState | null;
    setApp: (app: AppState | (() => AppState)) => void;
    isLoading: Boolean;
    setIsLoading: (isLoading: Boolean) => void;
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
    const [isLoading, setIsLoading] = React.useState<Boolean>(false);
    return <AppContext.Provider value={{ app, setApp, isLoading, setIsLoading }}>{children}</AppContext.Provider>;
}
