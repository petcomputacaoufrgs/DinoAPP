export default interface ItemListMenuProps {
	anchor: HTMLElement | null
	setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>
	onEdit?: () => void
	onDelete: () => void
	onCloseDialog?: () => void
	disable?: boolean
	editText?: string
	hideEdit?: boolean
}
