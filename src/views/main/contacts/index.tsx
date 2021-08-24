import React, { useEffect, useState } from 'react'
import {
	isEssential,
	contactViewSort,
	filterContactViews,
	getContactViewsForContacts,
	getContactViewsForEssentialContacts,
	isUniversalEssential,
} from '../../../services/contact/ContactViewService'
import ContactItems from './contact_list_items'
import DinoSearchBar from '../../../components/search_bar'
import ContactFormDialog from './contact_dialog_form'
import GoogleGrantDialog from '../../../components/dialogs/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import DinoLoader from '../../../components/loader'
import { useLanguage } from '../../../context/language'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import ContactView, {
	ContactType,
} from '../../../types/contact/view/ContactView'
import ContactService from '../../../services/contact/ContactService'
import PhoneService from '../../../services/contact/PhoneService'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import { HasStaffPowers } from '../../../context/private_router'
import AddButton from '../../../components/button/icon_button/add_button'
import EssentialPhoneService from '../../../services/contact/EssentialPhoneService'
import { Star, Public } from '@material-ui/icons'
import DinoFilterList from '../../../components/list_components/filter_list'
import ListTitle from '../../../components/list_components/list_title'
import CRUDEnum from '../../../types/enum/CRUDEnum'
import 'bootstrap/dist/css/bootstrap.min.css'
import FilterService from '../../../storage/local_storage/filter/FilterService'
import ContactEntity from '../../../types/contact/database/ContactEntity'

export const renderIcon = (contact: ContactType) => {
	if (isUniversalEssential(contact)) return <Public />
	if (isEssential(contact)) return <Star />
	if (contact.name) return contact.name[0].toUpperCase()

	return '?'
}

const Contacts: React.FC = () => {
	const hasStaffPowers = HasStaffPowers()
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [contacts, setContacts] = useState<ContactView[]>([])
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [syncGoogleContacts, setSyncGoogleContacts] = useState(false)
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [searchTerm, setSearchTerm] = useState('')
	const [filters, setFilters] = useState(
		FilterService.getContactFilters(hasStaffPowers, language),
	)

	let filteredContacts = filterContactViews(contacts, searchTerm).filter(c =>
		filters.some(f => f.checked && f.validator(c.contact)),
	)

	const handleChangeChecked = (index: number) => {
		const filter = filters[index]
		filter.checked = !filter.checked
		setFilters([...filters])
	}

	useEffect(() => {
		const loadUserData = async (): Promise<ContactEntity[]> => {
			const syncGoogleContacts = await GoogleScopeService.hasContactGrant()
			updateSyncGoogleContacts(syncGoogleContacts)
			return ContactService.getAll()
		}

		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			let contactViews: ContactView[] = []

			if (hasStaffPowers) {
				const contacts = await EssentialContactService.getAll()
				contactViews = await getContactViewsForEssentialContacts(contacts)
			} else {
				const contacts = await loadUserData()
				contactViews = await getContactViewsForContacts(contacts)

				if (settings?.includeEssentialContact) {
					const userECs =
						await EssentialContactService.getUserEssentialContacts(settings)

					const ECviews = await getContactViewsForEssentialContacts(userECs)
					contactViews.push(...ECviews)
				}
			}

			updateContacts(contactViews)
			updateSettings(settings)
			finishLoading()
		}

		ContactService.addUpdateEventListenner(loadData)
		PhoneService.addUpdateEventListenner(loadData)
		EssentialContactService.addUpdateEventListenner(loadData)
		EssentialPhoneService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		let updateContacts = (contactViews: ContactView[]) => {
			setContacts(contactViewSort(contactViews))
		}

		let updateSettings = (settings: UserSettingsEntity | undefined) => {
			setSettings(settings)
		}

		let updateSyncGoogleContacts = (syncGoogleContacts: boolean) => {
			setSyncGoogleContacts(syncGoogleContacts)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateContacts = () => {}
			updateSettings = () => {}
			updateSyncGoogleContacts = () => {}
			finishLoading = () => {}
			ContactService.removeUpdateEventListenner(loadData)
			PhoneService.removeUpdateEventListenner(loadData)
			EssentialContactService.removeUpdateEventListenner(loadData)
			EssentialPhoneService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, hasStaffPowers])

	const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchTerm(event.target.value)
	}

	const handleCloseGoogleGrant = () => {
		setOpenGrantDialog(false)
		handleCreate()
	}

	const handleAddContact = () => {
		if (settings && !hasStaffPowers) {
			if (!syncGoogleContacts && !settings.declineGoogleContacts) {
				setOpenGrantDialog(true)
				return
			}
		}
		handleCreate()
	}

	const handleClose = () => setToAction(CRUDEnum.NOP)

	const handleCreate = () => setToAction(CRUDEnum.CREATE)

	return (
		<div className='contacts'>
			<DinoLoader className='contacts__loader' isLoading={isLoading}>
				<DinoSearchBar value={searchTerm} onChange={handleChange} />
				<div className='dino__flex_row dino__list_and_filter'>
					<ListTitle title={language.data.MENU_CONTACTS} />
					<DinoFilterList
						filters={filters}
						onChangeChecked={handleChangeChecked}
					/>
				</div>
				<ContactItems items={filteredContacts} />
			</DinoLoader>
			<AddButton
				handleAdd={handleAddContact}
				label={language.data.NEW_CONTACT}
			/>
			<ContactFormDialog
				dialogOpen={toAction === CRUDEnum.CREATE}
				onClose={handleClose}
			/>
			<GoogleGrantDialog
				settings={settings}
				onClose={handleCloseGoogleGrant}
				open={openGrantDialog}
				scopes={[GoogleScope.CONTACT_SCOPE]}
			/>
		</div>
	)
}

export default Contacts
