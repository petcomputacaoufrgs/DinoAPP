import ContactEntity from '../database/ContactEntity'
import EssentialContactEntity from '../database/EssentialContactEntity'
import EssentialPhoneEntity from '../database/EssentialPhoneEntity'
import PhoneEntity from '../database/PhoneEntity'

export type ContactType = ContactEntity | EssentialContactEntity
export type PhoneType = PhoneEntity | EssentialPhoneEntity

export default interface ContactView {
	contact: ContactType
	phones: PhoneType[]
}
