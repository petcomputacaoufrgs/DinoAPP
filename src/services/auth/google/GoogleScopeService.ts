import AutoSynchronizableService from '../../sync/AutoSynchronizableService'
import GoogleScopeDataModel from '../../../types/auth/google/api/GoogleScopeDataModel'
import GoogleScopeEntity from '../../../types/auth/google/database/GoogleScopeEntity'
import APIHTTPPathsConstants from '../../../constants/api/APIHTTPPathsConstants'
import SynchronizableWSUpdateModel from '../../../types/sync/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../../types/sync/api/web_socket/SynchronizableWSDeleteModel'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import GoogleAgentService from '../../../agent/GoogleAgentService'
import SynchronizableService from '../../sync/SynchronizableService'
import WebSocketQueuePathService from '../../websocket/path/WebSocketQueuePathService'
import Database from '../../../storage/Database'
import PermissionEnum from '../../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../../constants/api/APIWebSocketPathsConstants'

class GoogleScopeServiceImpl extends AutoSynchronizableService<
	number,
	GoogleScopeDataModel,
	GoogleScopeEntity
> {
	constructor() {
		super(
			Database.googleScope,
			APIHTTPPathsConstants.GOOGLE_SCOPE,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.GOOGLE_SCOPE,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return []
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: GoogleScopeDataModel,
	): Promise<GoogleScopeEntity | undefined> {
		const entity: GoogleScopeEntity = {
			name: model.name,
		}

		return entity
	}

	async convertEntityToModel(
		entity: GoogleScopeEntity,
	): Promise<GoogleScopeDataModel | undefined> {
		const model: GoogleScopeDataModel = {
			name: entity.name,
		}

		return model
	}

	protected async onWebSocketUpdate(
		model: SynchronizableWSUpdateModel<number, GoogleScopeDataModel>,
	) {
		GoogleAgentService.refreshAuth()
	}

	protected async onWebSocketDelete(
		model: SynchronizableWSDeleteModel<number>,
	) {
		GoogleAgentService.refreshAuth()
	}

	hasContactGrant = async (): Promise<boolean> => {
		const scope = await this.table
			.where('name')
			.equals(GoogleScope.CONTACT_SCOPE)
			.first()
		return scope !== undefined
	}

	hasCalendarGrant = async (): Promise<boolean> => {
		const scope = await this.table
			.where('name')
			.equals(GoogleScope.CALENDAR_SCOPE)
			.first()
		return scope !== undefined
	}

	findContactGrant = async (): Promise<GoogleScopeEntity | undefined> => {
		return this.table.where('name').equals(GoogleScope.CONTACT_SCOPE).first()
	}
}

export default new GoogleScopeServiceImpl()
