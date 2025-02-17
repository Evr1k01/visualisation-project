import phonesCount from '../tools/phonesCountData.json'
import populationProportion from '../tools/populationAndPhonesProportionData.json'
import domesticProducts from '../tools/GDP.json'
import incomeSize from '../tools/IncomeSize.json'
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

    const filteredProducts = domesticProducts
        .filter(prod => populationProportion.some(pop => pop.name === prod.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => item.value)

    const filteredProportion = populationProportion
        .filter(pop => domesticProducts.some(prod => prod.name === pop.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => item.value)

    return calculateCorrelation(filteredProducts, filteredProportion)
}

export const incomeSmartphoneCorrelation = (): string => {
    const filteredIncomes = incomeSize.map(item => item.value)
    let filteredSmartphones: number[] = []
    countries.forEach((item) => {
        if (incomeSize.some(income => income.name === item)) {
            filteredSmartphones.push(smartphones[countries.indexOf(item)])
        }
    })

    return calculateCorrelation(filteredIncomes, filteredSmartphones)
}

const calculateCorrelation = (arr1: number[], arr2: number[]) => {
    const meanArr1 = arr1.reduce((sum, val) => sum + val, 0) / arr1.length;
    const meanArr2 = arr2.reduce((sum, val) => sum + val, 0) / arr2.length;

    let numerator = 0;
    let sumArr1Sq = 0;
    let sumArr2Sq = 0;

    for (let i = 0; i < arr1.length; i++) {
        const arr1Diff = arr1[i] - meanArr1;
        const arr2Diff = arr2[i] - meanArr2;

        numerator += arr1Diff * arr2Diff;
        sumArr1Sq += arr1Diff ** 2;
        sumArr2Sq += arr2Diff ** 2;
    }

    const denominator = Math.sqrt(sumArr1Sq) * Math.sqrt(sumArr2Sq);

    return (numerator / denominator).toFixed(1);
}

const getLandGDPPlace = (land: string): number|'-' => {
    const index = domesticProducts.findIndex(item => item.name === land) + 1
    return index < 1 ? '-' : index
}
