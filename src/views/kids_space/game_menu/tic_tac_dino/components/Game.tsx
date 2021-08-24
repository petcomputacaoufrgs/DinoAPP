import React, { useState, useEffect } from 'react'
import TicTacBoard from './Board'
import { calculateWinner } from '../helper'
import { useLanguage } from '../../../../../context/language'

interface GameProps {
	onEndGame: (winner: string | null) => void
	gameStarted: boolean
}

const Game: React.FC<GameProps> = ({ onEndGame, gameStarted }) => {
	const language = useLanguage()
	const [history, setHistory] = useState([Array(9).fill(null)])
	const [stepNumber, setStepNumber] = useState(0)
	const [xIsNext, setXisNext] = useState(true)
	const winner = calculateWinner(history[stepNumber])
	const player = xIsNext ? 'Queridino' : 'Amigossauro'

	const handleClick = (i: number) => {
		const historyPoint = history.slice(0, stepNumber + 1)
		const current = historyPoint[stepNumber]
		const squares = [...current]

		// return if won or occupied
		if (winner || squares[i]) return
		// select square
		squares[i] = player
		setHistory([...historyPoint, squares])
		setStepNumber(historyPoint.length)
		setXisNext(!xIsNext)
	}

	useEffect(() => {
		const handleEndGame = () => {
			setStepNumber(0)
			onEndGame(winner)
		}

		if (winner && gameStarted) {
			handleEndGame()
		}
	}, [gameStarted, winner, onEndGame])

	useEffect(() => {
		if (gameStarted) {
			setHistory([Array(9).fill(null)])
			setStepNumber(0)
			setXisNext(true)
		}
	}, [gameStarted])

	useEffect(() => {
		const handleEndGame = () => {
			setStepNumber(0)
			onEndGame(winner)
		}

		if (stepNumber === 9 && gameStarted) {
			handleEndGame()
		}
	}, [stepNumber, gameStarted, winner, onEndGame])

	return (
		<>
			<TicTacBoard squares={history[stepNumber]} onClick={handleClick} />
			<div className='tic_tac_dino_game__display'>
				{winner
					? language.data.WINNER + winner
					: language.data.NEXT_PLAYER + player}
			</div>
		</>
	)
}
export default Game
