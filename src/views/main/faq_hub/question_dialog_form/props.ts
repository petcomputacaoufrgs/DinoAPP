import TreatmentQuestionEntity from "../../../../types/faq/database/TreatmentQuestionEntity"
import TreatmentEntity from "../../../../types/treatment/database/TreatmentEntity"

export default interface QuestionDialogFormProps {
	item?: TreatmentQuestionEntity
	treatment: TreatmentEntity
	dialogOpen: boolean
	onClose: () => void
}
