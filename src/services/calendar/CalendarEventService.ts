import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import CalendarEventDataModel from '../../types/calendar/api/CalendarEventDataModel'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import { hasValue } from '../../utils/Utils'
import CalendarEventTypeService from './CalendarEventTypeService'

class CalendarEventServiceImpl extends AutoSynchronizableService<
	number,
	CalendarEventDataModel,
	CalendarEventEntity
> {
	constructor() {
		super(
			Database.calendarEvent,
			APIHTTPPathsConstants.CALENDAR_EVENT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.CALENDAR_EVENT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: CalendarEventDataModel,
	): Promise<CalendarEventEntity | undefined> {
		const entity: CalendarEventEntity = {
			title: model.title,
			description: model.description,
			time: model.time,
			date: model.date,
		}

		if (hasValue(model.typeId)) {
			const typeEvent = await CalendarEventTypeService.getById(model.typeId!)
			if (typeEvent) entity.typeLocalId = typeEvent.localId
		}

		return entity
	}

	async convertEntityToModel(
		entity: CalendarEventEntity,
	): Promise<CalendarEventDataModel | undefined> {
		const model: CalendarEventDataModel = {
			title: entity.title,
			description: entity.description,
			time: entity.time,
			date: entity.date,
		}

		if (hasValue(entity.typeLocalId)) {
			const typeEvent = await CalendarEventTypeService.getByLocalId(
				entity.typeLocalId!,
			)
			if (typeEvent) model.typeId = typeEvent.id
		}

		return model
	}
}

export default new CalendarEventServiceImpl()
