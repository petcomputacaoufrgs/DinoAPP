import React from 'react'
import PetLogo from '../../assets/logos/pet.png'
import HCLogo from '../../assets/logos/hc.png'
import UfrgsLogo from '../../assets/logos/ufrgs.png'
import Section from './section'
import DinoLogoHeader from '../../components/dino_logo_header'
import ArrowBack from '../../components/arrow_back'
import './styles.css'
import { useLanguage } from '../../context/language'

const AboutUs: React.FC = () => {

	const language = useLanguage()

	const sections = [
		{
			title: language.data.ABOUT_US_PET,
			img: PetLogo,
			text: language.data.ABOUT_US_PET_TEXT
		},
		{ title: language.data.ABOUT_US_HCPA, img: HCLogo, text: language.data.ABOUT_US_HCPA_TEXT },
		{ title: language.data.ABOUT_US_UFRGS, img: UfrgsLogo, text: language.data.ABOUT_US_UFRGS_TEXT },
	]

	return (
		<div className='about_us'>
			<ArrowBack />
			<div className='card__header'>
				<DinoLogoHeader title={language.data.ABOUT_US} />
			</div>
			<div className='card__content'>
				<div className='card__typography'>
					{sections.map((section, index) => (
						<Section
							title={`${section.title}`}
							ImgSrc={section.img}
							text={section.text}
							key={index}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default AboutUs
