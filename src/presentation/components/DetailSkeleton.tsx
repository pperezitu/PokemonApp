import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme/tokens';
import { Skeleton } from './Skeleton';

const STAT_LINES = [0, 1, 2, 3, 4, 5];

export const DetailSkeleton = () => (
    <View style={styles.container} accessibilityLabel="Cargando información del Pokémon">
        <View style={styles.typesRow}>
        <Skeleton width={84} height={30} borderRadius={12} />
        <Skeleton width={84} height={30} borderRadius={12} />
        </View>
        <View style={styles.infoRow}>
        <Skeleton width="31%" height={60} borderRadius={12} />
        <Skeleton width="31%" height={60} borderRadius={12} />
        <Skeleton width="31%" height={60} borderRadius={12} />
        </View>
        <Skeleton width={120} height={20} style={styles.section} />
        <Skeleton width="100%" height={18} />
        <Skeleton width="75%" height={18} style={styles.line} />
        <Skeleton width={160} height={20} style={styles.section} />
        {STAT_LINES.map(line => (
        <Skeleton key={line} width="100%" height={14} style={styles.line} />
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: { paddingTop: spacing.lg, paddingHorizontal: spacing.md },
    typesRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
    section: { marginTop: spacing.lg, marginBottom: spacing.sm },
    line: { marginTop: spacing.sm },
});