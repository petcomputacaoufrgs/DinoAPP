import TreatmentEntity from '../../treatment/database/TreatmentEntity'
import TreatmentQuestionEntity from '../database/TreatmentQuestionEntity'

export default interface TreatmentView {
	treatment: TreatmentEntity
	questions?: Array<TreatmentQuestionEntity>
}
