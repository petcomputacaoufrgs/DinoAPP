import React from 'react'
import { Switch } from '@material-ui/core'
import SwitchProps from './props'
import './styles.css'

const DinoSwitch: React.FC<SwitchProps> = ({ selected, onChangeSelected, label }) => {

	return (
		<div className='dino_switch__form'>
			<p>{label}</p>
			<Switch
				size='medium'
				className='dino_switch__form__switch'
				checked={selected}
				onClick={onChangeSelected}
			/>
		</div>
	)
}

export default DinoSwitch
