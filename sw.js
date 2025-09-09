const CACHE_NAME = 'everton-motoboy-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/mobile.css',
    '/assets/js/script.js',
    '/assets/images/Logo.webp',
    '/assets/images/icon/favicon.ico',
    '/assets/images/icon/favicon-16x16.png',
    '/assets/images/icon/favicon-32x32.png',
    '/assets/images/icon/apple-touch-icon.png',
    '/assets/images/icon/android-chrome-192x192.png',
    '/assets/images/icon/android-chrome-512x512.png',
    '/manifest.json'
];

// Instalação do Service Worker: Cacheia os recursos essenciais
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Falha ao abrir cache', error);
            })
    );
    // Força o Service Worker a ativar imediatamente
    self.skipWaiting();
});

// Ativação do Service Worker: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Service Worker: Removendo cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            // Força o Service Worker a assumir o controle imediato das páginas
            return self.clients.claim();
        })
    );
});

// Intercepta requisições: Usa cache, recorre à rede se necessário
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se encontrado
                if (response) {
                    return response;
                }
                // Caso contrário, faz a requisição à rede
                return fetch(event.request)
                    .then(networkResponse => {
                        // Verifica se a resposta é válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        // Clona a resposta para armazenar no cache
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Service Worker: Falha na requisição', error);
                        // Opcional: Retornar uma página offline personalizada
                        return caches.match('/index.html');
                    });
            })
    );
});