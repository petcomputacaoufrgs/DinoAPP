import React, { useEffect, useState } from 'react'
import Login from './views/login'
import PrivateRouterProvider from './context/private_router'
import PrivateRoute from './components/private_route'
import LoginRoute from './components/login_route/index'
import PathConstants from './constants/app/PathConstants'
import HistoryService from './services/history/HistoryService'
import { Switch, Route } from 'react-router'
import NotFound from './views/not_found/index'
import Load from './views/load'
import ViewportService from './services/viewport/ViewportService'
import TermsOfUse from './views/terms_of_use'
import PrivacyPolicy from './views/privacy_policy'
import DataThemeUtils from './utils/DataThemeUtils'
import UserSettingsService from './services/user/UserSettingsService'
import UserSettingsEntity from './types/user/database/UserSettingsEntity'
import DataFontSizeUtils from './utils/DataFontSizeUtils'
import AuthService from './services/auth/AuthService'
import AboutUs from './views/about'
import TabControlService from './services/tab_control/TabControlService'
import SecondaryTab from './views/secondary_tab'
import KidsSpace from './views/kids_space'
import UserService from './services/user/UserService'
import PermissionEnum from './types/enum/PermissionEnum'
import UserMain from './views/main/routes/main_user'
import StaffMain from './views/main/routes/main_staff'
import './App.css'
import './MaterialUI.css'
import './General.css'
import { toggle } from './constants/toggle/Toggle'
import TestInstanceService from './services/tests/TestInstanceService'
import ReportBug from './views/report_bug'

const LOAD_SCREEN_TIME = 2250

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isMainTab, setIsMainTab] = useState(false)
	const [showLoadScreen, setShowLoadScreen] = useState(true)
	const [userPermission, setUserPermission] = useState<string | undefined>(
		undefined,
	)

	useEffect(() => {
		const loadData = async () => {
			if (isLoading) await TabControlService.registerTab()

			const isAuthenticated = await loadAuth()

			if (isAuthenticated) {
				await loadSettings()
				await loadUserPermission()
				loadTestInstances()
			} else {
				DataThemeUtils.setBodyDataTheme(
					UserSettingsService.getSystemColorThemeName(),
				)
			}
			await loadTabInfo()
			updateAuth(isAuthenticated)
			finishLoading()
		}

		const loadAuth = async (): Promise<boolean> => {
			const isAuthenticated = await AuthService.isAuthenticated()
			updateAuth(isAuthenticated)
			return isAuthenticated
		}

		const loadTestInstances = async () => {
			const dbSettings = await UserSettingsService.getFirst()
			if (dbSettings) {
				if (
					toggle.loadTestInstancesAtFirstLogin &&
					(!dbSettings.firstSettingsDone || toggle.forceFirstLogin)
				) {
					console.log('Carregando testes...')
					TestInstanceService.loadInstances()
				}
			}
		}

		const loadSettings = async () => {
			const dbSettings = await UserSettingsService.getFirst()
			if (dbSettings) {
				updateSettings(dbSettings)
			} else {
				DataThemeUtils.setBodyDataTheme(
					UserSettingsService.getSystemColorThemeName(),
				)
			}
		}

		const loadTabInfo = async () => {
			const isMainTab = await TabControlService.isMainTab()
			updateTabInfo(isMainTab)
		}

		let updateAuth = (isAuthenticated: boolean) => {
			setIsAuthenticated(isAuthenticated)
		}

		const loadUserPermission = async () => {
			const hasUserPermission = await UserService.getPermission()
			updateUserPermission(hasUserPermission || PermissionEnum.USER)
		}

		let updateSettings = (settings: UserSettingsEntity) => {
			const colorTheme = UserSettingsService.getColorThemeName(settings)
			DataThemeUtils.setBodyDataTheme(colorTheme)

			const fontSize = UserSettingsService.getFontSize(settings)
			DataFontSizeUtils.setBodyDataFontSize(fontSize)
		}

		let updateTabInfo = (isMainTab: boolean) => {
			setIsMainTab(isMainTab)
		}

		let updateUserPermission = (userPermission: string) => {
			setUserPermission(userPermission)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		AuthService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadSettings)
		TabControlService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			finishLoading = () => {}
			updateSettings = () => {}
			updateAuth = () => {}
			updateUserPermission = () => {}
			updateTabInfo = () => {}
			AuthService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadSettings)
			TabControlService.removeUpdateEventListenner(loadTabInfo)
		}
	}, [isLoading])

	useEffect(() => {
		if (showLoadScreen) {
			const interval = setInterval(
				() => setShowLoadScreen(false),
				LOAD_SCREEN_TIME,
			)
			const cleanBeforeUpdate = () => {
				clearInterval(interval)
			}

			return cleanBeforeUpdate
		}
	}, [showLoadScreen])

	useEffect(() => {
		ViewportService.maximizeViewport()
	}, [])

	const renderApp = () => (
		<PrivateRouterProvider
			loginPath={PathConstants.LOGIN}
			userHomePath={PathConstants.USER_HOME}
			staffHomePath={PathConstants.STAFF_HOME}
			isAuthenticated={isAuthenticated}
			browserHistory={HistoryService}
			userPermission={userPermission}
		>
			<Switch>
				<LoginRoute exact path={PathConstants.LOGIN} component={Login} />
				<PrivateRoute
					path={PathConstants.USER}
					component={UserMain}
					restrictedTo={[PermissionEnum.USER]}
				/>
				<PrivateRoute
					path={PathConstants.STAFF}
					component={StaffMain}
					restrictedTo={[PermissionEnum.ADMIN, PermissionEnum.STAFF]}
				/>
				<PrivateRoute
					path={PathConstants.USER_REPORT_BUG}
					component={ReportBug}
				/>
				<PrivateRoute
					path={PathConstants.KIDS_SPACE}
					component={KidsSpace}
					restrictedTo={[PermissionEnum.USER]}
				/>
				<Route path={PathConstants.TERMS_OF_USE} component={TermsOfUse} />
				<Route path={PathConstants.PRIVACY_POLICY} component={PrivacyPolicy} />
				<Route path={PathConstants.ABOUT_US} component={AboutUs} />
				<Route path={'/'} component={NotFound} />
			</Switch>
		</PrivateRouterProvider>
	)

	return (
		<div className='app'>
			{showLoadScreen || isLoading ? (
				<Load />
			) : isMainTab ? (
				renderApp()
			) : (
				<SecondaryTab />
			)}
		</div>
	)
}

export default App
