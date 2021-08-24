import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import { ReactComponent as GlossarySVG } from '../../assets/icons/menu_icons/glossary.svg'
import { ReactComponent as ContactsSVG } from '../../assets/icons/menu_icons/contact.svg'
import { ReactComponent as HomeSVG } from '../../assets/icons/menu_icons/home.svg'
import { ReactComponent as NotesSVG } from '../../assets/icons/menu_icons/note.svg'
import { ReactComponent as FaqSVG } from '../../assets/icons/menu_icons/faq.svg'
import { ReactComponent as SettingsSVG } from '../../assets/icons/menu_icons/settings.svg'
import { ReactComponent as LogoutSVG } from '../../assets/icons/menu_icons/logout.svg'
import { ReactComponent as CalendarSVG } from '../../assets/icons/menu_icons/calendar.svg'
import { ReactComponent as KidsSpaceSVG } from '../../assets/icons/menu_icons/kids_area.svg'
import { ReactComponent as ModerationSVG } from '../../assets/icons/menu_icons/moderation.svg'
import { ReactComponent as TreatmentSVG } from '../../assets/icons/menu_icons/treatments.svg'

import LanguageBase from '../../constants/languages/LanguageBase'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'

class MenuService {
	getMainPages = (language: LanguageBase): MenuItemViewModel[] => [
		{
			image: HomeSVG,
			name: language.HOME,
			onClick: () => HistoryService.push(PathConstants.USER_HOME),
		},
		{
			image: GlossarySVG,
			name: language.GLOSSARY,
			onClick: () => HistoryService.push(PathConstants.USER_GLOSSARY),
		},
		{
			image: ContactsSVG,
			name: language.MENU_CONTACTS,
			onClick: () => HistoryService.push(PathConstants.USER_CONTACTS),
		},
		{
			image: NotesSVG,
			name: language.NOTES,
			onClick: () => HistoryService.push(PathConstants.USER_NOTES),
		},
		{
			image: FaqSVG,
			name: language.FAQ,
			onClick: () => HistoryService.push(PathConstants.USER_FAQ),
		},
		{
			image: CalendarSVG,
			name: language.MENU_CALENDAR,
			onClick: () => HistoryService.push(PathConstants.USER_SETTINGS),
		},
		{
			image: SettingsSVG,
			name: language.MENU_SETTINGS,
			onClick: () => HistoryService.push(PathConstants.USER_SETTINGS),
		},
		{
			image: KidsSpaceSVG,
			name: language.KIDS_SPACE,
			onClick: () => HistoryService.push(PathConstants.KIDS_SPACE),
		},
		{
			name: language.ABOUT_US,
			onClick: () => HistoryService.push(PathConstants.ABOUT_US),
		},
		{
			name: language.PRIVACY_POLICY,
			onClick: () => HistoryService.push(PathConstants.PRIVACY_POLICY),
		},
		{
			name: language.TERMS_OF_USE,
			onClick: () => HistoryService.push(PathConstants.TERMS_OF_USE),
		},
	]

	getStaffMainPages = (language: LanguageBase): MenuItemViewModel[] => [
		{
			image: HomeSVG,
			name: language.HOME,
			onClick: () => HistoryService.push(PathConstants.STAFF_HOME),
		},
		{
			image: GlossarySVG,
			name: language.GLOSSARY,
			onClick: () => HistoryService.push(PathConstants.STAFF_GLOSSARY),
		},
		{
			image: ContactsSVG,
			name: language.MENU_CONTACTS,
			onClick: () => HistoryService.push(PathConstants.STAFF_CONTACTS),
		},
		{
			image: SettingsSVG,
			name: language.MENU_SETTINGS,
			onClick: () => HistoryService.push(PathConstants.STAFF_SETTINGS),
		},
		{
			image: TreatmentSVG,
			name: language.TREATMENTS,
			onClick: () => HistoryService.push(PathConstants.TREATMENT),
		},
		{
			image: ModerationSVG,
			name: language.MENU_STAFF_MODERATION,
			onClick: () => HistoryService.push(PathConstants.STAFF_MODERATION),
		},
		{
			name: language.ABOUT_US,
			onClick: () => HistoryService.push(PathConstants.ABOUT_US),
		},
		{
			name: language.PRIVACY_POLICY,
			onClick: () => HistoryService.push(PathConstants.PRIVACY_POLICY),
		},
		{
			name: language.TERMS_OF_USE,
			onClick: () => HistoryService.push(PathConstants.TERMS_OF_USE),
		},
	]

	getGroupedMenuItems = (
		language: LanguageBase,
		handleLogoutClick: () => void,
	): MenuItemViewModel[][] => [
		this.getMainPages(language),
		[
			{
				image: SettingsSVG,
				name: language.REPORT_BUG,
				onClick: () => HistoryService.push(PathConstants.USER_REPORT_BUG),
			},
			{
				image: LogoutSVG,
				name: language.MENU_LOGOUT,
				onClick: handleLogoutClick,
			},
		],
	]

	getStaffGroupedMenuItems = (
		language: LanguageBase,
		handleLogoutClick: () => void,
	): MenuItemViewModel[][] => [
		this.getStaffMainPages(language),
		[
			{
				image: SettingsSVG,
				name: language.REPORT_BUG,
				onClick: () => HistoryService.push(PathConstants.STAFF_REPORT_BUG),
			},
			{
				image: LogoutSVG,
				name: language.MENU_LOGOUT,
				onClick: handleLogoutClick,
			},
		],
	]
}

export default new MenuService()
