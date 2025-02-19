<template>
  <v-row>
    <v-col cols="12" v-for="card in cards" :key="card.country">
      <v-card>
        <template v-slot:title>
          {{card.country}} - {{card.quantity}}
        </template>

        <template v-slot:subtitle>
          <div class="text-pre-line">{{card.text}}</div>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted} from "vue";
import type {ICard} from "@/types/ICard";
import {calculatePopulationPart, findSmartphonesMinMax, gdpSmartphoneCorrelation, getLandGdp, incomeSmartphoneCorrelation, populationsPhonesCountCorrelation} from "@/helpers/DataHelper";
import type {ICalculation} from "@/types/ICalculation";

export default defineComponent({

  setup() {

    const cards = ref<ICard[]>()
    const smartphonesProportionMinMax = ref<ICalculation[]>(findSmartphonesMinMax('phonesPopulationProportion'))
    const smartphonesCountMinMax = ref<ICalculation[]>(findSmartphonesMinMax('count').map(
        (item: ICalculation) => ({...item, count: item.count.toLocaleString('de-DE')})
    ))

    const countCardsInfo = ref<ICard[]>([
      {text:'niedrigste Anzahl in St.', country: smartphonesCountMinMax.value[1]['name'], quantity:smartphonesCountMinMax.value[1]['count']},
      {text:'größte Anzahl in St.', country: smartphonesCountMinMax.value[0]['name'], quantity: smartphonesCountMinMax.value[0]['count']},
      {text:'Anzahl von Handys und Bevölkerungszahl \n (176 Länder)', country: 'Korrelation', quantity: populationsPhonesCountCorrelation()}
    ])

    const humanProportionCardsInfo = ref<ICard[]>([
      {text:'niedrigste Anzahl in St.', country: smartphonesProportionMinMax.value[1]['name'], quantity: smartphonesProportionMinMax.value[1]['count']},
      {text:'größte Anzahl in St.', country: smartphonesProportionMinMax.value[0]['name'], quantity: smartphonesProportionMinMax.value[0]['count']},
      {text:'Platz anhand BIP pro Kopf', country: smartphonesProportionMinMax.value[1]['name'], quantity: getLandGdp(smartphonesProportionMinMax.value[1]['name'])},
      {text:'Platz anhand BIP pro Kopf', country: smartphonesProportionMinMax.value[0]['name'], quantity: getLandGdp(smartphonesProportionMinMax.value[0]['name'])},
      {text:'Mehr als 100 H. pro 100 M.', country: 'Anteil', quantity: calculatePopulationPart()},
      {text:'Anzahl von Handys pro 100 M. und Bruttoinlandsprodukt in $\n (187 Länder)', country: 'Korrelation', quantity: gdpSmartphoneCorrelation()}
    ])

    const smartphonesProportionCardsInfo = ref<ICard[]>([
      {text:'der niedrigste Anteil in %', country: 'Äthiopien', quantity: '11.2%'},
      {text:'der größte Anteil in %', country: 'Ver. Königreich', quantity: '82.2%'},
      {text:'Anteil von Smartphones und Durchschnittseinkommen in $ \n (40 Länder)', country: 'Korrelation', quantity: incomeSmartphoneCorrelation()},
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