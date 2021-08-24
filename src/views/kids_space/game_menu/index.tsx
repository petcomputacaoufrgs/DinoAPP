import React from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import GameCard from '../../../components/game_card'
import './styles.css'
import { useLanguage } from '../../../context/language'
import ArrowBack from '../../../components/arrow_back'


const GameMenu: React.FC = () => {

	const language = useLanguage()

	return (
		<>
			<div className="game_menu_arrow_back">
				<ArrowBack kids onClick={() => HistoryService.push(PathConstants.KIDS_SPACE)} />
			</div>
			<div className='game_menu'>
				<GameCard
					onClick={() => HistoryService.push(PathConstants.DINO_RUNNER_GAME)}
					text={language.data.DINO_RUNNER_GAME}
					backgroundColor={'#e34d53'}
				/>
				<GameCard
					onClick={() => HistoryService.push(PathConstants.MEMORY_GAME)}
					text={language.data.MEMORY_GAME}
					backgroundColor={'#f0994d'}
				/>
				<GameCard
					onClick={() => HistoryService.push(PathConstants.DINO_SLIDER_GAME)}
					text={language.data.DINO_SLIDER_GAME}
					backgroundColor={'#e5d66e'}
				/>
				<GameCard
					onClick={() => HistoryService.push(PathConstants.SNAKE_GAME)}
					text={language.data.SNAKE_GAME}
					backgroundColor={'#45a764'}
				/>
				<GameCard
					onClick={() => HistoryService.push(PathConstants.MUSICAL_DINO_GAME)}
					text={language.data.MUSICAL_DINO_GAME}
					backgroundColor={'#4b75c3'}
					/>
				<GameCard
					onClick={() => HistoryService.push(PathConstants.TIC_TAC_DINO_GAME)}
					text={language.data.TIC_TAC_DINO_GAME}
					backgroundColor={'#97618b'}
				/>
			</div>
		</>
	)
}

export default GameMenu
