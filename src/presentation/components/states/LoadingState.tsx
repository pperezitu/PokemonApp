import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';

export const LoadingState = () => (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="Cargando">
        <ActivityIndicator size="large" color={colors.primary} />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});