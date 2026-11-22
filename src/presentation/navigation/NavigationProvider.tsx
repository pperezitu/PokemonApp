import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { BackHandler } from 'react-native';
import { homeRoute, Route } from './routes';

export interface NavigationActions {
    readonly currentRoute: Route;
    readonly canGoBack: boolean;
    navigate: (route: Route) => void;
    goBack: () => void;
}

const NavigationContext = createContext<NavigationActions | null>(null);

export const NavigationProvider = ({ children }: PropsWithChildren) => {
    const [stack, setStack] = useState<Route[]>([homeRoute()]);
    const stackRef = useRef(stack);
    stackRef.current = stack;

    const navigate = useCallback((route: Route) => {
        setStack(prev => [...prev, route]);
    }, []);

    const goBack = useCallback(() => {
        setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, []);

    // Android: hardware back button. iOS: el listener existe pero nunca se dispara.
    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            if (stackRef.current.length > 1) {
                setStack(prev => prev.slice(0, -1));
                return true; // consumir: volver atrás
            }
            return false; // permitir salir de la app
            });
            return () => subscription.remove();
        }, []
    );

    const value = useMemo<NavigationActions>(
        () => ({
        currentRoute: stack[stack.length - 1],
        canGoBack: stack.length > 1,
        navigate,
        goBack,
        }),
        [stack, navigate, goBack],
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationActions => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation debe usarse dentro de <NavigationProvider>');
    }
    return context;
};