import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface ReportEntity extends SynchronizableEntity<number> {
	what: string
	how?: string
	where?: string
	userLocalId?: number
}
