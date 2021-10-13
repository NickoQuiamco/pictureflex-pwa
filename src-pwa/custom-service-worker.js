/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/* 
    Dependecies
*/
    import { precacheAndRoute } from 'workbox-precaching'
    import { registerRoute } from 'workbox-routing';
    import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
    import { ExpirationPlugin } from 'workbox-expiration';
    import { CacheableResponsePlugin } from 'workbox-cacheable-response';

/* 
    Config
*/
// Use with precache injection
    precacheAndRoute(self.__WB_MANIFEST)

/* 
    Caching Strategies
*/
    registerRoute(
        ({ url }) =>url.host.startsWith('fonts.g'),
        new CacheFirst({
            cacheName: 'google-fonts',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 30,
                }),
                new CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
            ],
          })
    );

    registerRoute(
        ({url}) => url.pathname.startsWith('/posts'),
        new NetworkFirst({
            cacheName:'posts-requests'
        })
    );

    registerRoute(
        ({url}) => url.href.startsWith('http'),
        new StaleWhileRevalidate()
    );