import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../BaseLocalStorage'
import ContactModel from '../api_model/ContactModel'
import StrU from '../../../utils/StringUtils'
import ArrayU from '../../../utils/ArrayUtils'

class ContactsLocalStorage extends BaseLocalStorage {

    getItems = (): Array<ContactModel> => {
        let items = this.get(LS_Constants.CONTACTS)
        let result = Array<ContactModel>()
        if (items) 
            result = JSON.parse(items)
        return result
    }

    setItems = (items: ContactModel[]) => {
        this.set(LS_Constants.CONTACTS, JSON.stringify(StrU.sortByAttr(items, "name")))
    }

    setShouldSyncItems = (items: Array<number>) => {
        this.set(LS_Constants.SHOULD_SYNC_CONTACTS, items.toString())
    }

    getShouldSyncItems = (): number[] => {
        const items = this.get(LS_Constants.SHOULD_SYNC_CONTACTS)?.split(',').map(x => +x)
        console.log(items)
        return items || []
    }

    addShouldSyncItem = (id: number) => {
        let items = this.getShouldSyncItems()
        if(!items.includes(id)){
            items.push(id)
            this.setShouldSyncItems(items)
        }
    }

    cleanShouldSync = () => {
        localStorage.removeItem(LS_Constants.SHOULD_SYNC_CONTACTS)
    }

    getLastId = (): number => {
       const id = localStorage.getItem(LS_Constants.CONTACTS_LAST_ID)
       return id ?  Number(id) : 0 
    }

    updateLastId = (): number => {
        const lastId = this.getLastId() + 1
        localStorage.setItem(LS_Constants.CONTACTS_LAST_ID, lastId.toString())
        return lastId
    }
}

export default new ContactsLocalStorage()
