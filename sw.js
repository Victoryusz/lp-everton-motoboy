const CACHE_NAME = 'everton-motoboy-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

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

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(function(cache) {
            return cache.addAll(urlsToCache);
        }).catch(function(error) {
            console.error('Service Worker: Falha ao abrir cache durante instalação', error);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        }).catch(function(error) {
            console.error('Service Worker: Falha durante ativação', error);
        })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') {
        return;
    }

    if (event.request.url.includes('chrome-extension://') || 
        event.request.url.includes('moz-extension://') || 
        event.request.url.includes('safari-extension://')) {
        return;
    }

    if (event.request.url.includes('/sw.js')) {
        return;
    }

    if (event.request.url.includes('google-analytics.com') || 
        event.request.url.includes('googletagmanager.com') || 
        event.request.url.includes('facebook.com') ||
        event.request.url.includes('wa.me')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(function(response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                if (event.request.url.includes('/assets/') || 
                    event.request.url.includes('.css') || 
                    event.request.url.includes('.js') ||
                    event.request.url.includes('.webp') ||
                    event.request.url.includes('.png') ||
                    event.request.url.includes('.ico') ||
                    event.request.url.includes('.jpg') ||
                    event.request.url.includes('.jpeg')) {
                    
                    const responseToCache = response.clone();
                    caches.open(DYNAMIC_CACHE).then(function(cache) {
                        cache.put(event.request, responseToCache);
                    }).catch(function(error) {
                        console.error('Service Worker: Falha ao adicionar ao cache dinâmico', error);
                    });
                }

                return response;
            }).catch(function(error) {
                console.error('Service Worker: Falha na requisição', error);
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
                return new Response('Conteúdo não disponível offline', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            });
        }).catch(function(error) {
            console.error('Service Worker: Falha no cache match', error);
            return new Response('Erro no Service Worker', {
                status: 500,
                statusText: 'Internal Server Error',
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
        })
    );
});