import React, { useState, useEffect } from 'react'
import DrawerProps from './props'
import { Divider } from '@material-ui/core'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { Avatar } from '@material-ui/core'
import DinoIconButton from '../../button/icon_button'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DinoLoader from '../../loader'
import { useLanguage } from '../../../context/language'
import UserEntity from '../../../types/user/database/UserEntity'
import UserService from '../../../services/user/UserService'
import SyncInfo from '../../sync_info'
import './styles.css'

const Drawer: React.FC<DrawerProps> = ({ open, groupedItems, onClose }) => {
	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [user, setUser] = useState<UserEntity | undefined>()

	useEffect(() => {
		const loadData = async () => {
			const user = await UserService.getFirst()

			if (user) {
				updateData(user)
			}

			finishLoading()
		}

		let updateData = (user: UserEntity) => {
			setUser(user)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			UserService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleClick = (item: MenuItemViewModel) => {
		onClose()
		item.onClick()
	}

	const handleCloseClick = () => {
		onClose()
	}

	const isLastGroup = (groupIndex: number): boolean =>
		groupedItems.length - 1 === groupIndex

	const renderItems = (items: MenuItemViewModel[]): JSX.Element[] => {
		return items
			.filter(item => item.image)
			.map((item, itemIndex) => (
				<ListItem
					button
					aria-label={language.data.CLICK_TO_OPEN_MENU_ITEM + item.name}
					key={itemIndex}
					onClick={() => handleClick(item)}
				>
					<ListItemIcon>{renderItemImage(item.image!)}</ListItemIcon>
					<ListItemText primary={item.name} />
				</ListItem>
			))
	}

	const renderItemImage = (
		image: React.FunctionComponent<
			React.SVGProps<SVGSVGElement> & {
				title?: string | undefined
			}
		>,
	) => {
		const Image = image

		return <Image className='drawer_navigation__drawer__visible__menu__icon' />
	}

	const renderUser = (): JSX.Element => (
		<div className='user'>
			<div className='user__avatar'>
				<DinoLoader className='user__avatar__loader' isLoading={isLoading}>
					<Avatar
						src={UserService.getPicture(user)}
						alt={language.data.AVATAR_ALT}
						className='avatar'
					/>
					<SyncInfo className='user__avatar__sync_info' />
				</DinoLoader>
			</div>
			<p className='username'>{UserService.getName(user)}</p>
		</div>
	)

	const renderGroupItems = (): JSX.Element[] =>
		groupedItems.map((items, groupIndex) => (
			<div key={groupIndex}>
				<List>{renderItems(items)}</List>
				{!isLastGroup(groupIndex) && <Divider />}
			</div>
		))

	return (
		<>
			<div className='drawer_navigation__drawer'>
				<div className='drawer_navigation__drawer__visible'>
					<div className='drawer_navigation__drawer__header'>
						<DinoIconButton
							ariaLabel={language.data.CLOSE_MENU_BUTTON_ARIA_LABEL}
							icon={ChevronLeftIcon}
							onClick={handleCloseClick}
							bigger
							lum='light'
						/>
					</div>
					<Divider />
					<div className='drawer_navigation__drawer__content'>
						{renderUser()}
						{renderGroupItems()}
					</div>
				</div>
			</div>
			{open && (
				<button
					className='drawer_navigation__drawer__invisible'
					onClick={handleCloseClick}
					aria-label={language.data.CLOSE_MENU_ARIA_LABEL}
				/>
			)}
		</>
	)
}

export default Drawer
