import React, { memo, useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { capitalize } from '../../core/utils/text';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { colors, radius, spacing, typography } from '../theme/tokens';

export interface PokemonCardProps {
    readonly pokemon: PokemonSummary;
    readonly onPress: (pokemon: PokemonSummary) => void;
}

const PokemonCardComponent = ({ pokemon, onPress }: PokemonCardProps) => {
    const [imageFailed, setImageFailed] = useState(false);

    const handlePress = useCallback(() => onPress(pokemon), [onPress, pokemon]);
    const handleImageError = useCallback(() => setImageFailed(true), []);

    return (
        <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalle de ${pokemon.name}`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
        {imageFailed ? (
            <View style={styles.imageFallback} accessibilityLabel="Imagen no disponible">
            <Text style={styles.fallbackText}>?</Text>
            </View>
        ) : (
            <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onError={handleImageError}
            accessibilityLabel={`Imagen de ${pokemon.name}`}
            />
        )}
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.name} numberOfLines={1}>
            {capitalize(pokemon.name)}
        </Text>
        </Pressable>
    );
};

export const PokemonCard = memo(PokemonCardComponent);

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
    cardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    image: { width: 96, height: 96 },
    imageFallback: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.skeleton,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fallbackText: { fontSize: 28, fontWeight: '700', color: colors.textSecondary },
    id: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
    name: { ...typography.subtitle, color: colors.text, marginTop: 2 },
});