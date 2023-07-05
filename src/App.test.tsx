import App from './App'
import { render, fireEvent, waitForElementToBeRemoved, waitFor, screen } from './utils/test-utils'


describe('App', () => {
  beforeEach(() => {
    render(<App />)
  })
  it('Should render search form', async () => {
    expect(screen.getByTestId('search-form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument()
    expect(screen.getByTestId('search-button')).toBeInTheDocument()
  })

  it('Should show a temporary loading after submitting the form', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'ikhsanalatsary' } })
    fireEvent.click(submit)

    let userLoading = null
    await waitFor(() => {
      userLoading = screen.getByTestId('user-loading')
    })
    expect(userLoading).toBeInTheDocument()
    await waitForElementToBeRemoved(userLoading)
    expect(userLoading).not.toBeInTheDocument()
  })

  it('Should reset the input value after submitting the form', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'ikhsanalatsary' } })
    expect(input.value).toBe('ikhsanalatsary')
    fireEvent.click(submit)
    expect(input.value).toBe('')
  })

  it('Should show a text result if the request is success', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'ikhsanalatsary' } })
    fireEvent.click(submit)

    await waitFor(async () => {
      const userLoading = screen.getByTestId('user-loading')
      expect(userLoading).toBeInTheDocument()
      await waitForElementToBeRemoved(userLoading)
      expect(userLoading).not.toBeInTheDocument()
    }, { timeout: 10000 })

    const text = await screen.findByText('Showing users for "ikhsanalatsary"')
    expect(text).toBeInTheDocument()
  })

  it('Should show accordion element if the request is success', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'ikhsanalatsary' } })
    fireEvent.click(submit)

    await waitFor(async () => {
      const userLoading = screen.getByTestId('user-loading')
      expect(userLoading).toBeInTheDocument()
      await waitForElementToBeRemoved(userLoading)
      expect(userLoading).not.toBeInTheDocument()
    }, { timeout: 10000 })

    const text = await screen.findByText('Showing users for "ikhsanalatsary"')
    expect(text).toBeInTheDocument()
    const accordion = screen.getByTestId('result-accordion')
    expect(accordion).toBeInTheDocument()
    expect(accordion.children).toHaveLength(1)
    const accordionItem = screen.getByTestId('result-accordion-item-0')
    expect(accordionItem).toBeInTheDocument()
  })

  it('Should show list of repositories inside the accordion element if the request is success', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'ikhsanalatsary' } })
    fireEvent.click(submit)

    await waitFor(async () => {
      const userLoading = screen.getByTestId('user-loading')
      expect(userLoading).toBeInTheDocument()
      await waitForElementToBeRemoved(userLoading)
      expect(userLoading).not.toBeInTheDocument()
    }, { timeout: 10000 })

    const text = await screen.findByText('Showing users for "ikhsanalatsary"')
    expect(text).toBeInTheDocument()
    const accordion = screen.getByTestId('result-accordion')
    expect(accordion).toBeInTheDocument()
    expect(accordion.children).toHaveLength(1)
    const accordionItem = screen.getByTestId('result-accordion-item-0')
    expect(accordionItem.getAttribute('data-active')).toBe(null)
    expect(accordionItem).toBeInTheDocument()
    const accordionControl = screen.getByTestId('result-accordion-control-0')
    expect(accordionControl).toBeInTheDocument()
    const panel = screen.getByTestId('result-accordion-panel')
    expect(panel).toBeInTheDocument()
    fireEvent.click(accordionControl)
    expect(accordionItem.getAttribute('data-active')).toBe("true")
    await waitFor(async () => {
      const paper = screen.getByTestId('result-panel-paper-0')
      expect(paper).toBeInTheDocument()
      const title = screen.getByTestId('result-panel-paper-title-0')
      expect(title).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 50000)

  it('Should show not found element if the request is success but no items', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: '231243499' } })
    fireEvent.click(submit)
    
    await waitFor(async () => {
      const userLoading = screen.getByTestId('user-loading')
      expect(userLoading).toBeInTheDocument()
      await waitForElementToBeRemoved(userLoading)
      expect(userLoading).not.toBeInTheDocument()
    }, { timeout: 10000 })

    const notFound = await screen.findByText('Data not found!')
    expect(notFound).toBeInTheDocument()
  })

  it('Should show error element if the request is fail', async () => {
    const input = screen.getByPlaceholderText(/enter username/i)
    const submit = screen.getByTestId('search-button')

    fireEvent.change(input, { target: { value: 'unavailable' } })
    fireEvent.click(submit)
    
    await waitFor(async () => {
      const userLoading = screen.getByTestId('user-loading')
      expect(userLoading).toBeInTheDocument()
      await waitForElementToBeRemoved(userLoading)
      expect(userLoading).not.toBeInTheDocument()
    }, { timeout: 10000 })

    const errorEl = await screen.findByText('Oopss sorry, We cannot serve your request!')
    expect(errorEl).toBeInTheDocument()
  })
})
