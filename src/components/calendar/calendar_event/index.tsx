import React from 'react'
import { CalendarEventView } from '../../../types/calendar/view/CalendarView'
import './styles.css'

const CalendarEvent: React.FC<{
	item: CalendarEventView
	onClick: (item: CalendarEventView) => void
}> = ({ item, onClick }) => {
	return (
		<div
			style={{ backgroundColor: item.color }}
			className='event_wrapper'
			onClick={() => onClick(item)}
		>
			<p className='event_title'>{item.event.title}</p>
			<p className='event_time'>{item.event.time}</p>
		</div>
	)
}

export default CalendarEvent
