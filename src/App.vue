<template>
  <v-app>
    <v-navigation-drawer>
      <v-select
          v-model="selectedItem"
          :items="optionVariants"
          item-title="title"
          item-value="payload"
          label="Option auswählen"
          @update:modelValue="handleSelectedItem(selectedItem)"
      ></v-select>
      <cards ref="cardComponent"></cards>
    </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12">
              <v-chart :option="option.value"  style="height: 90vh"></v-chart>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
  </v-app>
</template>

<script lang="ts">
import worldJson from './tools/world.json'
import {defineComponent, ref} from 'vue';
import { use, registerMap } from 'echarts/core';
import { MapChart, BarChart } from 'echarts/charts';
import VueECharts from 'vue-echarts';
import {getMapCountOption, getMapProportionOption, getBarOption, getBarSmartphonesOption} from "@/helpers/DataHelper";
import type {IOption} from "@/types/IOption";
import type {ISelectValueType} from "@/types/ISelectValueType";
import ChartTypeEnum from "@/enums/ChartTypeEnum";
import InfoCards from "@/components/InfoCards.vue";
import {
  GridComponent,
  GeoComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

// Подключаем компоненты
use([
  MapChart,
  BarChart,
  VisualMapComponent,
  GridComponent,
  GeoComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  SVGRenderer
]);

registerMap('world', worldJson as any);

export default defineComponent({
  components: {
    VChart: VueECharts,
    Cards: InfoCards
  },

  setup() {

    const cardComponent = ref<{ setCurrentCards: (cardType: string) => void } | null>()
    const selectedItem = ref<ISelectValueType>(
        {option: {type: ChartTypeEnum.Map, value: getMapCountOption()}, cardType: 'countCards'}
    )

    const option = ref<IOption<ChartTypeEnum.Map | ChartTypeEnum.Bar>>({
      value: getMapCountOption(),
      type: ChartTypeEnum.Map
    });

    const setCurrentOption = (item: IOption<ChartTypeEnum.Map | ChartTypeEnum.Bar>) => {
      option.value = { ...item }
    };

    const handleSelectedItem = (item: ISelectValueType) => {
      setCurrentOption(item.option)

      if (cardComponent.value) {
        cardComponent.value.setCurrentCards(item.cardType)
      }
    }

    const optionVariants = ref<{title: string, payload: ISelectValueType}[]>([
      {title: 'Anzahl der Handys - Karte', payload: {option: {type: ChartTypeEnum.Map, value: getMapCountOption()}, cardType: 'countCards'}},
      {title: 'Anzahl der Handys - Bar', payload: {option: {type: ChartTypeEnum.Bar, value: getBarOption()}, cardType: 'countCards'}},
      {title: 'Anteil von Handys und Bevölkerung - Karte', payload: {option: {type: ChartTypeEnum.Map, value: getMapProportionOption()}, cardType: 'humanProportionCards'}},
      {title: 'Anteil von Smartphones', payload: {option: {type: ChartTypeEnum.Bar, value: getBarSmartphonesOption()}, cardType: 'smartphonesProportionCards'}}
    ])

    return {
      option,
      selectedItem,
      optionVariants,
      cardComponent,
      handleSelectedItem
    };
  },
});
</script>