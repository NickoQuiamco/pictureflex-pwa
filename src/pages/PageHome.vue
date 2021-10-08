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
import { defineComponent, ref } from 'vue';
import axios from "axios";
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'pageHome',
  components:{
    "post-list": require("../components/PostList.vue").default
  },
  setup () {
    const q = useQuasar();
    var posts = ref([])
    const loadingPosts = ref(false)
    function getPost(){
      loadingPosts.value = true
      axios.get(`http://localhost:3000/posts`).then(response=>{
        // console.log(response);
        posts.value = response.data
        loadingPosts.value = false
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

    getPost()
    // expose variables***
    return { posts, loadingPosts}
  }
})
</script>