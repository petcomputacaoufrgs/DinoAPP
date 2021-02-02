import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import ContactView from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import ContactService from '../../../../services/contact/ContactService'
import GoogleContactService from '../../../../services/contact/GoogleContactService'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'
import { IsStaff } from '../../../../context/private_router'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import ItemListMenu from '../../../../components/item_list_menu'
import ContactEntity from '../../../../types/contact/database/ContactEntity'

const ContactItems: React.FC<ContactItemsProps> = ({ items }) => {
	const [toEdit, setToEdit] = useState(false)
	const [toView, setToView] = useState(false)
	const [toDelete, setToDelete] = useState(false)
	const [selectedItem, setSelectedItem] = useState<ContactView | EssentialContactView | undefined>(undefined)

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const language = useLanguage()
	const staff = IsStaff()

	const handleAcceptDialogAndDeleteItem = async () => {

		async function deleteGoogleContact (
			contactToDelete: ContactView,
		): Promise<void> {
			if (contactToDelete.googleContact) {
				await GoogleContactService.delete(contactToDelete.googleContact)
			}
		}

		async function deletePhones (
			contactToDelete: ContactView | EssentialContactView,
		): Promise<void> {
			if (contactToDelete.phones.length > 0) {
				await PhoneService.deleteAll(contactToDelete.phones)
			}
		}

		if (toDelete && selectedItem) {
			await deletePhones(selectedItem)
			if(staff) {
				await EssentialContactService.delete(selectedItem.contact as EssentialContactEntity)
			} else {
				await deleteGoogleContact(selectedItem)
				await ContactService.delete(selectedItem.contact)
			}
		}
		setToDelete(false)
	}

	const handleViewOption = () => {
		setToView(true)
	}

	const handleEditOption = () => {
		setToEdit(true)
	}

	const handleDeleteOption = () => {
		setToDelete(true)
	}

	const isEditUnavailable = selectedItem 
	&& (selectedItem.contact as ContactEntity)
	.localEssentialContactId !== undefined

	return (
		<>
			<List className='contacts__list'>
				{items.map((item, index) => 
					<ContactItemList
						key={index}
						item={item}
						onClick={handleViewOption}
						setSelected={setSelectedItem}
						setAnchor={setAnchorEl}
					/>
				)}
			</List>
			{selectedItem && (
				<>
				<ContactCard
					dialogOpen={toView}
					onClose={() => setToView(false)}
					item={selectedItem}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
				/>
				<ContactFormDialog
					dialogOpen={toEdit}
					onClose={() => setToEdit(false)}
					item={selectedItem}
					items={items}
					action={Constants.EDIT}
				/>
				<AgreementDialog
					open={toDelete}
					agreeOptionText={language.data.AGREEMENT_OPTION_TEXT}
					disagreeOptionText={language.data.DISAGREEMENT_OPTION_TEXT}
					description={language.data.DELETE_CONTACT_OPTION_TEXT}
					question={language.data.DELETE_CONTACT_QUESTION}
					onAgree={handleAcceptDialogAndDeleteItem}
					onDisagree={() => setToDelete(false)}
				/>
				<ItemListMenu
					anchor={anchorEl}
					setAnchor={setAnchorEl}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
					onCloseDialog={() => setToView(false)}
					editUnavailable={isEditUnavailable}
				/>
				</>
			)}
		</>
	)
}

export default ContactItems
