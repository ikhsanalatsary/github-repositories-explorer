import { Octokit,  } from "octokit"
import { type Endpoints } from "@octokit/types"

export const defaultHeaders = {
  "X-GitHub-Api-Version": "2022-11-28",
}

export const octokit = new Octokit({
  auth: import.meta.env.VITE_GH_SECRET,
})

export const queryKeyUsers = "GET /search/users"
export type SearchResponse = Endpoints[typeof queryKeyUsers]["response"]
export async function searchUsername(q: string) {
  return octokit.request(queryKeyUsers, {
    q,
    headers: defaultHeaders,
  })
}

export const queryKeyRepos = "GET /users/{username}/repos"
export type RepositoryResponse = Endpoints[typeof queryKeyRepos]["response"]
export async function findRepositories(username: string) {
  return octokit.request(queryKeyRepos, {
    username,
    headers: defaultHeaders,
  })
}
