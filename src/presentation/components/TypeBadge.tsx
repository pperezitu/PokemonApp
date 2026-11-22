import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { capitalize } from '../../core/utils/text';
import { PokemonTypeName } from '../../domain/entities/PokemonType';
import { colors, radius, spacing, TYPE_COLORS } from '../theme/tokens';

export interface TypeBadgeProps {
    readonly type: PokemonTypeName;
}

export const TypeBadge = ({ type }: TypeBadgeProps) => (
    <View
        style={[styles.badge, { backgroundColor: TYPE_COLORS[type] ?? colors.textSecondary }]}
        accessibilityLabel={`Tipo ${capitalize(type)}`}
    >
        <Text style={styles.text}>{capitalize(type)}</Text>
    </View>
);

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.md,
    },
    text: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});