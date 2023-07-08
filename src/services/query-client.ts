/* eslint-disable @typescript-eslint/no-empty-function */
import {
  QueryClient,
  QueryFunction,
  QueryKey,
  UseMutateFunction,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { findRepositories, searchUsername, queryKeyRepos, SearchResponse, RepositoryResponse, SearchUsernameType } from "./gh-client"
import { type RequestError } from "octokit"

export const noop = () => {}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 1,
      staleTime: process.env.NODE_ENV !== "production" ? undefined : 1000 * 60 * 2,
      retry: false,
    },
  },
  logger: {
    log: console.info,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === "test" ? noop : console.error,
  },
})

export type UseRQOptions<TData, TKey extends QueryKey = QueryKey, TError extends RequestError = RequestError> = UseQueryOptions<
  TData,
  TError,
  TData,
  TKey
>

export const useRQ = <TData = unknown, TKey extends QueryKey = QueryKey, TError extends RequestError = RequestError>(
  queryKey: TKey,
  queryFn: QueryFunction<TData, TKey>,
  options?: UseRQOptions<TData, TKey, TError>
) => useQuery<TData, TError, TData, TKey>(queryKey, queryFn, options)

export type SearchMutateFunction = UseMutateFunction<SearchResponse, RequestError, SearchUsernameType>
export type UseRQMutationOptions<
  TData = unknown,
  TVariables = unknown,
  TContext = unknown,
  TError extends RequestError = RequestError
> = UseMutationOptions<TData, TError, TVariables, TContext>
export type UseSearchUsernameOptions = UseRQMutationOptions<SearchResponse, SearchUsernameType>

export function useSearchUsername(options?: UseSearchUsernameOptions) {
  return useMutation(searchUsername, options)
}

export type UseFindRepositoriesOptions = UseRQOptions<RepositoryResponse, string[]>
export function useFindRepositories(username: string, options?: UseFindRepositoriesOptions) {
  return useRQ(
    [queryKeyRepos, username],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ queryKey: [_, username] }) => findRepositories(username),
    options
  )
}
