import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import DinoTabPanel from '../../../components/tab_panel'
import StaffService from '../../../services/staff/StaffService'
import StaffEntity from '../../../types/staff/database/StaffEntity'
import ListStaff from './staff_list_items'
import DinoLoader from '../../../components/loader'
import AddStaffForm from './add_staff_form'
import './styles.css'

const StaffModeration: React.FC = () => {

  const language = useLanguage()
  const [staff, setStaff] = useState<StaffEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
		const loadData = async () => {
			const staff = await StaffService.getAll()
			updateData(staff)
			finishLoading()
		}

		let updateData = (staff: StaffEntity[]) => {
			setStaff(staff)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		StaffService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			StaffService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

  return (
    <div className='staff_moderation'>
      <DinoTabPanel panels={[
          { Label: language.data.ADD_STAF_TAB, Component: <AddStaffForm /> },
          { Label: language.data.STAFF_LIST_TAB, Component: 
            <DinoLoader className='staff_loader' isLoading={isLoading}>
              <ListStaff items={staff} />
            </DinoLoader> 
          }
        ]} 
      />
    </div>
    )
}

export default StaffModeration