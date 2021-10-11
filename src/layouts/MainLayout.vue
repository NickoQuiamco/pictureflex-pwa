<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-blue-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          icon="eva-camera-outline"
          class="large-screen"
          size="18px"
          to="/camera"
          flat
          round
          dense />
        <q-separator class="large-screen" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Picture Flex
        </q-toolbar-title>
        <q-btn
          icon="eva-home-outline"
          class="large-screen q-mr-sm"
          size="18px"
          to="/"
          flat
          round
          dense />

      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>

    <q-footer class="bg-white" bordered >
      <div v-if="show_app_install_banner" class="banner-container bg-primary">
        <div class="constrain">
          <q-banner
            inline-actions
            dense
            class="bg-primary text-white">
            <template v-slot:avatar>
              <q-avatar
                color="white"
                text-color="black"
                icon="eva-image-2"
                font-size="22px"
                dense
              />
            </template>
            <b> Install Picture Flex? </b>

            <template v-slot:action>
              <q-btn @click="installApp()" flat dense class="q-mr-sm" label="Yes"  />
              <q-btn @click="hideInstallBanner()" flat dense class="q-mr-sm" label="Later" />
              <q-btn @click="neverShowAppInstallBanner()" flat dense class="q-mr-sm" label="Never" />
            </template>
          </q-banner>
        </div>
      </div>
      <q-tabs class="text-blue-grey-10 small-screen" active-color="primary" indicator-color="transparent">
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',
  setup(){
    // variable declaration ***
    const q = useQuasar()
    const show_app_install_banner = ref(false)
    let deferredPrompt;

    let never_show_app_install_banner = q.localStorage.getItem('never_show_app_install_banner')
    if(!never_show_app_install_banner){
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Optionally, send analytics event that PWA install promo was shown.
        show_app_install_banner.value = true
      });
    }
    
    // methods ***

    function installApp(){
      show_app_install_banner.value = false;
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((response)=>{
        hideInstallBanner();
      })
    }
    function hideInstallBanner(){
      show_app_install_banner.value = false
    }
    function neverShowAppInstallBanner(){
      show_app_install_banner.value = false
      q.localStorage.set("never_show_app_install_banner", true)
    }


    return {
      show_app_install_banner,
      installApp,
      neverShowAppInstallBanner,
      hideInstallBanner
    }
  }
})
</script>
<style lang="scss" scoped>
.q-toolbar{
  @media (min-width: $breakpoint-sm-min){
    height: 70px;
  }
}
.q-toolbar__title{
  @media (max-width: $breakpoint-xs-max){
    text-align: center;
  }
  font-size: 30px;
}
</style>