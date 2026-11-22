import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getFriendlyMessage } from '../../../core/errors/errorMessages';
import { colors, radius, spacing, typography } from '../../theme/tokens';

export interface ErrorStateProps {
    readonly error: unknown;
    readonly onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
    <View style={styles.container} accessibilityRole="alert">
        <Text style={styles.title}>Algo salió mal</Text>
        <Text style={styles.message}>{getFriendlyMessage(error)}</Text>
        <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Reintentar carga"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
        <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
    title: { ...typography.subtitle, color: colors.text, marginBottom: spacing.sm },
    message: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
    button: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4, borderRadius: radius.md },
    buttonPressed: { opacity: 0.8 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});