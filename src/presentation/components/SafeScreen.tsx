import React, { PropsWithChildren } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/tokens';

export interface SafeScreenProps {
    readonly backgroundColor?: string;
    readonly style?: ViewStyle;
}

export const SafeScreen = ({
    children,
    backgroundColor = colors.background,
    style,
}: PropsWithChildren<SafeScreenProps>) => {
    if (Platform.OS === 'ios') {
        return <SafeAreaView style={[styles.container, { backgroundColor }, style]}>{children}</SafeAreaView>;
    }
    return (
        <View style={[styles.container, { backgroundColor, paddingTop: StatusBar.currentHeight ?? 0 }, style]}>
        {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});