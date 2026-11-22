import React, { createContext, PropsWithChildren, useContext } from 'react';
import { AppContainer, createAppContainer } from './container';

// Un único contenedor para toda la app (composition root singleton)
const appContainer = createAppContainer();

const DependencyContext = createContext<AppContainer>(appContainer);

export const DependencyProvider = ({ children }: PropsWithChildren) => (
    <DependencyContext.Provider value={appContainer}>{children}</DependencyContext.Provider>
);

export const useDependencies = (): AppContainer => useContext(DependencyContext);