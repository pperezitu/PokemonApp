import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

// 255 es el stat base máximo posible en los juegos
const DEFAULT_MAX_STAT = 255;

export interface StatBarProps {
    readonly label: string;
    readonly value: number;
    readonly maxValue?: number;
}

export const StatBar = ({ label, value, maxValue = DEFAULT_MAX_STAT }: StatBarProps) => {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
        toValue: Math.min(value / maxValue, 1),
        duration: 600,
        useNativeDriver: true,
        }).start();
    }, [progress, value, maxValue]);

    return (
        <View style={styles.container} accessibilityLabel={`${label}: ${value} de ${maxValue}`}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.track}>
            <Animated.View
            style={[styles.fill, { transform: [{ scaleX: progress }] }]}
            />
        </View>
        <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm + 2 },
    label: { width: 96, fontSize: 13, color: colors.textSecondary },
    track: {
        flex: 1,
        height: 8,
        borderRadius: radius.sm,
        backgroundColor: colors.skeleton,
        overflow: 'hidden',
    },
    fill: {
        width: '100%',
        height: '100%',
        borderRadius: radius.sm,
        backgroundColor: colors.primary,
        transformOrigin: 'left',
    },
    value: { width: 40, textAlign: 'right', fontSize: 13, fontWeight: '600', color: colors.text },
});