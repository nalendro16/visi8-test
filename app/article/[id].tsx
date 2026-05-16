import { articleService } from '@/service/api'
import Entypo from '@expo/vector-icons/Entypo'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import Markdown from 'react-native-markdown-display'

const DetailArticle = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [readingProgress, setReadingProgress] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articleService.getArticleDetail(id as string),
    enabled: !!id,
  })

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent

    const distanceToBottom = contentSize.height - layoutMeasurement.height
    const progress = (contentOffset.y / distanceToBottom) * 100
    setReadingProgress(Math.min(Math.max(progress, 0), 100))
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

  console.log(readingProgress)
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
        className='flex-1'
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
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
              heading1: { marginBottom: 10, fontWeight: 'bold' },
              strong: { fontWeight: 'bold' },
              link: { color: '#74b360', textDecorationLine: 'underline' },
              paragraph: { marginBottom: 15 },
              list_item: { marginBottom: 5 },
            }}
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
