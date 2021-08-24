/* --> Imports <-- */
import { getInputDirection } from './input'

import HEAD_UP from '../../../../../assets/kids_space/games/snake/head_up.png'
import HEAD_DOWN from '../../../../../assets/kids_space/games/snake/head_down.png'
import HEAD_LEFT from '../../../../../assets/kids_space/games/snake/head_left.png'
import HEAD_RIGHT from '../../../../../assets/kids_space/games/snake/head_right.png'
import BODY_H from '../../../../../assets/kids_space/games/snake/body_h.png'
import BODY_V from '../../../../../assets/kids_space/games/snake/body_v.png'
import CURVE_DL from '../../../../../assets/kids_space/games/snake/curve_dl.png'
import CURVE_DR from '../../../../../assets/kids_space/games/snake/curve_dr.png'
import CURVE_UL from '../../../../../assets/kids_space/games/snake/curve_ul.png'
import CURVE_UR from '../../../../../assets/kids_space/games/snake/curve_ur.png'
import RABA_UP from '../../../../../assets/kids_space/games/snake/raba_up.png'
import RABA_DOWN from '../../../../../assets/kids_space/games/snake/raba_down.png'
import RABA_LEFT from '../../../../../assets/kids_space/games/snake/raba_left.png'
import RABA_RIGHT from '../../../../../assets/kids_space/games/snake/raba_right.png'

type CoordinatePosition = {
	x: number
	y: number
}

type CoordinatePositionWithDirection = {
	x: number
	y: number
	d: string
}

//#region Constants
// Board
const GRID_SIZE = 21

// Snake
const snakeBody: CoordinatePosition[] = []
let grow = false
let started = false

startSnakeBody(snakeBody)
//#endregion

//#region Functions

/**
 * @description set default values of snake's body
 * @param snakeBody empty snake's body
 */
function startSnakeBody(snakeBody: CoordinatePosition[]) {
	snakeBody.push({ x: 11, y: 11 })
	snakeBody.push({ x: 11, y: 12 })
}

/**
 * @description clear snake's body and return it to the default values
 */
export function resetSnake(snakeSpeed: number) {
	snakeBody.splice(0, snakeBody.length)
	startSnakeBody(snakeBody)
	started = false
	snakeSpeed = 300
}

/**
 * @description update the snake vector with the new segment position at each time interval
 * @param speed of the snake
 * @returns true if snake's position has been changed otherwise false
 */
export function updateSnake(snakeSpeed: number) {
	if (grow) {
		addSegments()
		if (snakeSpeed > 130) snakeSpeed -= 10 //increase speed as the snake gets bigger
	}
	// Get the head direction (changed by the user)
	const inputDirection = getInputDirection()

	verifyGameState(inputDirection)

	const ignoredSegments = started ? 2 : 3

	// Update the array -> the current segment gets the position of the previous segment
	for (let i = snakeBody.length - ignoredSegments; i >= 0; i--) {
		snakeBody[i + 1] = { ...snakeBody[i] }
	}

	// Update the head position
	snakeBody[0].x += inputDirection.x
	snakeBody[0].y += inputDirection.y

	return inputDirection.d !== 'N'
}

/**
 * @description verify when game has been started
 */
function verifyGameState(inputDirection: CoordinatePositionWithDirection) {
	if (!started) {
		const hasInputDirection = !(
			inputDirection.x === 0 && inputDirection.y === 0
		)
		if (hasInputDirection) {
			started = true
		}
	}
}

/**
 * @description render the snake array on the board
 * @param gameBoard div where the game renders
 */
export function renderSnake(gameBoard: HTMLElement) {
	// Render each segment
	snakeBody.forEach((segment, index) => {
		const snakePiece = document.createElement('IMG')

		// Get the correct sprite according the segment position
		const image = getCorrectImage(index)

		// Set all attributes
		snakePiece.setAttribute('src', image)
		snakePiece.style.gridRowStart = segment.y.toString()
		snakePiece.style.gridColumnStart = segment.x.toString()
		snakePiece.classList.add('snake_game__snake')

		// Append the segment to the board
		gameBoard.appendChild(snakePiece)
	})
}

/**
 * @description verify if the food was ate
 * @param position the position of the current food
 * @returns true if food was ate or false if food is still there
 */
export function foodAte(position: CoordinatePosition) {
	return snakeBody[0].x === position.x && snakeBody[0].y === position.y
}

/**
 * @description verify if some position is in the same position as some part of the snake body
 * @param position the position that will be tested
 * @param ignoreHead tells if is necessary to ignore the head (this function is used to verify if the snake is over itself)
 * @returns true if the position overlaps the snake or false if the postion don't overlap the snake
 */
export function onSnake(position: CoordinatePosition, ignoreHead = false) {
	return snakeBody.some((segment, index) => {
		if (ignoreHead && index === 0) {
			return false
		} else {
			return segment.x === position.x && segment.y === position.y
		}
	})
}

/**
 * @description set the boolean grow to true
 */
export function growSnake() {
	grow = true
}

/**
 * @description add a new segment on the snake array and sets the boolean grow to false
 */
export function addSegments() {
	snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
	grow = false
}

/**
 * @description verify if the snake is outside of the board grid
 * @returns true if the snake is outside the grid or false if the snake is inside the grid
 */
export function outsideGrid() {
	return (
		snakeBody[0].x < 1 ||
		snakeBody[0].x > GRID_SIZE ||
		snakeBody[0].y < 1 ||
		snakeBody[0].y > GRID_SIZE
	)
}

/**
 * @description verify if the head colided with some part of the snake
 * @returns true if the snake colided with itself or false if the snake don't colided
 */
export function snakeOverItself() {
	return onSnake(snakeBody[0], true)
}

/**
 * @description get the correct asset based on the position of the current and adjacent segments
 * @param index index of the segment on the array
 * @returns directory of the image needed
 */
function getCorrectImage(index: number) {
	const inputDirection = getInputDirection()

	const isHead = index === 0
	if (isHead) {
		switch (inputDirection.d) {
			case 'D':
				return HEAD_DOWN
			case 'L':
				return HEAD_LEFT
			case 'R':
				return HEAD_RIGHT
			default:
				return HEAD_UP
		}
	}

	const isTail = index === snakeBody.length - 1
	if (isTail) {
		if (snakeBody[index - 1].x > snakeBody[index].x) {
			return RABA_LEFT
		} else if (snakeBody[index - 1].x < snakeBody[index].x) {
			return RABA_RIGHT
		} else if (snakeBody[index - 1].y > snakeBody[index].y) {
			return RABA_UP
		} else {
			return RABA_DOWN
		}
	}

	// Segment is in the between

	// Straight piece
	if (
		snakeBody[index - 1].x === snakeBody[index].x &&
		snakeBody[index].x === snakeBody[index + 1].x
	) {
		return BODY_V
	}

	if (
		snakeBody[index - 1].y === snakeBody[index].y &&
		snakeBody[index].y === snakeBody[index + 1].y
	) {
		return BODY_H
	}

	// Curved piece
	if (
		(snakeBody[index - 1].y === snakeBody[index].y &&
			snakeBody[index - 1].x === snakeBody[index].x - 1 &&
			snakeBody[index].x === snakeBody[index + 1].x &&
			snakeBody[index].y === snakeBody[index + 1].y - 1) ||
		(snakeBody[index - 1].x === snakeBody[index].x &&
			snakeBody[index].y === snakeBody[index - 1].y - 1 &&
			snakeBody[index].y === snakeBody[index + 1].y &&
			snakeBody[index + 1].x === snakeBody[index].x - 1)
	) {
		return CURVE_DL
	}

	if (
		(snakeBody[index - 1].x === snakeBody[index].x &&
			snakeBody[index - 1].y === snakeBody[index].y + 1 &&
			snakeBody[index].y === snakeBody[index + 1].y &&
			snakeBody[index].x === snakeBody[index + 1].x - 1) ||
		(snakeBody[index - 1].y === snakeBody[index].y &&
			snakeBody[index].x === snakeBody[index - 1].x - 1 &&
			snakeBody[index].x === snakeBody[index + 1].x &&
			snakeBody[index + 1].y === snakeBody[index].y + 1)
	) {
		return CURVE_DR
	}

	if (
		snakeBody[index - 1].x === snakeBody[index].x - 1 ||
		snakeBody[index + 1].x === snakeBody[index].x - 1
	) {
		return CURVE_UL
	}

	return CURVE_UR
}

//#endregion
