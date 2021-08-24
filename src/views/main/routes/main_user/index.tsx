import React from 'react'
import { Switch } from 'react-router'
import PathConstants from '../../../../constants/app/PathConstants'
import PrivateRoute from '../../../../components/private_route'
import GlossaryItem from '../../glossary/glossary_list_items/glossary_item'
import Glossary from '../../glossary'
import Contacts from '../../contacts'
import Home from '../../home'
import Settings from '../../settings'
import Notes from '../../notes'
import NotFound from '../../../not_found/index'
import FaqHub from '../../faq_hub'
import Main from '../..'
import ReportBug from '../../../report_bug'

const UserMain: React.FC = () => {
	return (
		<Main>
			<Switch>
				<PrivateRoute exact path={PathConstants.USER_HOME} component={Home} />
				<PrivateRoute
					exact
					path={PathConstants.USER_GLOSSARY}
					component={Glossary}
				/>
				<PrivateRoute
					exact
					path={PathConstants.USER_CONTACTS}
					component={Contacts}
				/>
				<PrivateRoute exact path={PathConstants.USER_NOTES} component={Notes} />
				<PrivateRoute
					exact
					path={PathConstants.USER_SETTINGS}
					component={Settings}
				/>
				<PrivateRoute
					path={`${PathConstants.USER_GLOSSARY}/:localId`}
					component={GlossaryItem}
				/>
				<PrivateRoute exact path={PathConstants.USER_FAQ} component={FaqHub} />
				<PrivateRoute path={PathConstants.USER_CALENDAR} component={Settings} />
				<PrivateRoute
					path={PathConstants.USER_REPORT_BUG}
					component={ReportBug}
				/>
				<PrivateRoute path={'/'} component={NotFound} />
			</Switch>
		</Main>
	)
}

export default UserMain
