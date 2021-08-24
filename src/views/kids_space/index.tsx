import React from 'react'
import { Switch } from 'react-router'
import PrivateRoute from '../../components/private_route'
import PathConstants from '../../constants/app/PathConstants'
import NotFound from '../not_found'
import Dinogotchi from './dinogotchi'
import DinoRunner from './game_menu/dino_runner'
import Menu from './game_menu'
import SnakeGame from './game_menu/snake_game'
import MusicalDino from './game_menu/musical_dino'
import TicTacDino from './game_menu/tic_tac_dino'
import MemoryGame from './game_menu/memory_game'
import './variables.css'
import DinoSlider from './game_menu/dino_slider'

const KidsSpace: React.FC = () => {
	return (
		<Switch>
			<PrivateRoute
				exact
				path={PathConstants.KIDS_SPACE}
				component={Dinogotchi}
			/>
			<PrivateRoute 
				exact 
				path={PathConstants.GAME_MENU} 
				component={Menu} 
			/>
			<PrivateRoute
				exact
				path={PathConstants.MEMORY_GAME}
				component={MemoryGame}
			/>
			<PrivateRoute
				exact
				path={PathConstants.SNAKE_GAME}
				component={SnakeGame}
			/>
			<PrivateRoute
				exact
				path={PathConstants.TIC_TAC_DINO_GAME}
				component={TicTacDino}
			/>
			<PrivateRoute
				exact
				path={PathConstants.DINO_RUNNER_GAME}
				component={DinoRunner}
			/>
			<PrivateRoute
				exact
				path={PathConstants.MUSICAL_DINO_GAME}
				component={MusicalDino}
			/>
			<PrivateRoute
				exact
				path={PathConstants.DINO_SLIDER_GAME}
				component={DinoSlider}
			/>
			<PrivateRoute path={'/'} component={NotFound} />
		</Switch>
	)
}

export default KidsSpace
