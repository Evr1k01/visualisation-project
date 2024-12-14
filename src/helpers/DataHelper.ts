import phonesCount from '../tools/phonesCountData.json'
import populationProportion from '../tools/populationAndPhonesProportionData.json'
import type {IData} from "@/types/IData";
import {countries, smartphones, mobilePhones} from "@/tools/smartphonesProportion";
import LinkEnum from "@/enums/LinkEnum";

const chartTypes = {
    count: phonesCount,
    phonesPopulationProportion: populationProportion
}

const getChartData = (key: keyof typeof chartTypes): IData[] => {
    return chartTypes[key] as IData[]
}

const textCount: string = 'Anzahl von Handys nach Ländern (2017/2018)'
const textProportion: string = 'Anzahl von Handys pro 100 Personen (2017/2018)'
const textSmartphonesProportion: string = 'Anteil von Smartphones (50 Länder)'

const tooltip: {trigger: string, showDelay?: number, transitionDuration?: 0.2} = {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2
}

export const getMapProportionOption = () => {
    return {
        title: {
            text: textProportion,
            subtext: 'Datenquelle - Wikipedia',
            sublink: LinkEnum.PhonesCount,
            top: '2%',
            left: 'center',
        },
        tooltip,
        visualMap: {
            left: 'right',
            min: 10,
            max: 300,
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026'
                ]
            },
            text: ['High', 'Low'],
            calculable: true
        },
        series: [
            {
                name: 'Anzahl in St.',
                type: 'map',
                map: 'world',
                data: getChartData('phonesPopulationProportion'),
            },
        ],
    }
}

export const getMapCountOption = () => {
    return {
        title: {
            text: textCount,
            subtext: 'Datenquelle - Wikipedia',
            sublink: LinkEnum.PhonesCount,
            top: '2%',
            left: 'center',
        },
        tooltip,
        visualMap: {
            left: 'right',
            min: 10000,
            max: 2000000000,
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026'
                ]
            },
            text: ['High', 'Low'],
            calculable: true
        },
        series: [
            {
                name: 'Anzahl in St.',
                type: 'map',
                map: 'world',
                data: getChartData('count'),
            },
        ],
    }
}

export const getBarOption = () => {
    return {
        title: {
            text: textCount
        },
        tooltip,
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                rotate: 30
            },
            data: getChartData('count').map((item) => item.name)
        },
        animationDurationUpdate: 1000,
        series: {
            type: 'bar',
            id: 'count',
            data: getChartData('count').map((item) => item.value),
            universalTransition: true,
            // tooltip: {
            //     formatter: ((item: IData) => {
            //         const customData = `${item.name}: <b>${item.value}</b>`;
            //         return `Anzahl von Handys <br> ${customData}`;
            //     })
            // }
        }
    }
}

export const getBarSmartphonesOption = () => {
    return {
        title: {
            text: textSmartphonesProportion
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: countries
        },
        series: [
            {
                name: 'Smartphones %',
                type: 'bar',
                data: smartphones
            },
            {
                name: 'Mobile phones %',
                type: 'bar',
                data: mobilePhones
            }
        ]
    }
}

export const calculatePopulationPart = (): string => {
    const data = getChartData('phonesPopulationProportion')
    const filteredCount = data.reduce((count, item) => count + (item.value > 100 ? 1 : 0), 0);
    return `${((filteredCount / data.length) * 100).toFixed(1)}%`
}