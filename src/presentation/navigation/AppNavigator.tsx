import React from 'react';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { useNavigation } from './NavigationProvider';
import { ScreenName } from './routes';

export const AppNavigator = () => {
    const { currentRoute } = useNavigation();

    switch (currentRoute.name) {
        case ScreenName.Home:
        return <HomeScreen />;
        case ScreenName.Detail:
        return <DetailScreen pokemon={currentRoute.params.pokemon} />;
    }
};