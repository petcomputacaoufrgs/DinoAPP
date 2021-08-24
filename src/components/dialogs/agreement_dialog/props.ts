export default interface AgreementDialogProps {
	question: string
	description?: string
	onAgree?: () => void
	onDisagree: () => void
	agreeOptionText?: string
	disagreeOptionText?: string
	open: boolean
}
