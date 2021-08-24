import { History, LocationState } from 'history'

export default interface PrivateRouterContextType<S = LocationState> {
	loginPath: string

	userHomePath: string
	
	staffHomePath: string

	isAuthenticated: boolean

	userPermission?: string

	browserHistory?: History<S>
}
