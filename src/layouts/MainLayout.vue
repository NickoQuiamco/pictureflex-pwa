<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-blue-grey-10" bordered>
      <q-toolbar>
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasagram
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white" bordered >
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

  setup () {

    return {}
  }
})
</script>
<style lang="scss" scoped>
.q-toolbar__title{
  text-align: center;
  font-size: 30px;
}
</style>