import { Tooltip } from '@material-ui/core'
import React from 'react'
import Button from '..'
import DinoIconButtonProps from './props'
import './style.css'

const DinoIconButton: React.FC<DinoIconButtonProps> = props => {
	const Icon = props.icon

	const getClassName = (): string => {
		let mainClass = 'icon_button'

		if (props.className) {
			mainClass = mainClass.concat(' ').concat(props.className)
		}

		if (props.bigger) {
			mainClass = mainClass.concat(' button_bigger')
		}

		if (props.lum) {
			mainClass = mainClass.concat(` button_${props.lum}`)
		}

		return mainClass
	}

	return (
		<Tooltip placement="top" title={props.ariaLabel || ''} arrow>
      <div>
				<Button {...props} className={getClassName()}>
					<Icon />
				</Button>
			</div>
		</Tooltip>
	)
}

export default DinoIconButton
