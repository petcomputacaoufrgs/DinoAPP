import React, { useState, useEffect } from 'react'
import DinoLoader from '../../loader'
import { ReactComponent as GoogleLogoSVG } from '../../../assets/logos/google.svg'
import LoginButtonProps from './props'
import LoginStatusConstants from '../../../constants/login/LoginStatusConstants'
import AuthService from '../../../services/auth/AuthService'
import ConnectionService from '../../../services/connection/ConnectionService'
import { useAlert } from '../../../context/alert'
import TextIconButton from '../icon_text_button'
import { useGoogleOAuth2 } from '../../../context/google_oauth2/index'
import { useLanguage } from '../../../context/language/index'
import './styles.css'

const GoogleLoginButton: React.FC<LoginButtonProps> = ({
	onCancel,
	onDinoAPIFail,
	onGoogleFail,
	onRefreshTokenLostError,
	text,
}) => {
	const language = useLanguage()
	const alert = useAlert()
	const googleOAuth2 = useGoogleOAuth2()

	const [loading, setLoading] = useState(false)
	const [refreshRequired, setRefreshRequired] = useState(false)
	const [refreshEmail, setRefreshEmail] = useState<string | undefined>(
		undefined,
	)

	const [isConnected, setIsConnected] = useState(
		ConnectionService.isConnected(),
	)

	useEffect(() => {
		const updateConnectionState = (connected: boolean) => {
			setIsConnected(connected)
		}

		ConnectionService.addEventListener(updateConnectionState)

		const cleanBeforeUpdate = () => {
			ConnectionService.removeEventListener(updateConnectionState)
		}

		return cleanBeforeUpdate
	})

	const handleLoginButtonClick = async () => {
		setLoading(true)

		const isDinoConnected = await ConnectionService.isDinoConnected()

		if (!isDinoConnected) {
			setLoading(false)
			setIsConnected(false)
			return
		}

		const [status, email] = await AuthService.requestGoogleLogin(
			refreshRequired,
			refreshEmail,
		)

		if (status === LoginStatusConstants.SUCCESS) {
			return
		}

		setRefreshEmail(undefined)
		setRefreshRequired(false)

		if (status === LoginStatusConstants.REQUEST_CANCELED) {
			onCancel && onCancel()
		} else if (status === LoginStatusConstants.UNKNOW_API_ERROR) {
			onDinoAPIFail && onDinoAPIFail()
		} else if (status === LoginStatusConstants.EXTERNAL_SERVICE_ERROR) {
			onGoogleFail && onGoogleFail()
		} else if (status === LoginStatusConstants.REFRESH_TOKEN_NECESSARY) {
			setRefreshRequired(true)
			setRefreshEmail(email)
			onRefreshTokenLostError && onRefreshTokenLostError()
		} else if (status === LoginStatusConstants.DISCONNECTED) {
			showOfflineMessage()
		}

		setLoading(false)
	}

	const showOfflineMessage = () => {
		alert.showInfoAlert(language.data.CANT_LOGIN_DISCONNECTED)
	}

	return (
		<DinoLoader
			iconClassName='google_login_button__loader'
			isLoading={loading || googleOAuth2.loading}
		>
			<div className='google_login_button'>
				<TextIconButton
					ariaLabel={language.data.GOOGLE_LOGIN_BUTTON_ARIA_LABEL}
					icon={GoogleLogoSVG}
					className={'google_login_button__text_button'}
					onClick={isConnected ? handleLoginButtonClick : showOfflineMessage}
					disabled={!isConnected}
				>
					<p className='google_login_button__text_button__text'>{text}</p>
				</TextIconButton>
				{!isConnected && (
					<p className='google_login_button__error'>
						{language.data.DISCONNECTED}
					</p>
				)}
			</div>
		</DinoLoader>
	)
}

export default GoogleLoginButton
