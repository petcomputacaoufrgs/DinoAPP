import React from 'react'
import SectionProps from './props'
import './styles.css'

const Section = ({
	title,
	ImgSrc,
	text
}: SectionProps): JSX.Element => {
	return (
		<div className='section'>
			<h4 className='section__title'>{title}</h4>
			<div className='section__text'>
				{text}
				<img
					className='section__image'
					src={ImgSrc}
					alt={`Logo ${title}`}
					width='80%'
					height='80%'
				></img>
			</div>
		</div>
	)
}

export default Section
