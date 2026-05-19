# AI Notes

## 1. Tools yang Digunakan

- **Google Gemini:** Digunakan sebagai _pair-programmer_ untuk diskusi arsitektur React Native, resolusi _dependency conflict_, dan simulasi _unit testing_ dengan Jest.

## 2. 3 Contoh Penggunaan yang Berhasil

- **Simulasi Race Condition pada Unit Test:** AI membantu merancang skenario _testing_ menggunakan `jest.useFakeTimers()` dan `fireEvent.scroll`. Ini membantu saya membuktikan secara matematis bahwa logika penyimpanan ke `AsyncStorage` tidak memicu _spamming_ saat terjadi manipulasi UI secara _rapid_.
- **Custom Rules untuk Markdown Rendering:** Saat library `react-native-markdown-display` gagal merender gambar karena format _relative path_ (`../images/..`), AI memberikan solusi _interceptor_ di dalam properti `rules`. URL relatif tersebut berhasil dicegat dan disambung dengan _base_ URL secara dinamis.
- **Resolusi Dependency Babel dan Jest di Expo:** AI memandu proses pembersihan _cache_ dan penyelarasan versi antara `jest`, `babel-jest`, dan `jest-expo` di `package.json`, sehingga menghilangkan _error_ konfigurasi `Unknown option: .name` yang menghambat proses testing.

## 3. 1 Contoh AI Memberikan Output Salah/Suboptimal

- **Output AI:** Saat mencoba mengatasi _error_ Babel, AI memberikan saran untuk menulis konfigurasi Jest di dalam `package.json`, dan sekaligus menyarankan pembuatan file `jest.config.js` sebagai _fallback_ tambahan.
- **Menyadari Kesalahan:** Saat menjalankan `npm test`, proses langsung gagal dengan pesan error `Implicit config resolution does not allow multiple configuration files`. Jest kebingungan karena ada dua "buku panduan" sekaligus.
- **Perubahan yang Dilakukan:** Saya menyadari bahwa Jest memerlukan satu sumber kebenaran tunggal (_Single Source of Truth_). Saya menghapus file `jest.config.js` yang disarankan AI dan memusatkan seluruh konfigurasi (`preset`, `transformIgnorePatterns`) secara rapi hanya di dalam `package.json`.

## 4. Konfigurasi AI

- Tidak menggunakan file konfigurasi khusus seperti `.cursorrules` atau `GEMINI.md` di dalam _repository_. Interaksi dilakukan secara _prompt-based_ langsung melalui antarmuka web, dengan memberikan konteks spesifik berupa _snippet_ kode dan pesan _error_ dari terminal.

## NOTE

- Pembuatan file ini juga menggunakan gemini untuk pembuatan markdown dan text nya
- Penggunaan zustand disini untuk menunjukan bahwa _developer_ menggunakan global state dengan opsi termudah karena baru sadar ada requierement global state di saat aplikasi hampir selesai
- penggunaan asyncStorage dipilih karena _developer_ memiliki pngalaman penggunaan library tersebut dibanding library lain
