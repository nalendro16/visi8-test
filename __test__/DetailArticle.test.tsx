import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import DetailArticle from '../app/article/[id]' // Sesuaikan path-nya jika beda

// 1. MOCKING SEMUA LIBRARY PIHAK KETIGA
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'article-123' }),
  useRouter: () => ({ back: jest.fn() }),
  Stack: { Screen: () => null },
}))

jest.mock('expo-image', () => ({
  Image: 'MockedImage',
}))

jest.mock('react-native-markdown-display', () => 'MockedMarkdown')

describe('DetailArticle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mockArticleData = {
    title: 'Belajar React Native',
    date: '2026-05-20',
    body: 'Ini isi artikel...',
    image: 'test.jpg',
  }

  it('render judul artikel ketika data berhasildifetch', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockArticleData,
      isLoading: false,
      error: null,
    })
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

    const { getByText } = render(<DetailArticle />)

    await waitFor(() => {
      expect(getByText('Belajar React Native')).toBeTruthy()
    })
  })

  it('simpan reading progress saat scroll berhenti', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockArticleData,
      isLoading: false,
      error: null,
    })
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

    const { getByTestId } = render(<DetailArticle />)

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled())

    const scrollView = getByTestId('article-scroll-test')

    act(() => {
      fireEvent(scrollView, 'contentSizeChange', 500, 1500)
    })

    act(() => {
      jest.runAllTimers()
    })

    const createScrollEvent = (offsetY: number) => ({
      nativeEvent: {
        layoutMeasurement: { height: 500 },
        contentSize: { height: 1500 },
        contentOffset: { y: offsetY },
      },
    })

    act(() => {
      fireEvent.scroll(scrollView, createScrollEvent(200))
      fireEvent.scroll(scrollView, createScrollEvent(500))
      fireEvent.scroll(scrollView, createScrollEvent(800))
    })

    expect(AsyncStorage.setItem).not.toHaveBeenCalled()

    act(() => {
      fireEvent(scrollView, 'momentumScrollEnd')
    })

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'progress_article-123',
      '80',
    )
  })
})
