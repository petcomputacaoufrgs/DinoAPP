import React, { useState, useEffect } from 'react'
import ContactFormDialogProps from './props'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import PhoneEntity from '../../../../types/contact/database/PhoneEntity'
import Constants from '../../../../constants/app_data/DataConstants'
import StringUtils from '../../../../utils/StringUtils'
import ContactView, {
	ContactType,
	PhoneType,
} from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import ContactService from '../../../../services/contact/ContactService'
import PhoneService from '../../../../services/contact/PhoneService'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import SelectMultipleTreatments from '../../../../components/settings/select_multiple_treatments'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import DinoHr from '../../../../components/dino_hr'
import { HasStaffPowers } from '../../../../context/private_router'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import EssentialPhoneEntity from '../../../../types/contact/database/EssentialPhoneEntity'
import EssentialPhoneService from '../../../../services/contact/EssentialPhoneService'
import './styles.css'
import ArrayUtils from '../../../../utils/ArrayUtils'
import DataConstants from '../../../../constants/app_data/DataConstants'

const getContact = (item?: ContactView): ContactType =>
	item ? item.contact : { name: '', description: '' }

const getPhones = (item?: ContactView): PhoneType[] =>
	item
		? item.phones
		: [{ number: '', type: Constants.CONTACT_PHONE_CODE_MOBILE }]

const getTreatmentLocalIds = (item?: ContactView): number[] =>
	item ? (item?.contact as EssentialContactEntity).treatmentLocalIds || [] : []

const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
	dialogOpen,
	onClose,
	item,
}) => {
	const language = useLanguage()
	const hasStaffPowers = HasStaffPowers()
	const [errorName, setErrorName] = useState<string>()
	const [errorPhone, setErrorPhone] = useState<string>()
	const [contact, setContact] = useState(getContact(item))
	const [contactPhones, setContactPhones] = useState(getPhones(item))
	const [selectedTreatmentLocalIds, setSelectedTreatmentLocalIds] = useState<
		number[]
	>(getTreatmentLocalIds(item))
	const [phonesToDelete, setPhonesToDelete] = useState<PhoneEntity[]>([])

	useEffect(() => {
		if (dialogOpen) {
			setContact(getContact(item))
			setContactPhones(getPhones(item))
			setErrorName(undefined)
			setErrorPhone(undefined)
			setSelectedTreatmentLocalIds(getTreatmentLocalIds(item))
			setPhonesToDelete(new Array<PhoneEntity>())
		}
	}, [dialogOpen, item])

	const handleSave = () => {
		function validInfo(): boolean {
			if (StringUtils.isEmpty(contact.name)) {
				setErrorName(language.data.EMPTY_FIELD_ERROR)
				return false
			}

			if (hasStaffPowers) {
				const hasAtLeastOnePhone = contactPhones.some(p =>
					StringUtils.isNotEmpty(p.number),
				)
				if (!hasAtLeastOnePhone) {
					setErrorPhone(language.data.ESSENTIAL_CONTACT_MUST_HAVE_PHONE)
					return false
				}
			}

			return true
		}

		if (validInfo()) {
			save()
			onClose()
		}
	}

	const save = async () => {
		async function savePhones(contact: ContactType) {
			const newPhones = contactPhones.filter(phone => phone.number !== '')

			hasStaffPowers
				? newPhones.forEach(
						(ePhone: EssentialPhoneEntity) =>
							(ePhone.localEssentialContactId = contact.localId),
				  )
				: newPhones.forEach(
						(phone: PhoneEntity) => (phone.localContactId = contact.localId),
				  )

			if (ArrayUtils.isNotEmpty(newPhones)) {
				hasStaffPowers
					? await EssentialPhoneService.saveAll(newPhones)
					: await PhoneService.saveAll(newPhones)
			}

			if (ArrayUtils.isNotEmpty(phonesToDelete)) {
				hasStaffPowers
					? await EssentialPhoneService.deleteAll(phonesToDelete)
					: await PhoneService.deleteAll(phonesToDelete)
			}
		}

		async function saveEssentialContact() {
			const essentialContact: EssentialContactEntity = {
				...contact,
				treatmentLocalIds: selectedTreatmentLocalIds,
				isUniversal: ArrayUtils.isNotEmpty(selectedTreatmentLocalIds)
					? DataConstants.FALSE
					: DataConstants.TRUE,
			}

			return await EssentialContactService.save(essentialContact)
		}

		const saved: ContactType | undefined = hasStaffPowers
			? await saveEssentialContact()
			: await ContactService.save(contact)

		if (saved) savePhones(saved)
	}

	const handleDeletePhone = (number: string) => {
		if (hasStaffPowers && contactPhones.length < 2) {
			setErrorPhone(language.data.ESSENTIAL_CONTACT_MUST_HAVE_PHONE)
		} else {
			const indexPhone = contactPhones.findIndex(
				phone => phone.number === number,
			)
			phonesToDelete.push(contactPhones[indexPhone])
			contactPhones.splice(indexPhone, 1)
			setContactPhones([...contactPhones])
		}
	}

	const handleAddPhone = () =>
		setContactPhones([...contactPhones, ...getPhones()])

	const handleChangeTreatments = (ids: number[]) =>
		setSelectedTreatmentLocalIds([...ids])

	const renderSelectTreatments = () => {
		return (
			<>
				<DinoHr />
				<SelectMultipleTreatments
					selectedLocalIds={selectedTreatmentLocalIds}
					handleChange={handleChangeTreatments}
				/>
			</>
		)
	}

	return (
		<div className='contact__form'>
			<DinoDialog
				open={dialogOpen}
				onClose={onClose}
				onSave={handleSave}
				header={
					<ContactFormDialogHeader
						contact={contact}
						setContact={setContact}
						handleCloseDialog={onClose}
					/>
				}
			>
				<ContactFormDialogContent
					contact={contact}
					setContact={setContact}
					phones={contactPhones}
					setPhones={setContactPhones}
					errorName={errorName}
					errorPhone={errorPhone}
					handleDeletePhone={handleDeletePhone}
					handleAddPhone={handleAddPhone}
				>
					{hasStaffPowers && renderSelectTreatments()}
				</ContactFormDialogContent>
			</DinoDialog>
		</div>
	)
}

export default ContactFormDialog
