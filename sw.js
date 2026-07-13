// sw.js
// Ini adalah Service Worker sederhana agar Chrome mendeteksi web ini sebagai Aplikasi Asli.

//self.addEventListener('install', (e) => {console.log('[Service Worker] Terinstal');self.skipWaiting();});

//self.addEventListener('activate', (e) => {console.log('[Service Worker] Aktif');});

//self.addEventListener('fetch', (e) => {// Membiarkan aplikasi mengambil data dari internet secara normal});


//KODE BARU MODE OFFLINE
// Nama cache untuk Maryn POS
const CACHE_NAME = 'maryn-pos-cache-v1';

// Daftar file yang wajib disimpan di memori perangkat agar bisa dibuka offline
// Sesuaikan nama file HTML, CSS, JS, dan gambar Anda di sini
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './logo.png'
    // Tambahkan file CSS atau JS jika Anda memisahkannya, contoh:
    // './style.css',
    // './script.js'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Menginstal dan Menyimpan Cache...');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Aktif dan Membersihkan Cache Lama...');
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Menghapus cache lama:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Strategi: Coba ambil dari internet, jika offline, ambil dari Cache
self.addEventListener('fetch', (e) => {
    // Hanya proses request dengan metode GET
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Jika online, simpan versi terbarunya ke cache diam-diam
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Jika OFFLINE (fetch gagal), ambil dari cache lokal
                console.log('[Service Worker] Mode Offline: Mengambil dari Cache');
                return caches.match(e.request);
            })
    );
});
