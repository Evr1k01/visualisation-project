import type {IOption} from "@/types/IOption";
import type ChartTypeEnum from "@/enums/ChartTypeEnum";

export interface ISelectValueType {
    option: IOption<ChartTypeEnum.Map | ChartTypeEnum.Bar>,
    cardType: 'countCards' | 'humanProportionCards'
}