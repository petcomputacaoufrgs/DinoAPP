import ContactView from '../../../../types/contact/view/ContactView'

export default interface ContactCardProps {
	item?: ContactView
	dialogOpen: boolean
	onClose: () => void
	onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
