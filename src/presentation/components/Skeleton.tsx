import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { colors, radius } from '../theme/tokens';

export interface SkeletonProps {
    readonly width?: DimensionValue;
    readonly height?: DimensionValue;
    readonly borderRadius?: number;
    readonly style?: StyleProp<ViewStyle>;
}

export const Skeleton = ({
    width = '100%',
    height = 16,
    borderRadius = radius.sm,
    style,
}: SkeletonProps) => {
    const pulse = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
        Animated.sequence([
            Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        ]),
        );
        animation.start();
        return () => animation.stop();
    }, [pulse]);

    return (
        <Animated.View
        accessibilityRole="progressbar"
        style={[{ width, height, borderRadius, backgroundColor: colors.skeleton, opacity: pulse }, style]}
        />
    );
};