import React from 'react'
import MenuService from '../../../services/menu/MenuService'
import IconButton from '../../../components/button/icon_button'
import { useLanguage } from '../../../context/language'
import Button from '../../../components/button'
import './styles.css'
import LanguageBase from '../../../constants/languages/LanguageBase'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { IsStaff } from '../../../context/private_router'

const Home: React.FC = () => {

	const staff = IsStaff()
	const language = useLanguage()

	const searchMainPages = (getMainPages: (language: LanguageBase) => MenuItemViewModel[]) => {
		return getMainPages(language.data).filter(
			item => item.name !== language.data.MENU_HOME,
		)
	}

	const items = searchMainPages(staff ? MenuService.getStaffMainPages : MenuService.getMainPages)

	return (
		<div className='home'>
			<div className='home__grid'>
				{items
					.filter(item => item.image)
					.map((item, index) => (
						<div className='home__grid__item' key={index}>
							<IconButton
								icon={item.image!}
								className='home__grid__button'
								onClick={item.onClick}
							/>
							<p className='home__grid__item__name'>{item.name}</p>
						</div>
					))}
			</div>
			<div className='info__grid'>
				{items
					.filter(item => !item.image)
					.map((item, index) => (
						<Button
							key={index}
							className='info__grid__item'
							onClick={item.onClick}
						>
							<p>{item.name}</p>
						</Button>
					))}
			</div>
		</div>
	)
}

export default Home
