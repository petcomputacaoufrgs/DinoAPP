import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface TreatmentQuestionDataModel
	extends SynchronizableDataLocalIdModel<number> {
	treatmentId: number
	question: string
}
