import { rest } from 'msw'
import { setupServer } from 'msw/node'
import * as data from './data'

export const server = setupServer(
  rest.get(`https://api.github.com/search/users`, (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    if (q === 'unavailable') {
      // actually the status is 503, but I don't know why "react-query" or "fetch" doesn't throw an error 503 status code
      return res(ctx.status(400), ctx.json({
        message: "Service unavailable",
        errors: [
            {
                resource: "Search",
                code: "unavailable"
            }
        ],
        documentation_url: "https://docs.github.com/v3/search"
      }))
    }
    if (!q) {
      return res(ctx.status(422), ctx.json({
        message: "Validation Failed",
        errors: [
            {
                resource: "Search",
                field: "q",
                code: "missing"
            }
        ],
        documentation_url: "https://docs.github.com/v3/search"
      }))
    }
    if (q === '231243499') {
      return res(ctx.status(200), ctx.json({
        total_count: 0,
        incomplete_results: false,
        items: []
      }))
    }
    if (q === 'ikhsanalatsary') {
      return res(ctx.status(200), ctx.json(data.users))
    }
  }),
  rest.get(`https://api.github.com/users/ikhsanalatsary/repos`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(data.repos))
  }),
)
