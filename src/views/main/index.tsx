import React, { useState } from 'react'
import AuthService from '../../services/auth/AuthService'
import FirstSettings from '../../components/settings/first_settings'
import DinoLoader from '../../components/loader/index'
import DrawerNavigation from '../../components/drawer_navigation'
import LogoutDialog from '../../components/dialogs/logout_dialog'
import { useLanguage } from '../../context/language/index'
import { HasStaffPowers } from '../../context/private_router'
import MenuService from '../../services/menu/MenuService'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import LanguageBase from '../../constants/languages/LanguageBase'
import { toggle } from '../../constants/toggle/Toggle'

type getGroupedItemsType = (
	language: LanguageBase,
	handleLogoutClick: () => void,
) => MenuItemViewModel[][]

const Main: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const language = useLanguage()

	const hasStaffPowers = HasStaffPowers()

	const getGroupedItems = (): MenuItemViewModel[][] => {
		const searchGroupedItems = (getItems: getGroupedItemsType) =>
			getItems(language.data, handleLogoutClick)

		const getGroupedMenuByPermission = () => {
			return hasStaffPowers
				? MenuService.getStaffGroupedMenuItems
				: MenuService.getGroupedMenuItems
		}

		return searchGroupedItems(getGroupedMenuByPermission())
	}

	const [openLogoutDialog, setOpenLogoutDialog] = useState(false)

	const handleLogoutClick = () => setOpenLogoutDialog(true)

	const handleLogoutAgree = () => AuthService.logout()

	const handleLogoutDisagree = () => setOpenLogoutDialog(false)

	return (
		<DinoLoader isLoading={language.loading} hideChildren>
			<DrawerNavigation groupedItems={getGroupedItems()} component={children} />
			<LogoutDialog
				onAgree={handleLogoutAgree}
				onDisagree={handleLogoutDisagree}
				open={openLogoutDialog}
			/>
			{toggle.showFirstLoginDialog && <FirstSettings />}
		</DinoLoader>
	)
}

export default Main
