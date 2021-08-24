import { MobileStepper } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import React from 'react'
import DinoStepperProps from './props'
import TextButton from '../button/text_button/index'
import { useLanguage } from '../../context/language'
import './styles.css'

const DinoStepper: React.FC<DinoStepperProps> = ({
	steps,
	activeStep,
	endMessage,
	onNext,
	onBack,
	onEnd,
	onCancel,
}) => {
	const language = useLanguage()

	return (
		<MobileStepper
			className='dino_stepper'
			variant='progress'
			steps={steps}
			position='static'
			activeStep={activeStep}
			nextButton={
				activeStep === steps - 1 ? (
					<TextButton className='next__button' onClick={onEnd}>
						{endMessage}
						<KeyboardArrowRight />
					</TextButton>
				) : (
					<TextButton className='next__button' onClick={onNext}>
						{language.data.NEXT_BUTTON_TEXT}
						<KeyboardArrowRight />
					</TextButton>
				)
			}
			backButton={
				activeStep === 0 ? (
					onCancel ? (
						<TextButton className='back__button' onClick={() => onCancel()}>
							<KeyboardArrowLeft />
							{language.data.CANCEL}
						</TextButton>
					) : (
						<div className='empty__action'></div>
					)
				) : (
					<TextButton className='back__button' onClick={onBack}>
						<KeyboardArrowLeft />
						{language.data.PREVIOUS_BUTTON_TEXT}
					</TextButton>
				)
			}
		/>
	)
}

export default DinoStepper
