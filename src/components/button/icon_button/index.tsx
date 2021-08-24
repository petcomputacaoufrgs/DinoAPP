import { Tooltip } from '@material-ui/core'
import React from 'react'
import Button from '..'
import DinoIconButtonProps from './props'
import './style.css'

const DinoIconButton: React.FC<DinoIconButtonProps> = props => {
	const Icon = props.icon

	const getClassName = (): string => {
		
		let mainClass = 'dino_icon_button'

		if (props.className) {
			mainClass = props.className.concat(' ').concat(mainClass)
		}

		if (props.circular) {
			mainClass = mainClass.concat(' ').concat("circular")
		}

		return mainClass
	}

	const getButtonClassName = (): string => {
		
		let buttonClass = 'dino_icon_button__button'

		if (props.bigger) {
			buttonClass = buttonClass.concat(' button_bigger')
		}

		if (props.lum) {
			buttonClass = buttonClass.concat(` button_${props.lum}`)
		}

		return buttonClass
	}

	return (
		<Tooltip 
			className={getClassName() + " dino_icon_button__tooltip"}
			title={props.ariaLabel || ''} 
			enterDelay={500} 
			arrow 
		>
			<div>
				<Button {...props} className={getButtonClassName()}>
					<Icon />
				</Button>
			</div>
		</Tooltip>
	)
}

export default DinoIconButton
