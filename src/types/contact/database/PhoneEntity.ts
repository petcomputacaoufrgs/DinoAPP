import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface PhoneEntity extends SynchronizableEntity<number> {
	number: string
	type: number
	localContactId?: number
	localEssentialPhoneId?: number
}
