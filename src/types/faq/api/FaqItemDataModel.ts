import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface FaqItemDataModel
	extends SynchronizableDataLocalIdModel<number> {
	question: string
	answer: string
	treatmentId?: number
}
