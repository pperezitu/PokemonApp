export interface ApiRequestOptions {
    readonly signal?: AbortSignal;
}

export interface IApiClient {
    get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse>;
}