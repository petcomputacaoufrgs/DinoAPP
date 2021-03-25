import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import AlertProvider from './context/alert'
import GoogleOAuth2Provider from './context/google_oauth2'
import LanguageProvider from './context/language'
import LogoutService from './services/auth/LogoutService'
import EventService from './services/events/EventService'
import PostMessageService from './services/service_worker/PostMessageService'
import TabControlService from './services/tab_control/TabControlService'
import ReportWebVitalsService from './services/web_vitals/ReportWebVitalsService'
import './external/MaterialIcons.css'
import './Fonts.css'
import './Var.css'

window.addEventListener('load', () => {
	ReportWebVitalsService.start()
	PostMessageService.start()
	TabControlService.start()
	LogoutService.start()
	EventService.whenStart()
})

ReactDOM.render(
	<React.StrictMode>
		<GoogleOAuth2Provider>
			<AlertProvider>
				<LanguageProvider>
					<App />
				</LanguageProvider>
			</AlertProvider>
		</GoogleOAuth2Provider>
	</React.StrictMode>,
	document.getElementById('root'),
)
