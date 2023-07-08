import {
  Accordion,
  Button,
  createStyles,
  Container,
  MantineProvider,
  rem,
  Stack,
  Text,
  TextInput,
  Paper,
  Loader,
  Center,
  Group,
  Title,
} from "@mantine/core"
import { IconChevronDown, IconStarFilled } from "@tabler/icons-react"
import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { SearchMutateFunction, queryClient, useFindRepositories, useSearchUsername } from "./services/query-client"
import { SearchResponse } from "./services/gh-client"

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.white,
  },
  item: {
    backgroundColor: theme.colors.gray[0],
    border: `${rem(1)} solid transparent`,
    marginBottom: theme.radius.md,
    position: "relative",
    zIndex: 0,
    // transition: "transform 150ms ease",
  },
  chevron: {
    width: "2rem",
  },
  panel: {
    backgroundColor: theme.white,
  },
}))

type SearchProps = {
  onSubmit: SearchMutateFunction;
  reset: () => void;
}
function Search({ onSubmit, reset }: SearchProps) {
  const [q, setQuery] = useState("")
  return (
    <form
      data-testid="search-form"
      onSubmit={(e) => {
        e.preventDefault()
        if (!q) return
        onSubmit({ q })
        setQuery("")
        reset()
      }}
    >
      <Stack>
        <TextInput placeholder="Enter username" value={q} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit" data-testid="search-button">
          Search
        </Button>
      </Stack>
    </form>
  )
}

function SearchContent() {
  const { classes } = useStyles()
  const [page, setPage] = useState(1)
  const [data, setData] = useState<SearchResponse | null>(null)
  const { mutate, isLoading, isError } = useSearchUsername({
    onSuccess(data) {
      if (data.data) {
        setData((prevData) => {
          if (prevData?.data) {
            return {
              ...data,
              data: {
                incomplete_results: data.data.incomplete_results,
                items: prevData.data?.items.concat(data.data.items),
                total_count: data.data.total_count,
              },
            }
          }
          return data
        })
      }
    },
  })
  const loadMore = (q: string) => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1
      mutate({ q, page: nextPage })
      return nextPage
    })
  }
  const reset = () => {
    setPage(1)
    setData(null)
  }
  return (
    <Container size="sm" mt="1rem">
      <Stack>
        <Search onSubmit={mutate} reset={reset} />
        {isLoading && page === 1 ? (
          <Center>
            <Loader data-testid="user-loading" />
          </Center>
        ) : isError ? (
          <Paper shadow="xs" p="lg">
            <Text>Oopss sorry, We cannot serve your request!</Text>
          </Paper>
        ) : data?.data ? (
          data.data.items.length ? (
            <>
              <Text data-testid="search-result-text">Showing users for "{data.data.items[0].login}"</Text>
              <Accordion
                data-testid="result-accordion"
                classNames={classes}
                className={classes.root}
                chevron={<IconChevronDown stroke={2} size="2rem" />}
              >
                {data.data.items.map((item, index) => {
                  return (
                    <Accordion.Item data-testid={"result-accordion-item-" + index} value={item.login} key={item.node_id}>
                      <Accordion.Control data-testid={"result-accordion-control-" + index} fz="lg" fw={500} tt="capitalize">
                        {item.login}
                      </Accordion.Control>
                      <Panel username={item.login} />
                    </Accordion.Item>
                  )
                })}
              </Accordion>
              {data.data.total_count > data.data.items.length && (
                <Button data-testid="search-result-more" onClick={() => loadMore(data.data.items[0].login)} loading={isLoading}>
                  Load more
                </Button>
              )}
            </>
          ) : (
            <Paper shadow="xs" p="lg">
              <Text>Data not found!</Text>
            </Paper>
          )
        ) : null}
      </Stack>
    </Container>
  )
}

function Panel({ username }: { username: string }) {
  const { data, isLoading, isError } = useFindRepositories(username)
  if (isLoading) {
    return (
      <Accordion.Panel>
        <Center>
          <Loader />
        </Center>
      </Accordion.Panel>
    )
  }
  if (isError) {
    return (
      <Accordion.Panel>
        <Paper shadow="xs" p="lg">
          <Text>Oopss sorry, We cannot serve your request!</Text>
        </Paper>
      </Accordion.Panel>
    )
  }
  return (
    <Accordion.Panel data-testid="result-accordion-panel">
      {data?.data.length ? (
        data.data.map((item, index) => {
          return (
            <Paper data-testid={"result-panel-paper-" + index} shadow="xs" p="md" pb="lg" mt={8} mb={8} key={item.node_id}>
              <Group position="apart">
                <Title data-testid={"result-panel-paper-title-" + index} order={4}>
                  {item.name}
                </Title>
                <Group spacing="xs">
                  <Title order={4}>{item.stargazers_count}</Title>
                  <IconStarFilled />
                </Group>
              </Group>
              <Text mt="1rem">{item.description}</Text>
            </Paper>
          )
        })
      ) : (
        <Paper shadow="xs" p="lg">
          <Text>Data not found!</Text>
        </Paper>
      )}
    </Accordion.Panel>
  )
}

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ defaultRadius: 0 }}>
      <QueryClientProvider client={queryClient}>
        <SearchContent />
      </QueryClientProvider>
    </MantineProvider>
  )
}
