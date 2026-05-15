import { Images } from '@/assets/images'
import { AppInput } from '@/components/AppInput'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const Login = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const isButtonDisabled = !form.email.trim() || !form.password.trim()

  const handleLogin = async () => {
    const { email, password } = form
    let valid = true
    let newErrors = { email: '', password: '' }

    if (!email.includes('@')) {
      newErrors.email = 'Format email tidak valid'
      valid = false
    }
    if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
      valid = false
    }

    if (!valid) {
      setErrors(newErrors)
      return
    }

    if (email === 'test@example.com' && password === '123456') {
      try {
        const sessionData = JSON.stringify({
          isLoggedIn: true,
          user: email,
          loginTime: new Date().toISOString(),
        })
        await AsyncStorage.setItem('user_session', sessionData)

        router.replace('/article')
      } catch (e) {
        console.error('Gagal simpan sesi', e)
      }
    } else {
      setErrors({
        email: email !== 'test@example.com' ? 'Email tidak terdaftar' : '',
        password: password !== '123456' ? 'Password salah!' : '',
      })
    }
  }

  return (
    <View className='flex-1 bg-white relative overflow-hidden'>
      <View className='absolute -top-5 -right-16 w-48 h-40 bg-[#2C2C2C] rotate-45 z-0' />
      <View className='absolute -top-40 -right-20 w-80 h-80 bg-main-green-100 rounded-full z-10' />

      <View className='flex-1 p-6'>
        <View className='mt-40'>
          <Text className='font-comic text-xl text-black-100'>Masuk</Text>
          <Text className='font-medium font-inter text-sm leading-[17px] text-main-neutral-50'>
            Selamat datang kembali!
          </Text>
        </View>

        <View className='mt-2'>
          <AppInput
            placeholder='E-mail'
            value={form.email}
            onChangeText={(text) => {
              setForm({ ...form, email: text })
              setErrors({ ...errors, email: '' })
            }}
            error={errors.email}
            autoCapitalize='none'
            keyboardType='email-address'
            containerClassName='mt-3'
          />

          <AppInput
            placeholder='Kata Sandi'
            secureTextEntry
            value={form.password}
            onChangeText={(text) => {
              setForm({ ...form, password: text })
              setErrors({ ...errors, password: '' })
            }}
            error={errors.password}
            containerClassName='mt-3'
          />
          <Text className='text-main-green-100 text-sm font-medium font-inter text-right mt-3'>
            Lupa Kata Sandi?
          </Text>
        </View>

        <Pressable
          className={`${
            isButtonDisabled
              ? 'bg-main-green-disabled'
              : 'bg-[#74b360] active:opacity-90'
          } mt-5 py-4 rounded-full active:opacity-90`}
          onPress={handleLogin}
          disabled={isButtonDisabled}
        >
          <Text className='text-white text-center font-inter-sb text-lg'>
            Masuk
          </Text>
        </Pressable>

        <View className='flex-row items-center justify-center mt-3'>
          <Text className='text-sm text-gray-500 font-inter mr-1'>
            Belum punya akun?
          </Text>

          <Pressable>
            <Text className='text-main-green-100 text-sm font-inter font-medium'>
              Buat Akun
            </Text>
          </Pressable>
        </View>

        <View className='flex flex-row items-center justify-center gap-6 mt-3 mb-5'>
          <View className='w-5/12 h-0.5 bg-gray-300 my-6' />
          <Text className='text-center text-sm text-gray-500 font-inter'>
            atau
          </Text>
          <View className='w-5/12 h-0.5 bg-gray-300 my-6' />
        </View>

        <Pressable className='flex flex-row items-center justify-center py-4 rounded-full gap-2 border border-main-neutral-10'>
          <Image
            source={Images.google_icon}
            style={{ width: 24, height: 24 }}
            contentFit='contain'
          />
          <Text
            className='text-main-black-primary text-sm font-inter'
            style={{ fontWeight: '700' }}
          >
            Google
          </Text>
        </Pressable>

        <Pressable
          className='absolute bottom-10 left-10 right-10 items-center'
          onPress={() => router.replace('/article')}
        >
          <Text className='text-main-green-100 text-sm font-bold text-center underline'>
            Lewati, langsung lihat daftar komik
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Login
