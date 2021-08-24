import React from 'react'

interface BoardProps {
	squares: number[]
	onClick: (index: number) => void
}

const TicTacBoard: React.FC<BoardProps> = ({ squares, onClick }) => (
	<div className='tic_tac__board'>
		{squares.map((square, i) =>
			<button 
				className={`tic_tac_dino__square ${square || ''}`} 
				onClick={() => onClick(i)} 
			/>
		)}
	</div>
)

export default TicTacBoard
