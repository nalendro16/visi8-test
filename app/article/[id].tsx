import Entypo from '@expo/vector-icons/Entypo'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const DetailArticle = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Detail Artikel',
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
      <Text style={styles.text}>DetailArticle Text</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
})
export default DetailArticle
