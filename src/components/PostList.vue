<template>
    <q-card
      class="card-post q-mb-md"
      :class="{ 'bg-red-1': props_data.offline }"
      flat
      bordered>
      <q-badge v-if="props_data.offline" class="badge-offline absolute-top-right" color="red">
        Stored Offline <q-icon name="warning" color="white" class="q-ml-xs" />
      </q-badge>
      <q-item>
          <!-- {{ props_data }} -->
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">Nicko Quiamco</q-item-label>
          <q-item-label caption>
            {{props_data.location}}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-img
        :src="props_data.image_url"
      />
      <q-card-section>
        <div >{{ props_data.caption }}</div>
        <div class="text-caption text-grey">{{ nice_date }}</div>
      </q-card-section>
    </q-card>
</template>

<script>
import { computed,ref } from 'vue';
import { date } from 'quasar'
export default {
    props:['postData'],
    setup(props){
        // console.log(props.postData);
        var props_data = ref(props.postData)

        //computed properties area***
        var nice_date = computed(function(){
            return date.formatDate(props_data.value.date, 'MMMM D h:mmA');
        });
        return{ props_data,nice_date }
    },
}
</script>
<style lang="scss" scoped>
.card-post{
  .badge-offline{
    border-top-left-radius: 0 !important;
  }
  .q-img{
      min-height: 200px;
  }
}
</style>