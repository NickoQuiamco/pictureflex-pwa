<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <div class="camera-frame q-pa-md">
          <video
            ref="video"
            class="full-width"
            autoplay />
        </div>
        <div class="text-center q-pa-md">
          <q-btn
            icon="eva-camera" 
            color="grey-10"
            size="lg"
            round
            />
        </div>
        <div class="row justify-center q-ma-md">
          <q-input
            v-model="post.caption"
            class="col col-sm-6"
            label="Caption"
            dense />
        </div>
        <div class="row justify-center q-ma-md">
          <q-input
            v-model="post.location"
            class="col col-sm-6"
            label="Location"
            dense>
            <template v-slot:append>
              <q-btn round dense flat icon="eva-navigation-2-outline" />
            </template>
          </q-input>
        </div>
        <div class="row justify-center q-mt-lg">
          <q-btn
            unelevated
            rounded
            color="primary"
            label="Post Image" />
        </div>
        <!-- {{ post }} -->
      </div>
      <div class="col-4 large-screen">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">Krono Lyon</q-item-label>
            <q-item-label caption>
              Nicko Quiamco
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { uid } from 'quasar';

export default defineComponent({
  name: 'PageCamera',
  setup(){
    const post = ref({
      id: uid(),
      caption: "",
      location: "",
      photo: "",
      date: Date.now(),
    });
    const video = ref(null); 


    // methods ***
    console.log(video);
    function initCamera(){
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream=>{
        video.srcObject = stream
      })
    }
    initCamera();
    return{ post, initCamera }
  }
})
</script>
<style lang="scss" scoped>
.camera-frame{
  border: 2px solid $grey-10;
  border-radius: 10px;
}
</style>