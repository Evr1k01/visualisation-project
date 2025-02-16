import phonesCount from '../tools/phonesCountData.json'
import populationProportion from '../tools/populationAndPhonesProportionData.json'
import domesticProducts from '../tools/GDP.json'
import type {IData} from "@/types/IData";
import {countries, smartphones, mobilePhones} from "@/tools/smartphonesProportion";
import LinkEnum from "@/enums/LinkEnum";
import type {ICalculation} from "@/types/ICalculation";

const chartTypes = {
    count: phonesCount,
    phonesPopulationProportion: populationProportion
}

const getChartData = (key: keyof typeof chartTypes): IData[] => {
    return chartTypes[key] as IData[]
}

const textCount: string = 'Anzahl von Handys nach Ländern (2017/2018)'
const textProportion: string = 'Anzahl von Handys pro 100 Personen (2017/2018) und Platz anhand BIP pro Kopf (nominal)'
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
                name: `'Anzahl in St.'`,
                type: 'map',
                map: 'world',
                data: getChartData('phonesPopulationProportion'),
                tooltip: {
                    formatter: ((item: IData) => {
                        const customData = `${item.name}: <b>${Number.isNaN(item.value) ? '-' : item.value}</b>`;
                        return `Anzahl: ${customData}; BIP Platz: <b>${getLandGDPPlace(item.name)}</b>`;
                    })
                    }
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

export const findSmartphonesMinMax = (key: 'phonesPopulationProportion' | 'count'): ICalculation[] => {
    const data = getChartData(key)
    if (!data.length) return [{name: 'none', count: NaN}]

    let max = data[0]
    let min = data[0]

    data.forEach((item: IData) => {
        if (item.value > max.value) max = item
        if (item.value < min.value) min = item
    });

    return [
        { name: max.name, count: max.value },
        { name: min.name, count: min.value }
    ];
};

export const getLandGdp = (land: string): number => {
    return domesticProducts.indexOf(domesticProducts.find(item => item.name === land) as IData) + 1
}

export const gdpSmartphoneCorrelation = (): string => {

    const gdp = domesticProducts.map(item => item.value)
    const phones = populationProportion.map(item => item.value);

    const meanGdp = gdp.reduce((sum, val) => sum + val, 0) / gdp.length;
    const meanPhones = phones.reduce((sum, val) => sum + val, 0) / gdp.length;

    let numerator = 0;
    let sumGdpSq = 0;
    let sumPhonesSq = 0;

    for (let i = 0; i < gdp.length; i++) {
        const gdpDiff = gdp[i] - meanGdp;
        const phonesDiff = phones[i] - meanPhones;

        numerator += gdpDiff * phonesDiff;
        sumGdpSq += gdpDiff ** 2;
        sumPhonesSq += phonesDiff ** 2;
    }

    const denominator = Math.sqrt(sumGdpSq) * Math.sqrt(sumPhonesSq);

    return (numerator / denominator).toFixed(1);
}

const getLandGDPPlace = (land: string): number|'-' => {
    const index = domesticProducts.findIndex(item => item.name === land) + 1
    return index < 1 ? '-' : index
}
