export default interface AccessDialogProps {
	open: boolean
	icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
	onClose: () => void
	onConfirm: () => void
}
