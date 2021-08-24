import React from 'react'
import { ReactComponent as DinoLogo } from '../../assets/logos/dino_logo.svg'
import DinoHr from '../../components/dino_hr'
import DinoLogoHeaderProps from './props'
import './styles.css'

const DinoLogoHeader = ({
	title,
	subtitle,
	size,
}: DinoLogoHeaderProps): JSX.Element => {
	return (
		<div className='dino_header'>
			<DinoLogo className='header__image' />
			{size === 'small' ? (
				<h5 className='header__title'>{title}</h5>
			) : (
				<h3 className='header__title'>{title}</h3>
			)}
			{subtitle ? <div className='typography muted'>{subtitle}</div> : <></>}
			<DinoHr />
		</div>
	)
}
export default DinoLogoHeader
