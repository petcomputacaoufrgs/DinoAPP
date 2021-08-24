import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import { ReactComponent as OutsideSVG } from '../../../assets/kids_space/background/outside.svg'
import { ReactComponent as InsideSVG } from '../../../assets/kids_space/background/inside.svg'
import { startCloudEngine } from './engine/clouds'
import ArrowBack from '../../../components/arrow_back'
import DinoEnum from '../../../types/enum/DinoEnum'
import DinogotchiInterior from './dinogotchi_interior'
import './styles.css'

const Dinogotchi: React.FC = () => {
	const [background, setBackground] = useState(DinoEnum.INSIDE)

	useEffect(() => {
		startCloudEngine()
	}, [])

	const renderBackground = (): JSX.Element => {
		const currentHour = new Date().getHours()
		return background === DinoEnum.OUTSIDE 
		? renderOusideBackground(currentHour)
		: renderInsideBackground(currentHour)
	}

	const renderInsideBackground = (currentHour: number): JSX.Element => {
		if (currentHour > 19) {
			return <InsideSVG className='dinogotchi_screen__background night' />
		}
		return <InsideSVG className='dinogotchi_screen__background day' />
	}

	const renderOusideBackground = (currentHour: number): JSX.Element => {
		if (currentHour > 19) {
			return <OutsideSVG className='dinogotchi_screen__background night' />
		}
		return <OutsideSVG className='dinogotchi_screen__background day' />
	}

	const changeBackground = () => {
		setBackground(background === DinoEnum.INSIDE ? DinoEnum.OUTSIDE : DinoEnum.INSIDE)
	}

	return (
		<div className={`dinogotchi_screen ${background === DinoEnum.OUTSIDE ? 'outside' : 'inside'}`}>
			{renderBackground()}
			<DinogotchiInterior handleBackgroundChange={changeBackground}/>
			{/* <AccessDialog 
				open={open} 
				icon={AngryDinoSVG} 
				onClose={() => setOpen(false)} 
				onConfirm = {() => HistoryService.push(PathConstants.HOME)} 
			/> */}
			<ArrowBack kids onClick={() => HistoryService.push(PathConstants.USER_HOME)} />
		</div>
	)
}

export default Dinogotchi
