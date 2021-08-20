import React from 'react'
import { useLanguage } from '../../../context/language'
import { CalendarEventView } from '../../../types/calendar/view/CalendarView'
import CalendarEvent from '../calendar_event'
import './styles.css'

const CalendarDay: React.FC<{
	dayOfWeek: string
	dayOfMonth: string
	events: CalendarEventView[]
	onClick: (item: CalendarEventView) => void
}> = props => {
	const language = useLanguage()

	return (
		<div className='day_wrapper dino__flex_row'>
			<div className='day_number_wrapper'>
				<p className='week_day'>{props.dayOfWeek}</p>
				<p className='month_day'>
					{props.dayOfMonth.length === 1
						? '0' + props.dayOfMonth
						: props.dayOfMonth}
				</p>
			</div>
			<div className='day_event_list_wrapper'>
				{props.events.length === 0 ? (
					<div className='empty_event_list'>
						<p>{language.data.EMPTY_EVENT_LIST}</p>
					</div>
				) : (
					props.events.map((e, index) => (
						<div key={index} className='day_event_wrapper'>
							<CalendarEvent item={e} onClick={props.onClick} />
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default CalendarDay
