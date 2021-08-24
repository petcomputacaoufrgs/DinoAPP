import SynchronizableDataModel from './SynchronizableDataModel'

export default interface SynchronizableDataLocalIdModel<ID>
	extends SynchronizableDataModel<ID> {
	localId?: number
}