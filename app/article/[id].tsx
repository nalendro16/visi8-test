import { articleService } from '@/service/api'
import Entypo from '@expo/vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  Image as RNImage,
  ScrollView,
  Text,
  View,
} from 'react-native'
import Markdown from 'react-native-markdown-display'

const DetailArticle = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const [readingProgress, setReadingProgress] = useState(0)
  const [isStorageLoaded, setIsStorageLoaded] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)

  const scrollToViewRef = useRef<ScrollView>(null)
  const isCanSaveProgress = useRef(false)
  const scrollViewHeight = useRef(0)
  const lastProgressRef = useRef(0)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articleService.getArticleDetail(id as string),
    enabled: !!id,
  })

  const markdownRules = useMemo(
    () => ({
      image: (node: any) => {
        let imageUrl = node.attributes.src

        if (imageUrl.startsWith('../')) {
          const baseUrl = process.env.EXPO_PUBLIC_BASE_RAW_URL || ''
          imageUrl = imageUrl.replace('../', `${baseUrl}/`)
        }
        if (Platform.OS === 'android') {
          return (
            <RNImage
              key={node.key}
              source={{ uri: imageUrl }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: 8,
                marginVertical: 16,
                backgroundColor: '#E5E7EB',
              }}
              resizeMode='cover'
            />
          )
        }

        return (
          <Image
            key={node.key}
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: 220,
              borderRadius: 8,
              marginVertical: 16,
              backgroundColor: '#E5E7EB',
            }}
            contentFit='cover'
            cachePolicy='memory-disk'
            transition={0}
          />
        )
      },
    }),
    [],
  )

  useEffect(() => {
    const loadSavedProgress = async () => {
      if (!id) return

      setIsStorageLoaded(false)
      isCanSaveProgress.current = false

      try {
        const saved = await AsyncStorage.getItem(`progress_${id}`)
        if (saved && parseFloat(saved) > 0) {
          setReadingProgress(parseFloat(saved))
        } else {
          setReadingProgress(0)
        }
      } catch (e) {
        console.error('Gagal load progress', e)
      } finally {
        setIsStorageLoaded(true)
      }
    }
    loadSavedProgress()
  }, [id])

  useEffect(() => {
    if (isStorageLoaded && contentHeight > 0 && scrollToViewRef.current) {
      const viewHeight =
        scrollViewHeight.current || Dimensions.get('window').height * 0.8
      const distanceToBottom = contentHeight - viewHeight

      if (
        distanceToBottom > 100 &&
        readingProgress > 0 &&
        !isCanSaveProgress.current
      ) {
        const scrollToY = (readingProgress / 100) * distanceToBottom

        setTimeout(() => {
          scrollToViewRef.current?.scrollTo({ y: scrollToY, animated: false })
          setTimeout(() => {
            isCanSaveProgress.current = true
          }, 200)
        }, 150)
      } else if (readingProgress === 0) {
        isCanSaveProgress.current = true
      }
    }
  }, [isStorageLoaded, contentHeight, readingProgress])

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isCanSaveProgress.current) return

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const distanceToBottom = contentSize.height - layoutMeasurement.height

    if (distanceToBottom <= 0) return

    const progress = (contentOffset.y / distanceToBottom) * 100
    const boundedProgress = Math.min(Math.max(progress, 0), 100)
    setReadingProgress(boundedProgress)

    lastProgressRef.current = boundedProgress

    if (Platform.OS === 'web') {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        handleScrollEnd()
      }, 300)
    }
  }

  const handleScrollEnd = async () => {
    if (!id || !isCanSaveProgress.current) return
    try {
      await AsyncStorage.setItem(
        `progress_${id}`,
        lastProgressRef.current.toString(),
      )
    } catch (e) {
      console.log('Write error:', e)
    }
  }

  const handleContentSizeChange = (w: number, h: number) => {
    setContentHeight(h)
  }

  if (isLoading)
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#74b360' />
      </View>
    )

  if (error || !data)
    return (
      <View className='flex-1 justify-center items-center p-6'>
        <Text className='text-center font-inter text-gray-500'>
          Aduh, detail artikelnya nggak ketemu mas.
        </Text>
      </View>
    )

  return (
    <View className='flex-1 bg-white'>
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: 'white',
            shadowColor: 'yellow',
          },
          headerTitle: data.title || 'Detail Artikel',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ marginHorizontal: 16 }}
            >
              <Entypo name='chevron-thin-left' size={24} color='black' />
            </Pressable>
          ),
        }}
      />

      <View className='absolute top-0 left-0 right-0 h-1 bg-neutra-300 z-50'>
        <View
          className='h-full bg-[#74b360]'
          style={{ width: `${readingProgress}%` }}
        />
      </View>

      <ScrollView
        testID='article-scroll-test'
        ref={scrollToViewRef}
        className='flex-1'
        contentInsetAdjustmentBehavior='automatic'
        onScroll={handleScroll}
        scrollEventThrottle={32}
        onContentSizeChange={handleContentSizeChange}
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 40,
        }}
      >
        <Image
          source={{ uri: articleService.getImageUrl(data.image) }}
          style={{ width: '100%', height: 250 }}
          contentFit='contain'
        />

        <View className='p-6'>
          <Text className='font-bold text-2xl text-gray-900 leading-8'>
            {data.title}
          </Text>

          <Text className='text-gray-400 text-sm mt-2 font-inter'>
            {data.date
              ? new Date(data.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : ''}
          </Text>

          <View className='h-[1px] bg-gray-100 my-6' />

          <Markdown
            style={{
              body: {
                fontFamily: 'Inter',
                fontSize: 16,
                lineHeight: 26,
                color: '#374151',
              },
              heading1: {
                marginBottom: 10,
                fontWeight: 'bold',
                fontSize: Platform.OS === 'ios' ? 26 : 28,
              },
              strong: { fontWeight: 'bold' },
              link: { color: '#74b360', textDecorationLine: 'underline' },
              paragraph: { marginBottom: 15 },
              list_item: { marginBottom: 5 },
              blockquote: {
                backgroundColor: '#F3F4F6',
                borderLeftWidth: 4,
                borderLeftColor: '#74b360',
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 16,
                borderRadius: 4,
              },
              fence: {
                backgroundColor: '#1F2937',
                color: '#F9FAFB',
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
                fontFamily: 'monospace',
                fontSize: 14,
              },
              code_inline: {
                backgroundColor: '#F3F4F6',
                color: '#EF4444',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: 14,
              },
            }}
            rules={markdownRules}
          >
            {data.body}
          </Markdown>
          {/* <Text className='text-gray-700 text-base leading-7 font-inter text-justify'>
          {data.body}
        </Text> */}
        </View>
      </ScrollView>

      <View className='h-10' />
    </View>
  )
}

export default DetailArticle
