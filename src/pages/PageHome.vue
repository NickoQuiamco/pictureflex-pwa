<template>
  <q-page class="constrain q-pa-md">
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
export default defineComponent({
  name: 'pageHome',
  components:{
    "post-list": require("../components/PostList.vue").default
  },
  setup () {
    const q = useQuasar();
    var posts = ref([])
    const loadingPosts = ref(false)
    // computed ***
    const serviceWorkerSupported = computed(function(){
      if('serviceWorker' in navigator ) return true
      return false
    });
    function getPost(){
      loadingPosts.value = true
      axios.get(`${ process.env.API }/posts`).then(response=>{
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
    onActivated(function(){
      getPost()
    })
    listenForOfflinepostUploaded()
    // expose variables***
    return { posts, loadingPosts}
  },
})
</script>