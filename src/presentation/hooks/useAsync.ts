import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<TData> {
    readonly data: TData | null;
    readonly error: unknown;
    readonly isLoading: boolean;
}

export interface UseAsyncResult<TData> extends AsyncState<TData> {
    reload: () => void;
}

const INITIAL_STATE: AsyncState<never> = { data: null, error: null, isLoading: true };

/**
 * @param asyncFn Debe estar memoizada con useCallback por el llamador,
 *                de lo contrario el efecto se re-ejecuta en cada render.
 */
export const useAsync = <TData>(asyncFn: () => Promise<TData>): UseAsyncResult<TData> => {
    const [state, setState] = useState<AsyncState<TData>>(INITIAL_STATE);
    const [reloadToken, setReloadToken] = useState(0);
    const requestIdRef = useRef(0);

    useEffect(() => {
        const requestId = ++requestIdRef.current;
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        asyncFn()
        .then(data => {
            // Solo la petición más reciente puede escribir estado (race-condition guard)
            if (requestId === requestIdRef.current) {
            setState({ data, error: null, isLoading: false });
            }
        })
        .catch((error: unknown) => {
            if (requestId === requestIdRef.current) {
            setState({ data: null, error, isLoading: false });
            }
        });
    }, [asyncFn, reloadToken]);

    const reload = useCallback(() => {
        setReloadToken(token => token + 1);
    }, []);

    return { ...state, reload };
};