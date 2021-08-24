export interface SelectPasswordProps {
	oldPassword?: string
	onChangeOldPassword?: (event: React.ChangeEvent<HTMLInputElement>) => void
	parentsAreaPassword: string
	onChangeConfirmPassword: (event: React.ChangeEvent<HTMLInputElement>) => void
	confirmParentsAreaPassword: string
	onChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void
	passwordErrorMessage?: string
	showOldPasswordField?: boolean
}
