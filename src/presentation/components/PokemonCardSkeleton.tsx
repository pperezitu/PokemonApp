import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Skeleton } from './Skeleton';

export const PokemonCardSkeleton = () => (
    <View style={styles.card} accessibilityLabel="Cargando Pokémon">
        <Skeleton width={96} height={96} borderRadius={48} />
        <Skeleton width={48} height={12} style={styles.line} />
        <Skeleton width="70%" height={16} style={styles.line} />
    </View>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    line: { marginTop: spacing.sm },
});