import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface StaffEntity extends SynchronizableEntity<number> {
	email: string
	sentInvitationDate: Date
	userId?: number
}
