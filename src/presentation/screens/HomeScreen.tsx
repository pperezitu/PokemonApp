import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonCardSkeleton } from '../components/PokemonCardSkeleton';
import { SafeScreen } from '../components/SafeScreen';
import { EmptyState } from '../components/states/EmptyState';
import { ErrorState } from '../components/states/ErrorState';
import { usePokemonList } from '../hooks/usePokemonList';
import { useNavigation } from '../navigation/NavigationProvider';
import { detailRoute } from '../navigation/routes';
import { colors, spacing, typography } from '../theme/tokens';

const SKELETON_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7];

const columnsForWidth = (width: number): number => {
    if (width >= 900) {
        return 4;
    }
    if (width >= 600) {
        return 3;
    }
    return 2;
};

export const HomeScreen = () => {
    const { data, error, isLoading, reload } = usePokemonList();
    const { navigate } = useNavigation();
    const { width } = useWindowDimensions();
    const numColumns = columnsForWidth(width);

    const handlePress = useCallback(
        (pokemon: PokemonSummary) => navigate(detailRoute(pokemon)),
        [navigate],
    );

    const renderPokemon = useCallback(
        ({ item }: ListRenderItemInfo<PokemonSummary>) => <PokemonCard pokemon={item} onPress={handlePress} />,
        [handlePress],
    );

    const renderSkeleton = useCallback(() => <PokemonCardSkeleton />, []);

    const keyExtractor = useCallback((item: PokemonSummary) => String(item.id), []);
    const skeletonKeyExtractor = useCallback((item: number) => `skeleton-${item}`, []);

    const listContent = useMemo(() => ({ ...styles.listContent, gap: spacing.sm }), []);

    const renderContent = () => {
        if (isLoading) {
        return (
            <FlatList
            key={`skeleton-${numColumns}`}
            data={SKELETON_ITEMS}
            renderItem={renderSkeleton}
            keyExtractor={skeletonKeyExtractor}
            numColumns={numColumns}
            columnWrapperStyle={styles.row}
            contentContainerStyle={listContent}
            scrollEnabled={false}
            />
        );
        }
        if (error) {
        return <ErrorState error={error} onRetry={reload} />;
        }
        if (!data || data.length === 0) {
        return <EmptyState title="Sin Pokémon" message="No se encontraron resultados en PokéAPI." />;
        }
        return (
        <FlatList
            key={`list-${numColumns}`}
            data={data}
            renderItem={renderPokemon}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            columnWrapperStyle={styles.row}
            contentContainerStyle={listContent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={7}
            showsVerticalScrollIndicator={false}
        />
        );
    };

    return (
        <SafeScreen>
        <View style={styles.header}>
            <Text style={styles.title}>Pokédex</Text>
            <Text style={styles.subtitle}>Los primeros 20 Pokémon</Text>
        </View>
        {renderContent()}
        </SafeScreen>
    );
};

const styles = StyleSheet.create({
    header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
    title: { ...typography.title, color: colors.text },
    subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    listContent: { padding: spacing.md },
    row: { gap: spacing.sm },
});