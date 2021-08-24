import ContactEntity from '../../types/contact/database/ContactEntity'
import EssentialContactEntity from '../../types/contact/database/EssentialContactEntity'
import ContactView, { ContactType } from '../../types/contact/view/ContactView'
import StringUtils from '../../utils/StringUtils'
import { hasValue } from '../../utils/Utils'
import EssentialPhoneService from './EssentialPhoneService'
import PhoneService from './PhoneService'

export const getContactViewsForContacts = async (
	contacts: ContactEntity[],
): Promise<ContactView[]> => {
	const getPhones = (contact: ContactEntity) =>
		PhoneService.getAllByContactLocalId(contact.localId!)

	const makeView = async (contact: ContactEntity) => {
		return {
			contact: contact,
			phones: await getPhones(contact),
		} as ContactView
	}

	return await Promise.all(contacts.map(makeView))
}

export const getContactViewsForEssentialContacts = async (
	contacts: EssentialContactEntity[],
): Promise<ContactView[]> => {
	const getEssentialPhones = (contact: EssentialContactEntity) =>
		EssentialPhoneService.getAllByEssentialContactLocalId(contact.localId!)

	const makeView = async (contact: EssentialContactEntity) => {
		return {
			contact: contact,
			phones: await getEssentialPhones(contact),
		} as ContactView
	}

	return await Promise.all(contacts.map(makeView))
}

export const filterContactViews = (
	contacts: ContactView[],
	searchTerm: string,
) => {
	return contacts.filter(item =>
		StringUtils.contains(item.contact.name, searchTerm),
	)
}

export const contactViewSort = (contactViews: ContactView[]) => {
	return contactViews.sort((a, b) =>
		StringUtils.normalize(a.contact.name) >
		StringUtils.normalize(b.contact.name)
			? 1
			: -1,
	)
}

export const isEssential = (contact: ContactType): boolean =>
	hasValue((contact as EssentialContactEntity).isUniversal)

export const isUniversalEssential = (contact: ContactType) =>
	isEssential(contact) &&
	Boolean((contact as EssentialContactEntity).isUniversal)
