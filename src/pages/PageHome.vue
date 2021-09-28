<template>
  <q-page class="constrain q-pa-md">
    <q-card class="card-post" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">Nicko Quiamco</q-item-label>
          <q-item-label caption>
            Caloocan City
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-img
        src="https://cdn.quasar.dev/img/parallax2.jpg"
      />

    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'pageHome'
})
</script>
<style lang="scss" scoped>
.card-post{
  .q-img{
    min-height: 200px;
  }
}
</style>