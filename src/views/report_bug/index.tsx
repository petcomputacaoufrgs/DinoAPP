import React, { useEffect, useState } from 'react'
import { SaveButton } from '../../components/button/save_button'
import DinoHr from '../../components/dino_hr'
import { DinoTextfield } from '../../components/textfield'
import DataConstants from '../../constants/app_data/DataConstants'
import { useAlert } from '../../context/alert'
import { useLanguage } from '../../context/language'
import ReportService from '../../services/report/ReportService'
import UserService from '../../services/user/UserService'
import ReportEntity from '../../types/report/database/ReportEntity'
import StringUtils from '../../utils/StringUtils'
import './styles.css'

const getDefault = () => {
	return {
		what: '',
		where: '',
		how: '',
		userLocalId: undefined,
	} as ReportEntity
}

const ReportBug: React.FC = () => {
	const language = useLanguage()
	const alert = useAlert()
	const [error, setError] = useState<string>()
	const [report, setReport] = useState<ReportEntity>(getDefault())

	const initialize = () => {
		setReport(getDefault())
		setError(undefined)
	}

	useEffect(() => initialize(), [])

	const handleSave = async () => {
		if (StringUtils.isEmpty(report.what)) {
			setError(language.data.EMPTY_FIELD_ERROR)
			return
		}

		const user = await UserService.getFirst()
		if (user && user.localId) {
			report.userLocalId = user.localId
		}
		ReportService.save(report)
		alert.showSuccessAlert(language.data.SUCESS)
		initialize()
	}

	const handleChangeWhat = (event: React.ChangeEvent<HTMLInputElement>) => {
		const what = event.target.value as string
		setReport({ ...report, what })
	}

	const handleChangeWhere = (event: React.ChangeEvent<HTMLInputElement>) => {
		const where = event.target.value as string
		setReport({ ...report, where })
	}

	const handleChangeHow = (event: React.ChangeEvent<HTMLInputElement>) => {
		const how = event.target.value as string
		setReport({ ...report, how })
	}

	return (
		<div className='report_bug'>
			<div className='report_bug__div'>
				<h3>{language.data.WHAT}</h3>
				<DinoHr />
				<p>
					{language.data.BUG_REPORT_WHAT}
				</p>
				<DinoTextfield
					value={report.what}
					onChange={handleChangeWhat}
					variant='outlined'
					rows={10}
					multiline
					dataProps={DataConstants.REPORT_WHAT}
					errorMessage={error}
				/>
			</div>
			<div className='report_bug__div'>
				<h3>{language.data.HOW}</h3>
				<DinoHr />
				<p>
					{language.data.BUG_REPORT_HOW}
				</p>
				<DinoTextfield
					value={report.how}
					onChange={handleChangeHow}
					variant='outlined'
					multiline
					rows={10}
					dataProps={DataConstants.REPORT_HOW}
				/>
			</div>
			<div className='report_bug__div'>
				<h3>{language.data.WHERE}</h3>
				<DinoHr />
				<p>
					{language.data.BUG_REPORT_WHERE}
				</p>
				<DinoTextfield
					value={report.where}
					onChange={handleChangeWhere}
					variant='outlined'
					multiline
					dataProps={DataConstants.REPORT_WHERE}
				/>
			</div>
			<SaveButton onClick={handleSave} />
		</div>
	)
}

export default ReportBug
