import { articleService } from '@/service/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native'
import Animated from 'react-native-reanimated'

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const ListArticle = () => {
  const router = useRouter()
  const LIMIT = 5
  const AnimatedImage = Animated.createAnimatedComponent(Image)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['articles-infinite'],
    queryFn: articleService.getArticles,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length * LIMIT
      return nextPage < lastPage.length ? nextPage : undefined
    },
    select: (data) => ({
      pages: data.pages.map((allArticles, index) =>
        allArticles.slice(index * LIMIT, (index + 1) * LIMIT),
      ),
      pageParams: data.pageParams,
    }),
  })

  const flattenedData = useMemo(() => data?.pages.flat() || [], [data])

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View className='py-6'>
        <ActivityIndicator color='#74b360' />
      </View>
    )
  }

  if (isLoading)
    return <ActivityIndicator size='large' color='#74b360' className='mt-20' />
  if (error)
    return (
      <Text className='text-center mt-20'>
        Mohon maaf terjadi kesalahan dengan server
      </Text>
    )

  return (
    <FlatList
      data={flattenedData}
      keyExtractor={(item) => item.id.toString()}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={11}
      removeClippedSubviews={Platform.OS === 'android'}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/article/${item.id}`)}
          className='p-4 border-b border-gray-100 bg-white active:bg-gray-50'
        >
          <Animated.View>
            <Image
              source={{ uri: articleService.getImageUrl(item.banner_url) }}
              className='rounded-xl bg-gray-200 w-full mb-4'
              style={{ height: 212 }}
              contentFit='cover'
              transition={200}
            />
          </Animated.View>

          <View className='w-full'>
            <Text className='font-bold text-lg text-gray-900 leading-6'>
              {item.title}
            </Text>
            <Text className='text-gray-500 text-sm mt-1'>
              {item.date ? formatDate(item.date) : ''}
            </Text>
          </View>
        </Pressable>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
    />
  )
}

export default ListArticle
