import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  checkAuth: () => Promise<void>
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  checkAuth: async () => {
    const session = await AsyncStorage.getItem('user_session')
    set({ isLoggedIn: !!session })
  },

  login: async () => {
    await AsyncStorage.setItem('user_session', 'dummy_token')
    set({ isLoggedIn: true })
  },

  logout: async () => {
    await AsyncStorage.removeItem('user_session')
    set({ isLoggedIn: false })
  },
}))
