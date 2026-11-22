import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export interface EmptyStateProps {
    readonly title: string;
    readonly message?: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
    title: { ...typography.subtitle, color: colors.text, marginBottom: spacing.xs },
    message: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});