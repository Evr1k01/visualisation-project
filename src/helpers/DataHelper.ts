import phonesCount from '../tools/phonesCountData.json'
import populationProportion from '../tools/populationAndPhonesProportionData.json'
import type {IData} from "@/types/IData";
import LinkEnum from "@/enums/LinkEnum";

const chartTypes = {
    count: phonesCount,
    phonesPopulationProportion: populationProportion
}

const getChartData = (key: keyof typeof chartTypes): IData[] => {
    return chartTypes[key] as IData[]
}

const textCount: string = 'Weltversorgung mit Handys (2017/2018)'
const textProportion: string = 'Anzahl von Handys pro 100 Menschen (2017/2018)'

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
            max: 360,
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