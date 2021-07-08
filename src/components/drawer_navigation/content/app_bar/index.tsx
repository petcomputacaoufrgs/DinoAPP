import React from 'react'
import AppBarProps from './props'
import DinoIconButton from '../../../button/icon_button'
import ArrowBack from '../../../arrow_back'
import { ReactComponent as MenuIconSVG } from '../../../../assets/icons/menu.svg'
import { useLanguage } from '../../../../context/language'
import './styles.css'

const AppBar: React.FC<AppBarProps> = ({ onDrawerOpen }) => {
	const language = useLanguage()

	return (
		<div className='drawer__navigation__app_bar'>
			<DinoIconButton
				ariaLabel={language.data.OPEN_DRAWER_BUTTON_ARIA_LABEL}
				icon={MenuIconSVG}
				onClick={onDrawerOpen}
				className='drawer__navigation__app_bar__button'
				lum="light"
			/>
			<ArrowBack lum="light" />
		</div>
	)
}

export default AppBar
