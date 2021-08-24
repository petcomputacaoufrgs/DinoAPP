import React, { useState, useEffect } from 'react'
import { Dialog, DialogActions } from '@material-ui/core'
import { useLanguage } from '../../context/language/index'
import TransitionSlide from '../slide_transition'
import DinoStepper from '../dino_stepper'
import * as ServiceWorkerRegistration from '../../ServiceWorkerRegistration'
import { useAlert } from '../../context/alert'

const NUMBER_OF_STEPS = 4

const PWAControl: React.FC = () => {
	const alert = useAlert()
	const language = useLanguage()

	const [isFirstLoad, setFirstLoad] = useState(true)
	const [openIntroDialog, setOpenIntroDialog] = useState(true)
	const [introStep, setIntroStep] = useState(0)

	const handleNextStep = () => {
		if (introStep < NUMBER_OF_STEPS - 1) {
			setIntroStep(introStep + 1)
		}
	}

	const handleBackStep = () => {
		if (introStep > 0) {
			setIntroStep(introStep - 1)
		}
	}

	const handleEnd = () => {
		setOpenIntroDialog(false)
	}

	useEffect(() => {
		const onServiceWorkerReadyMessage = () => {
			setOpenIntroDialog(true)
		}

		const onServiceWorkerUpdateAvailable = () => {
			alert.showInfoAlert(language.data.APP_UPDATE_MESSAGE)
		}

		if (isFirstLoad) {
			setFirstLoad(false)
			window.addEventListener('load', () => {
				ServiceWorkerRegistration.start({
					onSuccess: onServiceWorkerReadyMessage,
					onUpdate: onServiceWorkerUpdateAvailable,
				})
			})
		}
	}, [isFirstLoad, alert, language, setIntroStep])

	return (
		<Dialog
			className='pwa_control__intro_dialog'
			aria-labelledby={language.data.FIRST_LOGIN_DIALOG_LABEL}
			open={openIntroDialog}
			TransitionComponent={TransitionSlide}
			disableEscapeKeyDown
			disableBackdropClick
			fullWidth
		>
			<DialogActions>
				<DinoStepper
					steps={NUMBER_OF_STEPS}
					activeStep={introStep}
					endMessage={language.data.END}
					onNext={handleNextStep}
					onBack={handleBackStep}
					onEnd={handleEnd}
				/>
			</DialogActions>
		</Dialog>
	)
}

export default PWAControl
