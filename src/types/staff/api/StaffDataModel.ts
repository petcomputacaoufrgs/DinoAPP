import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface StaffDataModel
	extends SynchronizableDataLocalIdModel<number> {
	email: string
	userId?: number
	sentInvitationDate: string
}
