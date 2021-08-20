import React, { useEffect, useState } from 'react'
import SelectDate from '../../../../components/calendar/select_date'
import SelectEventType from '../../../../components/calendar/select_event_type'
import SelectNotification from '../../../../components/calendar/select_notification'
import SelectRepeat from '../../../../components/calendar/select_repeat'
import SelectTime from '../../../../components/calendar/select_time'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import CalendarEventService from '../../../../services/calendar/CalendarEventService'
import CalendarEventTypeEntity from '../../../../types/calendar/database/CalendarEventTypeEntity'
import { CalendarEventView } from '../../../../types/calendar/view/CalendarView'
import StringUtils from '../../../../utils/StringUtils'
import EventDialogFormProps from './props'

const getEvent = (item?: CalendarEventView) =>
	item?.event || { title: '', description: '', date: '', time: '' }

const getType = (
	item?: CalendarEventView,
	eventTypes?: CalendarEventTypeEntity[],
) => {
	if (item) {
		const eventType = eventTypes?.find(
			t => t.localId === item?.event.typeLocalId,
		)
		return eventType
	}
	return undefined
}

export const EventDialogForm: React.FC<EventDialogFormProps> = props => {
	const language = useLanguage()

	const [event, setEvent] = useState(getEvent(props.item))
	const [type, setType] = useState<CalendarEventTypeEntity | undefined>(
		getType(props.item, props.eventTypes),
	)
	const [error, setError] = useState<string>()

	const handleChangeType = (index: number) => {
		if (props.eventTypes) {
			const newType = props.eventTypes[index]
			setType(newType)
		}
	}

	useEffect(() => {
		if (props.open) {
			setEvent(getEvent(props.item))
			setType(getType(props.item, props.eventTypes))
		}
	}, [props.open])

	const handleSave = async () => {
		if (StringUtils.isEmpty(event.title)) {
			return setError(language.data.EMPTY_FIELD_ERROR)
		}

		event.typeLocalId = type?.localId

		CalendarEventService.save(event)
		props.onClose()
	}

	return (
		<DinoDialog
			open={props.open}
			onClose={props.onClose}
			onSave={handleSave}
			header={
				<div
					className='calendar_dialog__header dino__flex_row'
					style={{ backgroundColor: type?.color }}
				>
					<div className='calendar_dialog__header_title'>
						{language.data.ADD_EVENT_TITLE}
					</div>
				</div>
			}
		>
			<div className='calendar_dialog__content'>
				<DinoTextfield
					label={language.data.TITLE}
					value={event.title}
					onChange={e => setEvent({ ...event, title: e.target.value })}
					dataProps={DataConstants.CALENDAR_EVENT_TITLE}
					errorMessage={error}
				/>
				<SelectEventType
					value={type}
					onClickOption={handleChangeType}
					eventTypes={props.eventTypes}
				/>
				<SelectDate />
				<div className='.container-fluid'>
					<div className='row'>
						<div className='col-6 left_block__selector'>
							<SelectTime timeLabel={language.data.EVENT_INIT_TIME_LABEL} />
						</div>
						<div className='col-6 right_block__selector'>
							<SelectTime timeLabel={language.data.EVENT_END_TIME_LABEL} />
						</div>
					</div>
				</div>
				<SelectRepeat />
				<SelectNotification />
				<DinoTextfield
					label={language.data.FORM_DESCRIPTION}
					value={event.description}
					onChange={e => setEvent({ ...event, description: e.target.value })}
					dataProps={DataConstants.CALENDAR_EVENT_DESCRIPTION}
				/>
			</div>
		</DinoDialog>
	)
}
