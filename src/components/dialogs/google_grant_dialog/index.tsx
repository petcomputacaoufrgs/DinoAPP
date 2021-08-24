import React, { useState, useEffect } from 'react'
import GoogleGrantDialogProps from './props'
import { Dialog, Button } from '@material-ui/core'
import TransitionSlide from '../../slide_transition'
import AuthService from '../../../services/auth/AuthService'
import { useAlert } from '../../../context/alert'
import { useLanguage } from '../../../context/language'
import { DinoDialogContent, DinoDialogHeader } from '../dino_dialog'
import UserEntity from '../../../types/user/database/UserEntity'
import UserService from '../../../services/user/UserService'
import DinoLoader from '../../loader'
import ConnectionService from '../../../services/connection/ConnectionService'
import './styles.css'
import { HasStaffPowers } from '../../../context/private_router'
import UserSettingsService from '../../../services/user/UserSettingsService'

const GoogleGrantDialog = React.forwardRef<JSX.Element, GoogleGrantDialogProps>(
	({ scopes, open, settings, onClose }, ref) => {
		const alert = useAlert()
		const isStaff = HasStaffPowers()

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

		const handleAcceptClick = async () => {
			if (user) {
				const [response] = await AuthService.requestGoogleGrant(
					scopes,
					refreshNecessary,
					user.email,
				)

				setRefreshNecessary(false)

				const onSucess = () => {
					alert.showSuccessAlert(language.data.GRANT_FAIL_BY_EXTERNAL_SUCCESS)
					onClose()
					if (settings) {
						settings.declineGoogleContacts = false
						UserSettingsService.save(settings)
					}
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
					() =>
						alert.showErrorAlert(language.data.GRANT_FAIL_BY_EXTERNAL_ERROR),
					() => alert.showInfoAlert(language.data.GRANT_CANCELED),
					() =>
						alert.showInfoAlert(language.data.GRANT_FAIL_BY_INVALID_ACCOUNT),
					onRefreshTokenNecessary,
					onDisconnect,
					() => alert.showErrorAlert(language.data.GRANT_FAIL_BY_UNKNOW_ERROR),
				]

				const responseFoo = alerts[response]
				responseFoo()
			}
		}

		const handleDecline = async () => {
			alert.showInfoAlert(language.data.GRANT_DECLINED)
			onClose()
			if (settings) {
				settings.declineGoogleContacts = true
				UserSettingsService.save(settings)
			}
		}

		const renderDialogContent = (): JSX.Element => (
			<>
				<DinoDialogHeader>
					<h1>{language.data.GOOGLE_CONTACT_GRANT_TITLE}</h1>
				</DinoDialogHeader>
				<DinoDialogContent>
					<p>{language.data.GOOGLE_CONTACT_GRANT_TEXT}</p>
				</DinoDialogContent>
				<div className='google_grant_dialog__buttons'>
					<Button onClick={handleDecline}>
						{language.data.DIALOG_DECLINE_BUTTON_TEXT}
					</Button>
					<Button
						autoFocus
						onClick={handleAcceptClick}
						className='google_grant_dialog__buttons__accept_button'
					>
						{language.data.DIALOG_AGREE_TEXT}
					</Button>
				</div>
			</>
		)

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
			<Dialog
				className='google_grant_dialog'
				ref={ref}
				fullWidth
				maxWidth='xs'
				onClose={onClose}
				TransitionComponent={TransitionSlide}
				open={open && !isStaff}
			>
				<DinoLoader isLoading={isLoading}>
					{isConnected ? renderDialogContent() : renderOfflineContent()}
				</DinoLoader>
			</Dialog>
		)
	},
)

export default GoogleGrantDialog
