import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketPathsConstants'
import { KidsSpaceSettingsModel } from '../../types/kids_space/api/KidsSpaceSettingsModel'
import { KidsSpaceSettingsEntity } from '../../types/kids_space/database/KidsSpaceSettingsEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import UserService from '../user/UserService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import PermissionEnum from '../../types/enum/PermissionEnum'

class KidsSpaceSettingsServiceImpl extends AutoSynchronizableService<
	number,
	KidsSpaceSettingsModel,
	KidsSpaceSettingsEntity
> {
	constructor() {
		super(
			Database.kidsSpaceSettings,
			APIHTTPPathsConstants.KIDS_SPACE_SETTINGS,
			WebSocketQueuePathService,
			APIWebSocketDestConstants.KIDS_SPACE_SETTINGS,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	async convertModelToEntity(
		model: KidsSpaceSettingsModel,
	): Promise<KidsSpaceSettingsEntity | undefined> {
		const entity: KidsSpaceSettingsEntity = {
			color: model.color,
			hat: model.hat,
			firstSettingsDone: model.firstSettingsDone,
		}

		return entity
	}

	async convertEntityToModel(
		entity: KidsSpaceSettingsEntity,
	): Promise<KidsSpaceSettingsModel | undefined> {
		const model: KidsSpaceSettingsModel = {
			color: entity.color,
			hat: entity.hat,
			firstSettingsDone: entity.firstSettingsDone,
		}

		return model
	}
}

export default new KidsSpaceSettingsServiceImpl()
