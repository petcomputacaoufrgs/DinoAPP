import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface CalendarEventEntity
	extends SynchronizableEntity<number> {
	title: string
	description?: string
	typeLocalId?: number
	time: string
	date: string
}
