import React from 'react'
import Button from '..'
import { useLanguage } from '../../../context/language'
import { ReactComponent as SaveSVG } from '../../../assets/icons/general_use/save.svg'
import './styles.css'
import ButtonProps from '../props'

export const SaveButton: React.FC<ButtonProps> = props => {
	const language = useLanguage()

	return (
		<Button className='save_button' {...props}>
			<SaveSVG className='save_button__icon' />
			{language.data.SAVE}
		</Button>
	)
}
