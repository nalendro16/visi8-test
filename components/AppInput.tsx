import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import React from 'react'
import { Text, TextInput, TextInputProps, View } from 'react-native'

interface AppInputProps extends TextInputProps {
  error?: string
  containerClassName?: string
}

export const AppInput = ({
  error,
  containerClassName,
  ...props
}: AppInputProps) => {
  return (
    <View className={`w-full ${containerClassName}`}>
      <View
        className={`w-full rounded-3xl bg-white border px-5 py-2.5 ${
          error ? 'border-main-error-100' : 'border-main-neutral-50'
        }`}
      >
        <TextInput
          className='font-inter text-sm text-gray-500 focus:outline-none'
          placeholderTextColor='#9ca3af'
          underlineColorAndroid='transparent'
          {...props}
        />
      </View>

      {error ? (
        <View className='flex-row items-center gap-1 mt-2 pl-1'>
          <MaterialCommunityIcons
            name='information-outline'
            size={14}
            color='#DF1C41'
          />
          <Text className='text-main-error-100 text-xs font-inter'>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
