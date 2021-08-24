export default interface DinoDialogProps {
	className?: string
	open: boolean
	onClose: () => void
	onSave: () => void
	header?: React.ReactNode
	actions?: React.ReactNode
	labelSave?: string
	labelClose?: string
}
