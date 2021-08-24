import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface EssentialPhoneEntity extends SynchronizableEntity<number> {
	number: string
	type: number
	localEssentialContactId?: number
}
