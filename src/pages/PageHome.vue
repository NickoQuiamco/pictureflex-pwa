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
    var posts = ref([
      {
        id: 1,
        caption: 'Nag simula yung storya ng love story natin sa dating app kung saan parehas nating d inaasahang na mag wowork pala tayo we just go with the flow~',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/1.png"
      },
      {
        id: 2,
        caption: '~go with the flow kung saan yung chat natin or pag uusap is naging parang part na ng routine pag ka gising good morning bago matulog goodnight yung part na parang d kumpleto araw natin pag d nag uusap ganun.',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/2.png"
      },
      {
        id: 3,
        caption: 'Sobrang Happy ko na dumating ka sa buhay ko at yung picture naman na to ahahaha d ko ineexpect na mag bibigay ka ng picture ng nakataas yung kamay nung sinabi kong patingin ng kili kili I love youuuu <3',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/3.jpg"
      },
      {
        id: 4,
        caption: 'I really like this video na nag sasayaw ka ganda ng smile and halatang nag eenjoy sa ginagawa mo <3 d naman mahalaga kung magaling kang sumayaw ang mahalaga nag eenjoy ka <3  ',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/4.jpg"
      },
      {
        id: 5,
        caption: 'Isa sa favorite picture ko sobrang ganda very detailed yung makikita sa mukha pag tinitignan ko to na iimagine ko na eto yung mukha ng taong hahalikan ko sa altar balang araw <3',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/5.jpg"
      },
      {
        id: 6,
        caption: 'maiikling pananamit hmmp! pasaway ka minsan mahilig magsuot ng maiikling damit pero ok lang naman sakin yun bsta minsan lang tska gaya ng sinasabi ko bsta safe ka okay lang pero sabi mo minsan langggg!',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/6.jpg"
      },
      {
        id: 7,
        caption: 'Ang ganda ganda mo lagi pag naka smile kaya smile ka lagi mahal ko lagi mong tatandaan nandito lang ako lagi nakaalalay sayo wala man sakin yung solusyon sa problema mo lagi mong iisipin kasama mo ako sa bawat pag subok mo tska hugs!',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/7.jpg"
      },
      {
        id: 8,
        caption: 'I love you so much and sana wag ka mag sawa sa mga chika natin dahil sa pandemic puro chats lang muna pero babawi tayo after pandemic sana makapag pasyal pasyal tayo. mag iingat ka palagi at mag vitamins po.',
        date: 1591776655504,
        location: "Caloocan City",
        image_url: "statics/8.jpg"
      }
    ])
    const loadingPosts = ref(false)
    // function getPost(){
    //   loadingPosts.value = true
    //     // console.log(process.env.API);
    //   axios.get(`${ process.env.API }/posts`).then(response=>{
    //     posts.value = response.data
    //     loadingPosts.value = false
    //   }).catch(error=>{
    //     console.log(error);
    //     q.notify({
    //       type: 'negative',
    //       message: 'Connection timeout, Please try again later.',
    //       position: 'top-right'
    //     })
    //     loadingPosts.value = false
    //   })
    // }

    // getPost()
    // expose variables***
    return { posts, loadingPosts}
  }
})
</script>