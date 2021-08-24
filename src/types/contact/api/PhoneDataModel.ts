import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface PhoneDataModel
	extends SynchronizableDataLocalIdModel<number> {
	number: string
	type: number
	contactId?: number
	essentialPhoneId?: number
}
