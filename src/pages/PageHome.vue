<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <post-list v-for="post in posts" :key="post.id" :post-data="post"  />
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

export default defineComponent({
  name: 'pageHome',
  components:{
    "post-list": require("../components/PostList.vue").default
  },
  setup () {
    var posts = ref([
      {
        id: 1,
        caption: "Golden Gate Bridge",
        date: 1633163769627,
        location: "Metro Manila, Caloocan City",
        image_url: "https://cdn.quasar.dev/img/parallax2.jpg"
      },
      {
        id: 2,
        caption: "Golden Gate Bridge",
        date: 1633163769627,
        location: "Metro Manila, Caloocan City",
        image_url: "https://cdn.quasar.dev/img/parallax2.jpg"
      },
      {
        id: 3,
        caption: "Golden Gate Bridge",
        date: 1633163769627,
        location: "Metro Manila, Caloocan City",
        image_url: "https://cdn.quasar.dev/img/parallax2.jpg"
      },
      {
        id: 4,
        caption: "Golden Gate Bridge",
        date: 1633163769627,
        location: "Metro Manila, Caloocan City",
        image_url: "https://cdn.quasar.dev/img/parallax2.jpg"
      },
      ])
    return { posts }
  }
})
</script>