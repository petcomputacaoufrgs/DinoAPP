import ContactView from '../../../../../types/contact/view/ContactView'

export default interface ContactItemListProps {
	item: ContactView
	onClick: (item: ContactView) => void
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement>, item: ContactView) => void
}
