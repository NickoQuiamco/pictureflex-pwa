<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <div class="camera-frame q-pa-md">
          <video
            v-show="!image_captured"
            ref="video"
            class="full-width"
            autoplay />
            <canvas
              v-show="image_captured"
              ref="canvas"
              class="full-width"
              height="240" />
        </div>
        <div class="text-center q-pa-md">
          <q-btn
            v-if="hasCameraSupport"
            @click="captureImage"
            icon="eva-camera" 
            color="grey-10"
            size="lg"
            round
            />
            <q-file
              v-else
              v-model="img_upload"
              @update:model-value="captureImageFallback"
              label="Choose an image"
              accept="image/*"
              outlined
              >
              <template v-slot:prepend>
                <q-icon name="eva-attach-outline" />
              </template>
            </q-file>
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
            :loading="locationLoading"
            class="col col-sm-6"
            label="Location"
            dense>
            <template v-slot:append>
              <q-btn v-if="!locationLoading && locationSupported" @click.prevent="getLocation" round dense flat icon="eva-pin-outline" />
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
import { defineComponent, ref, onUnmounted, computed } from 'vue';
import { useQuasar, uid } from 'quasar'
import axios from 'axios';
require('md-gum-polyfill');

export default defineComponent({
  name: 'PageCamera',
  setup(){
    const $q = useQuasar()
    //data variable declaration***
    const post = ref({
      id: uid(),
      caption: "",
      location: "",
      photo: null,
      date: Date.now(),
    });
    const img_upload = ref([])
    const video = ref(null)
    const canvas = ref(null)
    const image_captured = ref(false)
    var hasCameraSupport = ref(true)
    const locationLoading = ref(false)
    // computed ***
    const locationSupported = computed(function(){
      if('geolocation' in navigator ) return true
      return false
    })
    // methods ***
    function initCamera(){
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream=>{
        video.value.srcObject = stream
      }).catch(error=>{
        hasCameraSupport.value = false
      })
    }
    function captureImage(){
      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height
      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      image_captured.value = false
      post.value.photo = dataURItoBlob(canvas.toDataURL())
      disableCamera();
    }
    function dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1])
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
      }
      var blob = new Blob([ab], {type: mimeString})
      return blob;
    }
    function captureImageFallback(file){
      post.value.photo = file
      image_captured.value = true
      let context = canvas.value.getContext('2d');
      var reader = new FileReader()
      reader.onload = (event)=>{
        var img = new Image();
        img.onload = ()=>{
            canvas.value.width = img.width
            canvas.value.height = img.height
            context.drawImage(img,0,0)
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
    function disableCamera(){
      video.value.srcObject.getVideoTracks().foreach(track=>{
        track.stop
      });
    }
    function getLocation(){
      locationLoading.value = true
      navigator.geolocation.getCurrentPosition(position=>{
      getCityAndCountry(position);  
      },err=>{
        // console.log(err);
        locationError();
      }, { timeout:7000 })
    }
    function getCityAndCountry(position){
      let api_url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      // let api_url = `https://geocode.xyz/${ position.coords.latitude },${ position.coords.longitude }?json=1`;
      axios.get(api_url).then(res=>{
        locationSuccess(res);
      }).catch(err=>{
        locationError();
        // console.log(err);
      });
    }
    function locationSuccess(res){
      let data = res.data.address;
      post.value.location = data.city;
      if(data.country){
        post.value.location += ", " + data.country;
      }
      locationLoading.value = false
    }
    function locationError(){
      q.notify({
        type: 'negative',
        message: 'Could not find your location.',
        position: 'top-right'
      })
      locationLoading.value = false
    }

    initCamera();
    onUnmounted(() => {
      if(hasCameraSupport.value){
        disableCamera();
      }
    })

    return{ post, initCamera, captureImage, image_captured, hasCameraSupport, img_upload, captureImageFallback, video, canvas, getLocation, locationLoading, locationSupported }
  }
})
</script>
<style lang="scss" scoped>
.camera-frame{
  border: 2px solid $grey-10;
  border-radius: 10px;
}
</style>