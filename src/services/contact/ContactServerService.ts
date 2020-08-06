import ContactModel from '../../types/contact/ContactModel'
import SaveResponseModelAll from '../../types/contact/SaveResponseModelAll'
import SaveResponseModel from '../../types/contact/SaveResponseModel'
import ContactResponseModel from '../../types/contact/ContactResponseModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import DinoAgentService from '../../agent/DinoAgentService'
import AgentStatus from '../../types/agent/AgentStatus'
import Service from './ContactService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'


class ContactServerService {

  updateServer = async () => {

    let sucessfulAdd = true
    let sucessfulEdit = true
    let idsToUpdate = Service.getIdsToUpdate()

        if(idsToUpdate.length > 0) {

          const contacts = Service.getItems()
          const contactsToUpdate = Service.getContactsToUpdate(contacts, idsToUpdate)

          if(contactsToUpdate.toAdd.length > 0) {
            
            const responseSaveModel = await this.saveContacts(contactsToUpdate.toAdd)
            
            if(responseSaveModel !== undefined) {
              
              const version = responseSaveModel.version
              const responseContactModels = responseSaveModel.contactResponseModels

              if(version !== undefined && responseContactModels !== undefined) {
                Service.setVersion(version)
                Service.updateContactIds(responseContactModels, contacts)
              }

            } else sucessfulAdd = false
          }

          if(contactsToUpdate.toEdit.length > 0) {
            
            const version = await this.editContacts(contactsToUpdate.toEdit)
            
            if (version !== undefined) {
              Service.setVersion(version)

            } else sucessfulEdit = false  
          }

          if(sucessfulAdd && sucessfulEdit) 
            Service.cleanUpdateQueue()
          else Service.setContactsToUpdate(contactsToUpdate.toEdit.concat(contactsToUpdate.toAdd))
        }

        const idsToDelete = Service.getIdsToDelete()

        if(idsToDelete.length > 0) {

          const version = await this.deleteContacts(idsToDelete)

          if (version !== undefined) {
            Service.setVersion(version)
            Service.cleanDeleteQueue()
          }
        }
  }

  saveContact = async (contactModel: ContactModel): Promise<ContactResponseModel | undefined> => {
    const request = await DinoAgentService.post(DinoAPIURLConstants.CONTACT_SAVE)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactModel)

        if (response.status === HttpStatus.OK) {
          const responseSaveModel = response.body as SaveResponseModel
          
          Service.setVersion(responseSaveModel.version)
          return responseSaveModel.contactResponseModel
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    Service.pushToUpdate(contactModel.frontId)
    return undefined
  }

  saveContacts = async (contactModels: Array<ContactModel>): Promise<SaveResponseModelAll | undefined> => {
    const request = await DinoAgentService.post(DinoAPIURLConstants.CONTACT_SAVE_ALL)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactModels)

        if (response.status === HttpStatus.OK) {
          return response.body as SaveResponseModelAll
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
      return undefined
    }
  }

  editContact = async (contactModel: ContactModel) => {

    const request = await DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactModel)

        if (response.status === HttpStatus.OK) {
          Service.setVersion(response.body) 
          return
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    Service.pushToUpdate(contactModel.frontId)
  }

  editContacts = async (contactModels: Array<ContactModel>): Promise<number | undefined> => {

    const request = await DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactModels)

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }

      return undefined
    }
  }

  deleteContact = async (contactId: number) => {

    const request = await DinoAgentService.delete(DinoAPIURLConstants.CONTACT_DELETE)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send({id: contactId})

        if (response.status === HttpStatus.OK) {
          Service.setVersion(response.body) 
          return
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    Service.pushToDelete(contactId)
  }

  deleteContacts = async (contactIds: {id: number}[]): Promise<number | undefined> => {

    const request = await DinoAgentService.delete(DinoAPIURLConstants.CONTACT_DELETE_ALL)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactIds)

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }

      return undefined
    }
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.CONTACT_VERSION)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!

        if (response.status === HttpStatus.OK) {
          const version: number = response.body

          return version
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

}


export default new ContactServerService()
