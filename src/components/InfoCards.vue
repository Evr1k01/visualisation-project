<template>
  <v-row>
    <v-col cols="12" v-for="card in cards" :key="card.country">
      <v-card>
        <template v-slot:title>
          {{card.country}} - {{card.quantity}}
        </template>

        <template v-slot:subtitle>
          {{card.text}}
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted} from "vue";
import type {ICard} from "@/types/ICard";
import {calculatePopulationPart} from "@/helpers/DataHelper";

export default defineComponent({

  setup() {

    const cards = ref<ICard[]>()

    const countCardsInfo = ref<ICard[]>([
      {text:'niedrigste Anzahl in St.', country: 'Tuvalu', quantity:' 7.600'},
      {text:'größte Anzahl in St.', country: 'China', quantity: '1.649.301.700'}
    ])

    const humanProportionCardsInfo = ref<ICard[]>([
      {text:'niedrigste Anzahl in St.', country: 'Eritrea', quantity:' 7'},
      {text:'größte Anzahl in St.', country: 'Macau', quantity: '360'},
      {text:'Länder mit Anzahl mehr als 100', country: 'Anteil', quantity: calculatePopulationPart()}
    ])

    const smartphonesProportionCardsInfo = ref<ICard[]>([
      {text:'der niedrigste Anteil in %', country: 'Ethiopia', quantity: '11.2%'},
      {text:'der größte Anteil in %', country: 'Ver. Königreich', quantity: '82.2%'},
    ])

    const cardOptions = {
      countCards: countCardsInfo,
      humanProportionCards: humanProportionCardsInfo,
      smartphonesProportionCards: smartphonesProportionCardsInfo
    }

    const setCurrentCards = (key: keyof typeof cardOptions) => cards.value = [...cardOptions[key].value]

    onMounted(() => {
      setCurrentCards('countCards')
    })

    return {
      cards,
      setCurrentCards
    }

  }

})

</script>


<style scoped>

</style>