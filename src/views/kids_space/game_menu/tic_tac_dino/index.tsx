import React, { useState } from "react"
import { useLanguage } from "../../../../context/language"
import HistoryService from "../../../../services/history/HistoryService"
import PathConstants from "../../../../constants/app/PathConstants"
import GameOverDialog from "../../../../components/dialogs/kids_space_dialog/game_over_dialog"
import Game from './components/Game'
import '../../variables.css'
import './styles.css'

import ArrowBack from "../../../../components/arrow_back"

const TicTacDino: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)
	const [gameStarted, setGameStarted] = useState(true)
	const [message, setMessage] = useState('')

	function handleClose() {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	function handleRestart() {
		setOpenDialog(false)
		setGameStarted(true)
	}

	function handleEndGame(winner: string | null) {
		if (winner) {
			setMessage(`${language.data.TIC_TAC_DINO_GAME_OVER_MSG_1} ${winner}!`)
		} else {
			setMessage(language.data.TIE)
		}
		setOpenDialog(true)
		setGameStarted(false)
	}

	return (
		<div className='minigame tic_tac_dino_game'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{message}</p>
			</GameOverDialog>
			<ArrowBack kids />
			<Game onEndGame={handleEndGame} gameStarted={gameStarted} />
		</div>
	)
}
export default TicTacDino
