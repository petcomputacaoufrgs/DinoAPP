import TreatmentEntity from "../../../../../types/treatment/database/TreatmentEntity"

export default interface TreatmentItemProps {
  item: TreatmentEntity,
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: TreatmentEntity) => void
}