import React from 'react'
import { useAlert } from '../../context/alert'
import { ReactComponent as Dinosaur1 } from '../../assets/logos/dino_logo.svg'
import { ReactComponent as Dinosaur2 } from '../../assets/icons/dino/dinosaur_2.svg'
import GoogleLoginButton from '../../components/button/google_login'
import { useLanguage } from '../../context/language'
import DinoLoader from '../../components/loader'
import LinkButton from '../../components/button/link_button'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import './styles.css'

const Login = (): JSX.Element => {
	const alert = useAlert()

	const language = useLanguage()

	const showAlertDinoFail = () => {
		alert.showErrorAlert(language.data.LOGIN_FAIL_BY_API)
	}

	const showAlertGoogleFail = () => {
		alert.showErrorAlert(language.data.LOGIN_FAIL_BY_GOOGLE)
	}

	const showAlertRefreshError = () => {
		alert.showInfoAlert(language.data.LOGIN_REFRESH_NECESSARY)
	}

	const showAlertCancel = () => {
		alert.showInfoAlert(language.data.LOGIN_CANCELED)
	}

	const renderLoginButton = (): JSX.Element => (
		<GoogleLoginButton
			onCancel={showAlertCancel}
			onDinoAPIFail={showAlertDinoFail}
			onGoogleFail={showAlertGoogleFail}
			onRefreshTokenLostError={showAlertRefreshError}
			text={language.data.LOGIN_BUTTON_TEXT}
		/>
	)

	return (
		<DinoLoader isLoading={language.loading}>
			<div className='login'>
				<Dinosaur2 className='login__curious' />
				<Dinosaur1 className='login__logo' />
				<h1 className='login__content__message'>
					{language.data.WELCOME_MESSAGE}
				</h1>
				<div className='login__content__button'>{renderLoginButton()}</div>
				<div className='login__content__info dino__flex_row'>
					<LinkButton
						text={language.data.ABOUT_US}
						onClick={() => HistoryService.push(PathConstants.ABOUT_US)}
					/>
					<LinkButton
						text={language.data.PRIVACY_POLICY}
						onClick={() => HistoryService.push(PathConstants.PRIVACY_POLICY)}
					/>
					<LinkButton
						text={language.data.TERMS_OF_USE}
						onClick={() => HistoryService.push(PathConstants.TERMS_OF_USE)}
					/>
				</div>
			</div>
		</DinoLoader>
	)
}

export default Login
