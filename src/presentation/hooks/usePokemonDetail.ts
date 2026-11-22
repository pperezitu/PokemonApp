import { useCallback } from 'react';
import { useDependencies } from '../../app/DependencyProvider';
import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { useAsync, UseAsyncResult } from './useAsync';

export const usePokemonDetail = (id: number): UseAsyncResult<PokemonDetail> => {
    const { getPokemonDetail } = useDependencies();

    const fetchDetail = useCallback(
        () => getPokemonDetail.execute(id),
        [getPokemonDetail, id],
    );

    return useAsync<PokemonDetail>(fetchDetail);
};