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
    import { Queue } from 'workbox-background-sync';
/* 
    Config
*/
    self.__WB_DISABLE_DEV_LOGS = true
    precacheAndRoute(self.__WB_MANIFEST)
    let bakcgroundSyncSupported = 'sync' in self.registration ? true : false;    

/* 
    queue - CreatePost
*/  
    var createPostQueue = null
    if (bakcgroundSyncSupported) {
        createPostQueue = new Queue('createPostQueue', {
            onSync: async ({ queue }) => {
              let entry;
              while (entry = await queue.shiftRequest()) {
                try {
                  await fetch(entry.request);
                  // Do custom *INNER* processing (eg decrease my applicative counter by one)
                //  console.log('Extra feature for request', entry.request.url);
                 const channel = new BroadcastChannel('sw-messages')
                 channel.postMessage({ msg: 'offline-post-uploaded' })
                } catch (error) {       
                  await queue.unshiftRequest(entry);
                  throw error;
                }
              }
              console.log('Replay complete!');
            }
        })
        
    }

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

/* 
    events fetch
*/
    if (bakcgroundSyncSupported) {
        self.addEventListener('fetch', (event) => {
            // Add in your own criteria here to return early if this
            // isn't a request that should use background sync.
            if(!self.navigator.onLine){
                if (event.request.url.endsWith('/createPost')) {
                    const promiseChain = fetch(event.request.clone()).catch((err)=>{
                        return createPostQueue.pushRequest({ request: event.request })
                    })
                    event.waitUntil(promiseChain());
                }
            }
        });
    }

/* 
    events - push notification
*/
    self.addEventListener('push', event=>{
        console.log('push notif', event);
        if (event.data) {
            let data = JSON.parse(event.data.text())
            event.waitUntil(
                self.registration.showNotification(
                    data.title,
                    {
                        body: data.body,
                        icon: 'icons/icon-128x128.png',
                        badge: 'icons/icon-128x128.png',
                        data: {
                            open_url: data.open_url
                        }
                    }
                )
            )
        }
    })
/* 
    events - notification
*/

    // console.log();
    self.addEventListener('notificationclick', event=>{
        const notification = event.notification
        const action = event.action

        if (action == 'hello') {
            console.log('Hello button was click')
        }else if(action == 'goodbye'){
            console.log('goodbye button was click')
        }else{
            event.waitUntil(
                clients.matchAll().then(clis=>{
                    let client_using_app = clis.find(cli=>{
                        return cli.visibilityState === 'visible'
                    })
                    if (client_using_app) {
                        client_using_app.navigate(notification.data.open_url)
                        client_using_app.focus()
                    }else{
                        clients.openWindow(notification.data.open_url)
                    }
                })
            )

        }
        notification.close()
    })
    self.addEventListener('notificationclose', event=>{
        console.log('Notification was closed', event);
    })