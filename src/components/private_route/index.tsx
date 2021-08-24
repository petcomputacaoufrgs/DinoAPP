import React from 'react'
import { usePrivateRouter } from '../../context/private_router'
import { Route, RouteProps, useLocation, Redirect } from 'react-router'

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */

interface PrivateRouteProps extends RouteProps {
	restrictedTo?: string[]
}

const PrivateRoute = (props: PrivateRouteProps): JSX.Element => {
	const router = usePrivateRouter()
	const location = useLocation()

	const isAuthorized = () => {
		if (props.restrictedTo && props.restrictedTo.length > 0) {
			return router.userPermission && props.restrictedTo.includes(router.userPermission)
		} return true
	}

	const renderRoute = () => {
		if (router.isAuthenticated) {
			if (isAuthorized()) {
				return <Route {...props} />
			}
		}

		return (
			<Redirect
				to={{
					pathname: router.loginPath,
					state: { from: location },
				}}
			/>
		)
	}

	return renderRoute()
}

export default PrivateRoute
