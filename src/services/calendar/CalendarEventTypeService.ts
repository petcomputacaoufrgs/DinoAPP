import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import CalendarEventTypeDataModel from '../../types/calendar/api/CalendarEventTypeDataModel'
import CalendarEventTypeEntity from '../../types/calendar/database/CalendarEventTypeEntity'

class CalendarEventServiceImpl extends AutoSynchronizableService<
	number,
	CalendarEventTypeDataModel,
	CalendarEventTypeEntity
> {
	constructor() {
		super(
			Database.calendarEventType,
			APIHTTPPathsConstants.CALENDAR_EVENT_TYPE,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.CALENDAR_EVENT_TYPE,
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
		model: CalendarEventTypeDataModel,
	): Promise<CalendarEventTypeEntity | undefined> {
		const entity: CalendarEventTypeEntity = {
			title: model.title,
			color: model.color,
			icon: model.icon,
			userId: model.userId,
		}

		return entity
	}

	async convertEntityToModel(
		entity: CalendarEventTypeEntity,
	): Promise<CalendarEventTypeDataModel | undefined> {
		const model: CalendarEventTypeDataModel = {
			title: entity.title,
			color: entity.color,
			icon: entity.icon,
			userId: entity.userId,
		}

		return model
	}
}

export default new CalendarEventServiceImpl()
