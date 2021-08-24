import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface ReportDataModel
	extends SynchronizableDataLocalIdModel<number> {
	what: string
	how?: string
	where?: string
	userId?: number
}
