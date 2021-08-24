import React from 'react'
import { ReactComponent as DinoLogoSVG } from '../../assets/logos/dino_logo.svg'
import PetLogo from '../../assets/logos/pet.png'
import HCLogo from '../../assets/logos/hc.png'
import UFRGSLogo from '../../assets/logos/ufrgs.png'
import './styles.css'

const Load: React.FC = () => {
	return (
		<div className='load'>
			<div className='load__header'>
				<DinoLogoSVG className='load__dino_logo' title='DinoApp' />
			</div>
			<div className='load__team'>
				<img src={PetLogo} className='load__team__pet' alt='PET Computação' />
				<img
					src={HCLogo}
					className='load__team__hc'
					alt='Hospital de Clínicas de Porto Alegre'
				/>
				<img
					src={UFRGSLogo}
					className='load__team__ufrgs'
					alt='UFRGS - Universidade Federal do Rio Grande do Sul'
				/>
			</div>
		</div>
	)
}

export default Load
