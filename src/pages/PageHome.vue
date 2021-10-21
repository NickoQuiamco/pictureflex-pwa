<template>
  <q-page class="constrain q-pa-md">
    <transition
        appear
        enter-active-class="animated slower bounceInDown"
        leave-active-class="animated slower bounceOutUp"
      >
        <div v-if="show_app_notifications_banner && pushNotificationSupport" class="banner-container bg-primary">
          <div class="constrain">
            <q-banner
              class="bg-blue-grey-3 q-mb-md">
              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  text-color="primary"
                  icon="eva-bell-outline"
                  font-size="24px"
                  size="28px"
                  dense
                />
              </template>
              Would you like to enable notifications?

              <template v-slot:action>
                <q-btn
                  @click="enableNotifications()"
                  color="primary"
                  flat
                  dense
                  class="q-mr-sm"
                  label="Yes" />
                <q-btn
                  @click="hideNotificationsBanner()"
                  color="primary"
                  flat
                  dense
                  class="q-mr-sm"
                  label="Later" />
                <q-btn
                  @click="neverShowNotificationsBanner()"
                  color="primary"
                  flat
                  dense
                  class="q-mr-sm"
                  label="Never" />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <post-list v-for="post in posts" :key="post.id" :post-data="post"  />
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <div class="text-center text-grey">
            <h4>No post available</h4>
          </div>
        </template>
        <template v-else>
          <q-card flat bordered >
            <q-item>
              <q-item-section avatar>
                <q-skeleton size="40px" type="QAvatar" animation="fade" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen">
        <q-item class="fixed">
            <!-- {{ props_data }} -->
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">Krono Lyon</q-item-label>
            <q-item-label caption>
              Nicko Quiamco
              <!-- {{props_data.location}} -->
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onActivated } from 'vue';
import axios from "axios";
import { useQuasar } from 'quasar';
import { openDB } from 'idb';
var qs = require('qs');

export default defineComponent({
  name: 'pageHome',
  components:{
    "post-list": require("../components/PostList.vue").default
  },
  setup () {
    // variable declaration ***
    const q = useQuasar();
    var posts = ref([])
    const loadingPosts = ref(false)
    const show_app_notifications_banner = ref(false)
    // created lifecycle hook ***
    let never_show_app_notification_banner = q.localStorage.getItem('never_show_app_notification_banner')
    var permission = Notification.permission;
    if(permission == 'default' && !never_show_app_notification_banner){
      setTimeout(() => {
        show_app_notifications_banner.value = true
      }, 1000);
    }

    // computed ***
    const serviceWorkerSupported = computed(function(){
      if('serviceWorker' in navigator ) return true
      return false
    });
    const pushNotificationSupport = computed(function(){
      if('PushManager' in window) return true
      return false
    })
    // methods ***
    function getPost(){
      // console.log(process.env.API);
      loadingPosts.value = true
      // add a unique timestamp to the request URL for IE so that the request don't cached
      let timestamp= ''
      timestamp += '?timestamp=' + Date.now()
      axios.get(`${ process.env.API }/posts${ timestamp }`).then(response=>{
        posts.value = response.data
        loadingPosts.value = false
        if (!navigator.onLine) {
          getOfflinePosts()
        }
      }).catch(error=>{
        console.log(error);
        q.notify({
          type: 'negative',
          message: 'Connection timeout, Please try again later.',
          position: 'top-right'
        })
        loadingPosts.value = false
      })
    }
    function getOfflinePosts(){
      let db = openDB('workbox-background-sync').then(db=>{
        db.getAll('requests').then(failedRequest=>{
          // console.log(failedRequest)
          failedRequest.forEach(failedRequest=>{
            if (failedRequest.queueName == "createPostQueue") {
              let request = new Request(failedRequest.requestData.url, failedRequest.requestData)
              request.formData().then(form_data=>{
                let offline_post = {}
                  offline_post.id = form_data.get('id')
                  offline_post.caption = form_data.get('caption')
                  offline_post.location = form_data.get('location')
                  offline_post.date = parseInt(form_data.get('date'))
                  offline_post.offline = true

                  let reader = new FileReader()
                  reader.readAsDataURL(form_data.get('file'))
                  reader.onloadend = ()=>{
                    offline_post.image_url = reader.result
                    posts.value.unshift(offline_post) 
                  }

              })
            }
          })
        }).catch(err=>{
          console.log(err);
        })
      })

    }
    function listenForOfflinepostUploaded(){
      if (serviceWorkerSupported) {
        const channel = new BroadcastChannel('sw-messages');
        channel.addEventListener('message', event=>{
          console.log('received', event.data);
          if (event.data.msg == 'offline-post-uploaded') {
            let offline_post_count = posts.value.filter( post => {
              return post.offline == true 
            } )
            posts.value[offline_post_count.length -1 ].offline = false
          }
        })
      }
    }
    function enableNotifications(){
      if ( pushNotificationSupport ) {
        Notification.requestPermission(result=>{
          console.log(result);
          neverShowNotificationsBanner()
          if (result == 'granted') {
            // displayNotification()
            checkForExistingPushSubscription()
          }
        })
      }
    }
    function checkForExistingPushSubscription(){
      if (serviceWorkerSupported && pushNotificationSupport) {
        let reg
        navigator.serviceWorker.ready.then(swreg=>{
          reg = swreg
          return swreg.pushManager.getSubscription()
        }).then(sub=>{
          if(!sub){
            // console.log('create a new push notification')
            createPushSubScription(reg)
          }
        })
      }
    }
    function createPushSubScription(reg){
      let vapid_public_key = "BLftgvikd86kLw7Y2l_E91eWgvZRboeBSugrFLGInK3nTb8HWTrfKYkwDumHBCOibMEzGUCs7SgxGeGYzidYvIY";
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapid_public_key
      }).then(newSub=>{
        // console.log(newSub);
        let new_sub_data = newSub.toJSON(),
        new_sub_data_qs = qs.stringify(new_sub_data)
        return axios.post(`${ process.env.API }/createSubscription?${ new_sub_data_qs }`)
      }).then(response=>{
        displayNotification()
      }).catch(err=>{
        console.log("error", err);
      })
    }
    function displayNotification(type='granted'){
      if (serviceWorkerSupported && pushNotificationSupport) {
        navigator.serviceWorker.ready.then(swreg=>{
          swreg.showNotification("You\'re subscribed to notification.", {
            body: "Thanks for subscribing!",
            icon: 'icons/icon-128x128.png',
            // image: 'icons/icon-128x128.png',
            badge: 'icons/icon-128x128.png',
            dir: 'ltr',
            lang: 'en-US',
            vibrate: [150, 100, 250],
            tag: 'confirm-notification',
            renotify: true,
            actions:[
              {
                action: 'hello',
                title: 'Hello',
                icon: 'icons/icon-128x128.png'
              },
              {
                action: 'goodbye',
                title: 'Goodbye',
                icon: 'icons/icon-128x128.png'
              }
            ]
          })
        })
      }
    }
    function hideNotificationsBanner(){
      show_app_notifications_banner.value = false
    }
    function neverShowNotificationsBanner(){
      show_app_notifications_banner.value = false
      q.localStorage.set("never_show_app_notification_banner", true)
    }

    // lifecycle hooks ***
    onActivated(function(){
      getPost()
    })
    listenForOfflinepostUploaded()
    // expose variables***
    return { posts, loadingPosts, enableNotifications, hideNotificationsBanner, neverShowNotificationsBanner, show_app_notifications_banner, pushNotificationSupport  }
  },
})
</script>