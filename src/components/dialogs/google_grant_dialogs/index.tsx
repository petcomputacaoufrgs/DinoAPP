import React, { useState, useEffect } from 'react'
import { DialogActions } from '@material-ui/core'
import AuthService from '../../../services/auth/AuthService'
import { useAlert } from '../../../context/alert'
import { useLanguage } from '../../../context/language'
import DinoDialog, { DinoDialogContent, DinoDialogHeader } from '../dino_dialog'
import UserEntity from '../../../types/user/database/UserEntity'
import UserService from '../../../services/user/UserService'
import DinoLoader from '../../loader'
import ConnectionService from '../../../services/connection/ConnectionService'
import './styles.css'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import TextButton from '../../button/text_button'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'

interface GoogleGrantDialogProps {
	scopes: GoogleScope[]
	open: boolean
	onClose: () => void
	onAgree: () => void
	onDisagree: () => void
}

const GoogleGrantDialog: React.FC<GoogleGrantDialogProps> = ({
	scopes,
	open,
	onClose,
	onAgree,
	onDisagree,
	children,
}) => {
	const alert = useAlert()

	const [isLoading, setIsLoading] = useState(true)
	const [user, setUser] = useState<UserEntity | undefined>()
	const [isConnected, setIsConnected] = useState<boolean>(true)

	useEffect(() => {
		const loadData = async () => {
			const user = await UserService.getFirst()
			const isConnected = ConnectionService.isConnected()

			if (user) {
				updateData(user, isConnected)
			}

			finishLoading()
		}

		const updateConnectionState = () => {
			setIsConnected(ConnectionService.isConnected())
		}

		let updateData = (user: UserEntity, isConnected: boolean) => {
			setUser(user)
			setIsConnected(isConnected)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserService.addUpdateEventListenner(loadData)
		ConnectionService.addEventListener(updateConnectionState)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			UserService.removeUpdateEventListenner(loadData)
			ConnectionService.removeEventListener(updateConnectionState)
		}
	}, [isLoading])

	const language = useLanguage()

	const [refreshNecessary, setRefreshNecessary] = useState(false)

	const handleAgree = async () => {
		if (user) {
			const [response] = await AuthService.requestGoogleGrant(
				scopes,
				refreshNecessary,
				user.email,
			)

			setRefreshNecessary(false)

			const onSucess = () => {
				alert.showSuccessAlert(language.data.GRANT_FAIL_BY_EXTERNAL_SUCCESS)
				onAgree()
			}

			const onRefreshTokenNecessary = () => {
				setRefreshNecessary(true)
				alert.showInfoAlert(language.data.GRANT_RESFRESH_TOKEN_NECESSARY)
			}

			const onDisconnect = () => {
				alert.showErrorAlert(language.data.GRANT_FAIL_BY_DISCONNECTION)
				onClose()
			}

			const alerts = [
				onSucess,
				() => alert.showErrorAlert(language.data.GRANT_FAIL_BY_EXTERNAL_ERROR),
				() => alert.showInfoAlert(language.data.GRANT_CANCELED),
				() => alert.showInfoAlert(language.data.GRANT_FAIL_BY_INVALID_ACCOUNT),
				onRefreshTokenNecessary,
				onDisconnect,
				() => alert.showErrorAlert(language.data.GRANT_FAIL_BY_UNKNOW_ERROR),
			]

			const responseFoo = alerts[response]
			responseFoo()
		}
	}

	const handleDisagree = async () => {
		alert.showInfoAlert(language.data.GRANT_DECLINED)
		onDisagree()
	}

	const renderOfflineContent = (): JSX.Element => (
		<>
			<DinoDialogHeader>
				<h1>{language.data.NO_CONNECTION}</h1>
			</DinoDialogHeader>
			<DinoDialogContent>
				<p>{language.data.RENDER_OFFLINE_CONTENT_PART_1}</p>
				<p>{language.data.RENDER_OFFLINE_CONTENT_PART_2}</p>
			</DinoDialogContent>
		</>
	)

	return (
		<DinoDialog
			open={open}
			onClose={onClose}
			header={
				<DinoDialogHeader>
					<h3>{language.data.GOOGLE_GRANT_TITLE}</h3>
				</DinoDialogHeader>
			}
			actions={
				<DialogActions>
					<TextButton onClick={handleDisagree}>
						{language.data.DIALOG_DECLINE_BUTTON_TEXT}
					</TextButton>
					<TextButton onClick={handleAgree}>
						{language.data.DIALOG_AGREE_TEXT}
					</TextButton>
				</DialogActions>
			}
		>
			<DinoLoader isLoading={isLoading}>
				{isConnected ? children : renderOfflineContent()}
			</DinoLoader>
		</DinoDialog>
	)
}

export default GoogleGrantDialog
