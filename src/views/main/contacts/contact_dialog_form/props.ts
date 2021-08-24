import ContactView from '../../../../types/contact/view/ContactView'

export default interface ContactFormDialogProps {
	dialogOpen: boolean
	onClose: () => void
	item?: ContactView
}
