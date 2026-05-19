const BASE_RAW_URL = process.env.EXPO_PUBLIC_BASE_RAW_URL || ''
const BASE_IMAGE_URL = process.env.EXPO_PUBLIC_BASE_IMAGE_URL || ''

export const articleService = {
  getArticles: async () => {
    const response = await fetch(`${BASE_RAW_URL}/articles.json`)
    if (!response.ok) throw new Error('Gagal mengambil daftar artikel')
    return response.json()
  },

  getArticleDetail: async (slug: string) => {
    const response = await fetch(`${BASE_RAW_URL}/articles/${slug}.json`)
    if (!response.ok) throw new Error('Detail artikel tidak ditemukan')
    return response.json()
  },

  getImageUrl: (fileName: string) =>
    `${BASE_IMAGE_URL}/refs/heads/main/${fileName}`,
}
