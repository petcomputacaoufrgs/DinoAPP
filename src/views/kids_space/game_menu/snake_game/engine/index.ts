import {
	renderSnake,
	outsideGrid,
	snakeOverItself,
	updateSnake,
	resetSnake,
} from './snake'
import { updateFood, renderFood, score, resetFood } from './food'
import { resetInput } from './input'

//#region Constants
//HTML Elements
let gameBoard: HTMLElement | null
let scoreBoard: HTMLElement | null

//General attirbutes
let gameOver = false
let firstRender = true

//Snake
let snakeSpeed = 400

//External function
let onGameOver: () => void

//#endregion

//#region Functions
/**
 * @description Initialize the game
 * @param handleGameOver Callback for game over event
 */
export function starGame(handleGameOver: () => void) {
	resetInput()
	resetFood()
	resetSnake(snakeSpeed)
	removeSnakeFromBoard()
	removeFoodFromBoard()
	setDefaultVars(handleGameOver)
	setTimeout(main, snakeSpeed)
}

/**
 * @description Set default variables values
 * @param handleGameOver Callback for game over event
 */
function setDefaultVars(handleGameOver: () => void) {
	firstRender = true
	gameOver = false
	onGameOver = handleGameOver
	gameBoard = document.getElementById('snake_game__game_board')
	scoreBoard = document.getElementById('snake_game__score_board')
}

/**
 * @description main function of the game; organizes and set everything needded
 * @param currentTime actual time
 */
function main() {
	// Verify if is a game over scenario
	if (gameOver) {
		onGameOver()
		return
	}

	setTimeout(main, snakeSpeed)

	// Update and render the game
	const [snakeChanged, foodChanged] = update()
	render(snakeChanged, foodChanged)

	if (firstRender) firstRender = false
}

/**
 * @description update the food and the snake if necessary
 */
function update() {
	const snakeChanged = updateSnake(snakeSpeed)
	const foodChanged = updateFood()
	checkDeath()

	return [snakeChanged, foodChanged]
}

/**
 * @description render the snake, the food and the current score
 * @param snakeChanged true if snake position has been changed
 * @param foodChanged true if food position has been changed
 */
function render(snakeChanged: boolean, foodChanged: boolean) {
	if (gameOver) return

	scoreBoard!.innerHTML = `<p>${score}</p>`

	if (snakeChanged) removeSnakeFromBoard()
	if (foodChanged) removeFoodFromBoard()
	if (snakeChanged || firstRender) renderSnake(gameBoard!)
	if (foodChanged || firstRender) renderFood(gameBoard!)
}

/**
 * @description verify if some condition of game over was reached
 */
function checkDeath() {
	gameOver = outsideGrid() || snakeOverItself()
}

/**
 * @description remove entire snake from board
 */
function removeSnakeFromBoard() {
	removeBoardElementByClassName('snake_game__snake')
}

/**
 * @description remove food from board
 */
function removeFoodFromBoard() {
	removeBoardElementByClassName('snake_game__food')
}

/**
 * @description Remove all elements on board by className
 * @param className className of itens to remove
 */
function removeBoardElementByClassName(className: string) {
	if (gameBoard) {
		const elements = gameBoard.getElementsByClassName(className)
		Array.from(elements).forEach(e => e.remove())
	}
}
//#endregion
