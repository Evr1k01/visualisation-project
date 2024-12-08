import type ChartTypeEnum from "@/enums/ChartTypeEnum";
import {getMapCountOption, getBarOption, getMapProportionOption} from "@/helpers/DataHelper";

type ChartTypeToOption = {
    [ChartTypeEnum.Map]: ReturnType<typeof getMapCountOption> | ReturnType<typeof getMapProportionOption>,
    [ChartTypeEnum.Bar]: ReturnType<typeof getBarOption>
}

export interface IOption<T extends keyof ChartTypeToOption> {
    type: T,
    value: ChartTypeToOption[T]
}