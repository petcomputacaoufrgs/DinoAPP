import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import PhoneService from './PhoneService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import EssentialContactService from './EssentialContactService'
import { hasValue } from '../../utils/Utils'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'

class ContactServiceImpl extends AutoSynchronizableService<
	number,
	ContactDataModel,
	ContactEntity
> {
	constructor() {
		super(
			Database.contact,
			APIHTTPPathsConstants.CONTACT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.CONTACT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	protected async beforeDelete(entity: ContactEntity) {
		if (entity.localId) {
			const phones = await PhoneService.getAllByContactLocalId(entity.localId)
			await PhoneService.deleteAll(phones)
		}
	}

	async convertModelToEntity(model: ContactDataModel): Promise<ContactEntity> {
		const entity: ContactEntity = {
			name: model.name,
			description: model.description,
			color: model.color,
		}

		if (hasValue(model.essentialContactId)) {
			const essentialContact = await EssentialContactService.getById(
				model.essentialContactId!,
			)
			if (essentialContact) {
				entity.localEssentialContactId = essentialContact.localId
			}
		}

		return entity
	}

	async convertEntityToModel(entity: ContactEntity): Promise<ContactDataModel> {
		const model: ContactDataModel = {
			name: entity.name,
			description: entity.description,
			color: entity.color,
		}

		if (hasValue(entity.localEssentialContactId)) {
			const essentialContact = await EssentialContactService.getByLocalId(
				entity.localEssentialContactId!,
			)

			if (essentialContact) {
				model.essentialContactId = essentialContact.id
			}
		}

		return model
	}
}

export default new ContactServiceImpl()
