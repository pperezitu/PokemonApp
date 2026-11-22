import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { capitalize, capitalizeWords } from '../../core/utils/text';
import { PokemonStatName } from '../../domain/entities/PokemonStat';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { DetailSkeleton } from '../components/DetailSkeleton';
import { SafeScreen } from '../components/SafeScreen';
import { StatBar } from '../components/StatBar';
import { ErrorState } from '../components/states/ErrorState';
import { TypeBadge } from '../components/TypeBadge';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useNavigation } from '../navigation/NavigationProvider';
import { colors, radius, spacing, typography } from '../theme/tokens';

const STAT_LABELS: Record<PokemonStatName, string> = {
  [PokemonStatName.HP]: 'HP',
  [PokemonStatName.Attack]: 'Ataque',
  [PokemonStatName.Defense]: 'Defensa',
  [PokemonStatName.SpecialAttack]: 'At. Especial',
  [PokemonStatName.SpecialDefense]: 'Def. Especial',
  [PokemonStatName.Speed]: 'Velocidad',
};

export interface DetailScreenProps {
  readonly pokemon: PokemonSummary;
}

interface InfoCellProps {
  readonly label: string;
  readonly value: string;
}

const InfoCell = ({ label, value }: InfoCellProps) => (
    <View style={styles.infoCell}>
        <Text style={styles.infoValue}>{value}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
    </View>
);

export const DetailScreen = ({ pokemon }: DetailScreenProps) => {
    const { goBack } = useNavigation();
    const { data: detail, error, isLoading, reload } = usePokemonDetail(pokemon.id);
    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (detail) {
        Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        }
    }, [detail, fade]);

    const renderBody = () => {
        if (error) {
        return <ErrorState error={error} onRetry={reload} />;
        }
        if (isLoading || !detail) {
        return <DetailSkeleton />;
        }
        return (
        <Animated.View style={[styles.body, { opacity: fade }]}>
            <View style={styles.typesRow}>
            {detail.types.map(type => (
                <TypeBadge key={type} type={type} />
            ))}
            </View>

            <View style={styles.infoRow}>
            <InfoCell label="Altura" value={`${detail.height} cm`} />
            <InfoCell label="Peso" value={`${detail.weight} kg`} />
            <InfoCell label="Exp. base" value={String(detail.baseExperience)} />
            </View>

            <Text style={styles.sectionTitle}>Habilidades</Text>
            {detail.abilities.map(ability => (
            <View key={ability.name} style={styles.abilityRow}>
                <Text style={styles.abilityName}>{capitalizeWords(ability.name)}</Text>
                {ability.isHidden ? (
                <View style={styles.hiddenBadge} accessibilityLabel="Habilidad oculta">
                    <Text style={styles.hiddenText}>Oculta</Text>
                </View>
                ) : null}
            </View>
            ))}

            <Text style={styles.sectionTitle}>Estadísticas base</Text>
            {detail.stats.map(stat => (
            <StatBar key={stat.name} label={STAT_LABELS[stat.name]} value={stat.value} />
            ))}
        </Animated.View>
        );
    };

    return (
        <SafeScreen>
        <View style={styles.header}>
            <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Volver al listado"
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
            <Text style={styles.backText}>← Volver</Text>
            </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Cabecera instantánea: usa los datos que ya trae la ruta, sin esperar red */}
            <View style={styles.hero}>
            <Image source={{ uri: pokemon.imageUrl }} style={styles.image} resizeMode="contain" />
            <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
            <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
            </View>
            {renderBody()}
        </ScrollView>
        </SafeScreen>
    );
};

const styles = StyleSheet.create({
    header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xs },
    backButton: { alignSelf: 'flex-start', paddingVertical: spacing.xs },
    pressed: { opacity: 0.6 },
    backText: { ...typography.body, color: colors.primary, fontWeight: '600' },
    scrollContent: { flexGrow: 1, paddingBottom: spacing.xl },
    hero: { alignItems: 'center', paddingTop: spacing.sm },
    image: { width: 168, height: 168 },
    name: { ...typography.title, color: colors.text, marginTop: spacing.sm },
    id: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    body: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
    typesRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg, gap: spacing.sm },
    infoCell: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
    },
    infoValue: { fontSize: 16, fontWeight: '700', color: colors.text },
    infoLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    sectionTitle: { ...typography.subtitle, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
    abilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        marginBottom: spacing.sm,
    },
    abilityName: { ...typography.body, color: colors.text },
    hiddenBadge: { backgroundColor: colors.skeleton, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
    hiddenText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
    });