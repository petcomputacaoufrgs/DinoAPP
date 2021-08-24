import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import FaqItemDataModel from '../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import StringUtils from '../../utils/StringUtils'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import TreatmentService from '../treatment/TreatmentService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import { hasValue } from '../../utils/Utils'
import DataConstants from '../../constants/app_data/DataConstants'

class FaqItemServiceImpl extends AutoSynchronizableService<
	number,
	FaqItemDataModel,
	FaqItemEntity
> {
	constructor() {
		super(
			Database.faqItem,
			APIHTTPPathsConstants.FAQ_ITEM,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.FAQ_ITEM,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.ADMIN, PermissionEnum.STAFF]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: FaqItemDataModel,
	): Promise<FaqItemEntity | undefined> {
		let treatment: TreatmentEntity | undefined

		if (hasValue(model.treatmentId)) {
			treatment = await TreatmentService.getById(model.treatmentId!)
		}

		const entity: FaqItemEntity = {
			answer: model.answer,
			localTreatmentId: treatment?.localId,
			question: model.question,
			isUniversal:
				treatment?.localId === undefined
					? DataConstants.TRUE
					: DataConstants.FALSE,
		}

		return entity
	}

	async convertEntityToModel(
		entity: FaqItemEntity,
	): Promise<FaqItemDataModel | undefined> {
		let treatment: TreatmentEntity | undefined

		if (hasValue(entity.localTreatmentId)) {
			treatment = await TreatmentService.getByLocalId(entity.localTreatmentId!)
		}

		const model: FaqItemDataModel = {
			answer: entity.answer,
			treatmentId: treatment?.id,
			question: entity.question,
		}

		return model
	}

	getFaqItemByFilter(
		searchTerm: string,
		faqItems?: FaqItemEntity[],
	): FaqItemEntity[] {
		if (faqItems) {
			return faqItems.filter(item =>
				StringUtils.contains(item.question, searchTerm),
			)
		}
		return []
	}

	getByTreatment = async (
		treatment: TreatmentEntity,
	): Promise<FaqItemEntity[]> => {
		if (treatment.localId) {
			return this.toList(
				this.table.where('localTreatmentId').equals(treatment.localId),
			)
		}

		return []
	}

	getUniversals = async (): Promise<FaqItemEntity[]> => {
		return this.toList(
			this.table.where('isUniversal').equals(DataConstants.TRUE),
		)
	}
}

export default new FaqItemServiceImpl()
