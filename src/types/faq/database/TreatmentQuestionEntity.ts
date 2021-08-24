import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface TreatmentQuestionEntity
	extends SynchronizableEntity<number> {
	question: string
	localTreatmentId?: number
}
