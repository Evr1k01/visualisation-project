import type {IOption} from "@/types/IOption";

export interface ISelectValueType {
    option: IOption,
    cardType: 'countCards' | 'humanProportionCards'
}