import type ChartTypeEnum from "@/enums/ChartTypeEnum";

export interface IOption {
    type: ChartTypeEnum.Map | ChartTypeEnum.Bar,
    value: any
}