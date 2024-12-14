import type ChartTypeEnum from "@/enums/ChartTypeEnum";
import {getMapCountOption, getBarOption, getMapProportionOption, getBarSmartphonesOption} from "@/helpers/DataHelper";

type ChartTypeToOption = {
    [ChartTypeEnum.Map]: ReturnType<typeof getMapCountOption> | ReturnType<typeof getMapProportionOption>,
    [ChartTypeEnum.Bar]: ReturnType<typeof getBarOption> | ReturnType<typeof getBarSmartphonesOption>
}

export interface IOption<T extends keyof ChartTypeToOption> {
    type: T,
    value: ChartTypeToOption[T]
}