import React, { useState, useEffect } from 'react'
import { ReactComponent as SyncSVG } from '../../assets/icons/sync/sync.svg'
import { ReactComponent as OnlineSVG } from '../../assets/icons/sync/check.svg'
import CloseIcon from '@material-ui/icons/Close';
import SyncStateEnum from '../../types/sync/SyncStateEnum'
import SyncService from '../../services/sync/SyncService'
import SyncCloudProps from './props'
import './styles.css'

const SyncInfo: React.FC<SyncCloudProps> = ({ className, state }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [syncState, setSyncState] = useState(SyncStateEnum.SYNCHRONIZING)

	useEffect(() => {
		const loadData = () => {
			const state = SyncService.getState()
			setSyncState(state)
			setIsLoading(false)
		}

		if (state === undefined) SyncService.addUpdateEventListenner(loadData)

		if (isLoading) {
			if (state === undefined) {
				loadData()
			} else {
				setSyncState(state)
			}
		}

		return () => {
			if (state === undefined) SyncService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, state])

	const getSyncSymbol = (): JSX.Element => {
		if (syncState === SyncStateEnum.NOT_SYNCED) {
			return (
				<>
					<OnlineSVG className='sync_info__icon sync_info__out_icon synced' />
					<CloseIcon className='sync_info__icon sync_info__main_icon offline not_synced' />
				</>
			)
		} else if (syncState === SyncStateEnum.SYNCHRONIZING) {
			return (
				<>
					<OnlineSVG className='sync_info__icon sync_info__out_icon synced' />
					<SyncSVG className='sync_info__icon sync_info__synchronizing_icon synchronizing' />
				</>
			)
		} else {
			return <OnlineSVG className='sync_info__icon synced' />
		}
	}

	const getStateClassName = (base: string): string => {
		if (syncState === SyncStateEnum.SYNCED) {
			return base.concat(' synced')
		} else if (syncState === SyncStateEnum.SYNCHRONIZING) {
			return base.concat(' synchronizing')
		} else {
			return base.concat(' not_synced')
		}
	}

	const getMainClassName = (): string => {
		const base = 'sync_info'

		if (className) {
			return getStateClassName(base.concat(' ').concat(className))
		}

		return getStateClassName(base)
	}

	return <div className={getMainClassName()}>{getSyncSymbol()}</div>
}

export default SyncInfo
