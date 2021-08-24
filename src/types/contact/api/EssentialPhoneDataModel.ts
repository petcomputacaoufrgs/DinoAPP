import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EssentialPhoneDataModel
	extends SynchronizableDataLocalIdModel<number> {
	number: string
	type: number
	essentialContactId?: number
}
