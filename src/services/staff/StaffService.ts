import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import UserService from '../user/UserService'
import StaffDataModel from '../../types/staff/api/StaffDataModel'
import StaffEntity from '../../types/staff/database/StaffEntity'
import DateUtils from '../../utils/DateUtils'
import StringUtils from '../../utils/StringUtils'
import LanguageBase from '../../constants/languages/LanguageBase'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'

class StaffServiceImpl extends AutoSynchronizableService<
	number,
	StaffDataModel,
	StaffEntity
> {
	constructor() {
		super(
			Database.staff,
			APIHTTPPathsConstants.STAFF,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.STAFF,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.ADMIN]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return [PermissionEnum.ADMIN, PermissionEnum.STAFF]
	}

	async convertModelToEntity(
		model: StaffDataModel,
	): Promise<StaffEntity | undefined> {
		const entity: StaffEntity = {
			email: model.email,
			sentInvitationDate: DateUtils.convertDinoAPIStringDateToDate(
				model.sentInvitationDate,
			),
			userId: model.userId || undefined,
		}

		return entity
	}

	async convertEntityToModel(
		entity: StaffEntity,
	): Promise<StaffDataModel | undefined> {
		const model: StaffDataModel = {
			email: entity.email,
			sentInvitationDate: DateUtils.convertDateToDinoAPIStringDate(
				entity.sentInvitationDate,
			),
			userId: entity.id,
		}

		return model
	}

	getByEmail = async (email: string): Promise<StaffEntity | undefined> => {
		return this.toFirst(this.table.where('email').equalsIgnoreCase(email))
	}

	isEmailInvalid = async (email: string, languageData: LanguageBase) => {
		const isInvalid = !StringUtils.validateEmail(email)
		if (isInvalid) {
			return languageData.INVALID_VALUE
		}

		const alreadyExists = await this.getByEmail(email)

		if (alreadyExists) {
			return languageData.itemAlreadyExists(languageData.EMAIL)
		}

		return undefined
	}
}

export default new StaffServiceImpl()
