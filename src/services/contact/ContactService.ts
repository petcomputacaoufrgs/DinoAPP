import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import ContactRepository, {
  ContactRepositoryImpl,
} from '../../storage/database/contact/ContactRepository'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import StringUtils from '../../utils/StringUtils'
import ContactView from '../../types/contact/view/ContactView'
import SynchronizableService from '../sync/SynchronizableService'
import PhoneService from './PhoneService'
import GoogleContactService from './GoogleContactService'
import WebSocketQueueURLService from '../websocket/WebSocketQueueURLService'

export class ContactServiceImpl extends AutoSynchronizableService<
  number,
  ContactDataModel,
  ContactEntity,
  ContactRepositoryImpl
> {  
  constructor() {
    super(
      ContactRepository, 
      APIRequestMappingConstants.CONTACT,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.CONTACT
    )
  }

  getDependencies(): SynchronizableService[] {
    return []
  }

  async convertModelToEntity(model: ContactDataModel): Promise<ContactEntity> {
    const entity: ContactEntity = {
      name: model.name,
      description: model.description,
      color: model.color,
    }

    return entity
  }

  async convertEntityToModel(entity: ContactEntity): Promise<ContactDataModel> {
    const model: ContactDataModel = {
      name: entity.name,
      description: entity.description,
      color: entity.color,
    }

    return model
  }

  getViewContactByFilter(
    contacts: ContactEntity[],
    phones: PhoneEntity[],
    googleContacts: GoogleContactEntity[],
    searchTerm: string
  ): ContactView[] {
    const contactsFiltered = contacts.filter((item) =>
      StringUtils.contains(item.name, searchTerm)
    )

    return contactsFiltered.map(
      (contact) =>
        ({
          contact: contact,
          phones: PhoneService.getByContact(contact, phones),
          googleContact: GoogleContactService.getByContact(
            contact,
            googleContacts
          ),
        } as ContactView)
    )
  }
}

export default new ContactServiceImpl()
