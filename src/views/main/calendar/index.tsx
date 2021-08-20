import React, { useEffect, useState } from 'react'
import AddButton from '../../../components/button/icon_button/add_button'
import { useLanguage } from '../../../context/language'
import MonthNavBar from '../../../components/calendar/month_nav_bar'
import CalendarEventEntity from '../../../types/calendar/database/CalendarEventEntity'
import StringUtils from '../../../utils/StringUtils'
import './styles.css'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import CalendarEventService from '../../../services/calendar/CalendarEventService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import CRUDEnum from '../../../types/enum/CRUDEnum'
import { EventDialogForm } from './event_dialog_form'
import { GoogleCalendarGrantDialog } from '../../../components/dialogs/google_grant_dialog'
import CalendarDay from '../../../components/calendar/calendar_day'
import CalendarSettings from '../../../components/calendar/calendar_settings'
import DinoTabPanel from '../../../components/tab_panel'
import CalendarEventTypeEntity from '../../../types/calendar/database/CalendarEventTypeEntity'
import {
	CalendarDayView,
	CalendarEventView,
} from '../../../types/calendar/view/CalendarView'
import CalendarEventTypeService from '../../../services/calendar/CalendarEventTypeService'

const Calendar: React.FC = () => {
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [dayViews, setDayViews] = useState<CalendarDayView[]>()
	const [eventTypes, setEventTypes] = useState<CalendarEventTypeEntity[]>()
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<CalendarEventView>()

	useEffect(() => {
		const loadUserData = async (): Promise<CalendarDayView[]> => {
			const syncGoogleCalendar = await GoogleScopeService.hasCalendarGrant()
			if (settings && !settings.declineGoogleCalendar) {
				if (!syncGoogleCalendar) setOpenGrantDialog(true)
			}
			const events = await CalendarEventService.getAll()
			const types = await CalendarEventTypeService.getAll()

			setEventTypes(types)

			const month = new Array<CalendarDayView>(31)
			for (let index = 0; index < 31; index++) {
				month[index] = { dayOfMonth: `${index + 1}`, events: [] }
			}

			events.forEach(e => {
				const type = types.find(t => t.localId === e.typeLocalId)

				const eventView: CalendarEventView = {
					event: e,
					color: type?.color,
					icon: type?.icon,
				}

				const index = Number(e.date) - 1
				const day = month[index]
				if (day) day.events.push(eventView)
			})

			return month
		}

		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			updateSettings(settings)

			const dayViews = await loadUserData()

			updateDayViews(dayViews)
			finishLoading()
		}

		CalendarEventService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		let updateDayViews = (dayViews: CalendarDayView[]) => {
			setDayViews(dayViews)
		}

		let updateSettings = (settings: UserSettingsEntity | undefined) => {
			setSettings(settings)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateDayViews = () => {}
			updateSettings = () => {}
			finishLoading = () => {}
			CalendarEventService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleClose = () => {
		setToAction(CRUDEnum.NOP)
		setSelectedItem(undefined)
	}

	const handleClick = (item: CalendarEventView) => {
		setSelectedItem(item)
		setToAction(CRUDEnum.READ)
	}

	const renderCalendar = () => {
		return (
			<div className='calendar'>
				<MonthNavBar />
				{dayViews?.map((e, index) => (
					<CalendarDay
						key={index}
						dayOfMonth={e.dayOfMonth}
						dayOfWeek={language.data.MONDAY_ABREVIATION}
						events={e.events}
						onClick={handleClick}
					/>
				))}
				<AddButton
					label={language.data.EVENT}
					handleAdd={() => setToAction(CRUDEnum.CREATE)}
				/>
				<EventDialogForm
					open={toAction === CRUDEnum.CREATE || toAction === CRUDEnum.UPDATE}
					onClose={handleClose}
					item={selectedItem}
					eventTypes={eventTypes}
				/>
				<GoogleCalendarGrantDialog
					open={openGrantDialog}
					onClose={() => setOpenGrantDialog(false)}
				/>
			</div>
		)
	}

	return (
		<DinoTabPanel
			panels={[
				{ Label: language.data.MENU_CALENDAR, Component: renderCalendar() },
				{
					Label: language.data.MENU_SETTINGS,
					Component: <CalendarSettings eventTypes={eventTypes} />,
				},
			]}
		/>
	)
}

export default Calendar
