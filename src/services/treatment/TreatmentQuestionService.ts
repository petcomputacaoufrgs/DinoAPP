import TreatmentQuestionDataModel from '../../types/faq/api/TreatmentQuestionDataModel'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import TreatmentQuestionEntity from '../../types/faq/database/TreatmentQuestionEntity'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import TreatmentService from './TreatmentService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'

class TreatmentQuestionServiceImpl extends AutoSynchronizableService<
	number,
	TreatmentQuestionDataModel,
	TreatmentQuestionEntity
> {
	constructor() {
		super(
			Database.treatmentQuestion,
			APIHTTPPathsConstants.TREATMENT_QUESTION,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.TREATMENT_QUESTION,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: TreatmentQuestionDataModel,
	): Promise<TreatmentQuestionEntity | undefined> {
		const treatment = await TreatmentService.getById(model.treatmentId)

		if (treatment) {
			const entity: TreatmentQuestionEntity = {
				localTreatmentId: treatment.localId,
				question: model.question,
			}

			return entity
		}
	}

	async convertEntityToModel(
		entity: TreatmentQuestionEntity,
	): Promise<TreatmentQuestionDataModel | undefined> {
		if (entity.localTreatmentId) {
			const treatment = await TreatmentService.getByLocalId(
				entity.localTreatmentId,
			)

			if (treatment && treatment.id) {
				const model: TreatmentQuestionDataModel = {
					treatmentId: treatment.id,
					question: entity.question,
				}

				return model
			}
		}
	}

	getByTreatment = async (
		treatment: TreatmentEntity,
	): Promise<TreatmentQuestionEntity[]> => {
		if (treatment.localId) {
			return this.toList(
				this.table.where('localTreatmentId').equals(treatment.localId),
			)
		}
		return []
	}
}

export default new TreatmentQuestionServiceImpl()
