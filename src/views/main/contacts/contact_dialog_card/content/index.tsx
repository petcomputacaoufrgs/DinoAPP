import React, { useEffect, useState } from 'react'
import ContactsConstants from '../../../../../constants/app_data/DataConstants'
import ContactCardContentProps from './props'
import { Typography, CardContent, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import { Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, LocalHospitalRounded as HospitalIcon } from '@material-ui/icons'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'
import TreatmentService from '../../../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../../../types/treatment/database/TreatmentEntity'
import DinoLoader from '../../../../../components/loader'
import { HasStaffPowers } from '../../../../../context/private_router'
import EssentialContactEntity from '../../../../../types/contact/database/EssentialContactEntity'
import { LanguageContextType, useLanguage } from '../../../../../context/language'
import './styles.css'
import { isUniversalEssential } from '../../../../../services/contact/ContactViewService'

const ContactCardContent: React.FC<ContactCardContentProps> = ({ item }) => {
	const getTypePhoneIcon = (phone: PhoneEntity) => {
		if (phone.type === ContactsConstants.CONTACT_PHONE_CODE_MOBILE) {
			return <PhoneIcon />
		}
		if (phone.type === ContactsConstants.CONTACT_PHONE_CODE_RESIDENTIAL) {
			return <HomeIcon />
		}
		return <HospitalIcon />
	}

	const Description = (): JSX.Element => {
		return item.contact.description ? 
			<ListItem divider className='contacts__list__item'>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText
					primary={ <div className='contacts__list__item__text dino__text__wrap'> 
					{item.contact.description} 
					</div>}
				/>
			</ListItem>
		: <></>	
	}

	const Phones = () => {
		return item.phones.length ? (
			<div>
				{item.phones.map((phone, index) => (
					<a
						href={`tel:${phone.number}`}
						style={{ textDecoration: 'none' }}
						key={index}
					>
						<ListItem divider button className='contacts__list__item__content__phones dino__text__wrap'>
							<ListItemIcon>{getTypePhoneIcon(phone)}</ListItemIcon>
							<ListItemText
								primary={
								<Typography variant='subtitle1' color='textSecondary' component='p'>
									{phone.number}
								</Typography>
								}
							/>
						</ListItem>
					</a>
				))}
			</div>
		) : <></>
	}

	return (
		<CardContent className='contacts__list__item__content'>
			<Description />
			<List component='nav'>
				<Phones />
			</List>
			<TreatmentList item={item}/>
		</CardContent>
	)
}

export default ContactCardContent

const TreatmentList = ({item} : ContactCardContentProps) => {
	const language = useLanguage()

	const treatmentIds = (item.contact as EssentialContactEntity).treatmentLocalIds

	const [treatments, setTreatments] = useState<TreatmentEntity[]>()

	let [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			if(treatmentIds) {
				const treatments = await TreatmentService.getAllByLocalIds(treatmentIds)
				if(treatments) setTreatments(treatments)
			}
			setIsLoading(false)
		}

		if (isLoading) 
			loadData()
		
	}, [isLoading, treatmentIds])

	const renderTreatmentListItem = (name: string, index?: number) => {
		return (
			<ListItem key={index} className='dino__text__wrap'>
				<ListItemText primary={name}/>
			</ListItem>
		)
	}

	return HasStaffPowers() ? (
		<List component='nav'>
			<SectionTitle language={language} />
			{ isUniversalEssential(item.contact) ? renderTreatmentListItem(language.data.UNIVERSAL_CONTACT_LABEL)
			: <DinoLoader isLoading={isLoading}>
					{treatments?.map((e, index) => renderTreatmentListItem(e.name, index))}
				</DinoLoader>}
		</List>
	) : <></>
}

const SectionTitle: React.FC<{
	language: LanguageContextType
}> = ({
	language
}) => {
	return (
		<div className='contact_card__section_title'>
			<p>{language.data.TREATMENTS.toUpperCase()}</p>
		</div>
	)
}
