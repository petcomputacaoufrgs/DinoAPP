import ContactEntity from '../../../../../types/contact/database/ContactEntity'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'

export interface ContactFormDialogContentProps {
	contact: ContactEntity
	phones: PhoneEntity[]
	errorName?: string
	errorPhone?: string
	setContact: (value: React.SetStateAction<ContactEntity>) => void
	setPhones: (value: React.SetStateAction<PhoneEntity[]>) => void
	handleAddPhone: () => void
	handleDeletePhone: (number: string) => void
}
