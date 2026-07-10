// sw.js
// Ini adalah Service Worker sederhana agar Chrome mendeteksi web ini sebagai Aplikasi Asli.

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Terinstal');
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Aktif');
});

self.addEventListener('fetch', (e) => {
    // Membiarkan aplikasi mengambil data dari internet secara normal
});