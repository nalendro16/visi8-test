import { useAuthStore } from '@/store/authStore'
import { MaterialIcons } from '@expo/vector-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { router, SplashScreen, Stack, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { Alert, LogBox, Platform, Pressable } from 'react-native'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../styles/global.css'

LogBox.ignoreLogs([
  'React keys must be passed directly to JSX without using spread',
])

export const unstable_settings = {
  anchor: '(tabs)',
}

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
  const segments = useSegments()

  const [loaded, error] = useFonts({
    Comic: require('../assets/fonts/Comic-Book-Bold.otf'),
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-SB': require('../assets/fonts/Inter-SemiBold.ttf'),
  })

  const { isLoggedIn, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync()
  }, [loaded, error])

  if (!loaded && !error) return null

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const isConfirmed = window.confirm('Yakin mau keluar?')
      if (isConfirmed) {
        await logout()
        router.replace('/')
      }
      return
    }

    Alert.alert('Logout', 'Yakin mau keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout()
          router.replace('/')
        },
      },
    ])
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontFamily: 'Inter-SB',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen
            name='article/index'
            options={{
              headerTitleStyle: { fontFamily: 'Comic' },
              title: 'Home Of Events',
              headerRight: () =>
                isLoggedIn ? (
                  <Pressable
                    onPress={handleLogout}
                    className='mr-2 active:opacity-50'
                  >
                    <MaterialIcons name='logout' size={24} color='#EF4444' />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => router.push('/')}
                    className='mr-2 active:opacity-50'
                  >
                    <MaterialIcons name='login' size={24} color='#3B82F6' />
                  </Pressable>
                ),
            }}
          />
          <Stack.Screen
            name='article/[id]'
            options={{
              headerTitleStyle: { fontFamily: 'Comic', fontSize: 20 },
              title: 'Detail Artikel',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
