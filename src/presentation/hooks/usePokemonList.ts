import { useCallback } from 'react';
import { useDependencies } from '../../app/DependencyProvider';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { useAsync, UseAsyncResult } from './useAsync';

export const FIRST_PAGE_SIZE = 20;

export const usePokemonList = (
    limit: number = FIRST_PAGE_SIZE,
    offset: number = 0,
): UseAsyncResult<PokemonSummary[]> => {
    const { getPokemonList } = useDependencies();

    const fetchList = useCallback(
        () => getPokemonList.execute(limit, offset),
        [getPokemonList, limit, offset],
    );

    return useAsync<PokemonSummary[]>(fetchList);
};