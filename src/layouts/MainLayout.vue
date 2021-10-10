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

    <q-footer class="bg-white small-screen" bordered >
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
          <q-btn flat dense class="q-mr-sm" label="Yes" />
          <q-btn flat dense class="q-mr-sm" label="Later" />
          <q-btn flat dense class="q-mr-sm" label="Never" />
        </template>
      </q-banner>
      <q-tabs class="text-blue-grey-10" active-color="primary" indicator-color="transparent">
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
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