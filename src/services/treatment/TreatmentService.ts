import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import TreatmentDataModel from '../../types/treatment/api/TreatmentDataModel'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import FaqView from '../../types/faq/view/FaqView'
import FaqItemService from '../faq/FaqItemService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import UserService from '../user/UserService'
import TreatmentQuestionService from './TreatmentQuestionService'
import EssentialContactService from '../contact/EssentialContactService'
import StringUtils from '../../utils/StringUtils'

class TreatmentServiceImpl extends AutoSynchronizableService<
	number,
	TreatmentDataModel,
	TreatmentEntity
> {
	constructor() {
		super(
			Database.treatment,
			APIHTTPPathsConstants.TREATMENT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.TREATMENT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.ADMIN, PermissionEnum.STAFF]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: TreatmentDataModel,
	): Promise<TreatmentEntity> {
		const entity: TreatmentEntity = {
			name: model.name,
		}

		return entity
	}

	async convertEntityToModel(
		entity: TreatmentEntity,
	): Promise<TreatmentDataModel> {
		const model: TreatmentDataModel = {
			name: entity.name,
		}

		return model
	}

	getAllByIds = (ids: number[]): Promise<TreatmentEntity[]> => {
		return this.toList(this.table.where('id').anyOf(ids))
	}

	getAllByLocalIds = (localIds: number[]): Promise<TreatmentEntity[]> => {
		return this.toList(this.table.where('localId').anyOf(localIds))
	}

	getFaqViewByFilter(view: FaqView, searchTerm: string): FaqView {
		const newView = {
			...view,
			faqItems: view.faqItems?.filter(item =>
				StringUtils.contains(item.question, searchTerm),
			),
		}

		return newView as FaqView
	}

	getByName = (name: string): Promise<TreatmentEntity | undefined> => {
		return this.toFirst(this.table.where('name').equalsIgnoreCase(name))
	}

	beforeDelete = async (treatment: TreatmentEntity) => {
		const faqItems = await FaqItemService.getByTreatment(treatment)

		const treatmentQuestions = await TreatmentQuestionService.getByTreatment(
			treatment,
		)

		await Promise.all([
			EssentialContactService.removeTreatment(treatment),
			FaqItemService.deleteAll(faqItems),
			TreatmentQuestionService.deleteAll(treatmentQuestions),
		])
	}
}

export default new TreatmentServiceImpl()
