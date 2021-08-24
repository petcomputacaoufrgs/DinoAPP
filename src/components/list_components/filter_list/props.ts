import FilterType from "../../../types/filter/Filter"

export default interface DinoFilterListProps {
  filters: FilterType[],
  onChangeChecked: (index: number) => void,
}