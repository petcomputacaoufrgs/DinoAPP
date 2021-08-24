import React from 'react'
import { Switch } from 'react-router'
import PathConstants from '../../../../constants/app/PathConstants'
import PrivateRoute from '../../../../components/private_route'
import NotFound from '../../../not_found'
import Main from '../..'
import StaffModeration from '../../staff_moderation'
import Treatment from '../../treatment'
import FaqHub from '../../faq_hub'
import Glossary from '../../glossary'
import GlossaryItem from '../../glossary/glossary_list_items/glossary_item'
import Home from '../../home'
import Contacts from '../../contacts'
import Settings from '../../settings'
import StaffDataProvider from '../../../../context/staff_data'
import ReportBug from '../../../report_bug'

const StaffMain: React.FC = () => {
	return (
		<Main>
			<Switch>
				<PrivateRoute exact path={PathConstants.STAFF_HOME} component={Home} />
				<PrivateRoute
					exact
					path={PathConstants.STAFF_GLOSSARY}
					component={Glossary}
				/>
				<PrivateRoute
					exact
					path={PathConstants.STAFF_CONTACTS}
					component={Contacts}
				/>
				<PrivateRoute
					exact
					path={PathConstants.STAFF_SETTINGS}
					component={Settings}
				/>
				<PrivateRoute
					path={`${PathConstants.STAFF_GLOSSARY}/:localId`}
					component={GlossaryItem}
				/>
				<PrivateRoute
					path={PathConstants.STAFF_MODERATION}
					component={StaffModeration}
				/>
				<PrivateRoute
					path={PathConstants.STAFF_REPORT_BUG}
					component={ReportBug}
				/>
				<StaffDataProvider>
					<Switch>
						<PrivateRoute
							exact
							path={`${PathConstants.STAFF_FAQ}/:localId/:tab`}
							component={FaqHub}
						/>
						<PrivateRoute
							path={PathConstants.TREATMENT}
							component={Treatment}
						/>
						<PrivateRoute path={'/'} component={NotFound} />
					</Switch>
				</StaffDataProvider>
				<PrivateRoute path={'/'} component={NotFound} />
			</Switch>
		</Main>
	)
}

export default StaffMain
