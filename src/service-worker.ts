/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import Database from './storage/Database'
import PostMessageType from './types/service_worker/PostMessageType'
import PostMessageData from './types/service_worker/PostMessageData'
import { hasNoValue, hasValue } from './utils/Utils' 
import TabEntity from './types/tab_control/TabEntity'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

// Precache all of the assets generated in build process.
precacheAndRoute(self.__WB_MANIFEST)

//#region SHELL-STYLE ROUTING
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
	// Return false to exempt requests from being fulfilled by index.html.
	({ request, url }: { request: Request; url: URL }) => {
		// If this isn't a navigation, skip.
		if (request.mode !== 'navigate') {
			return false
		}

		// If this is a URL that starts with /_, skip.
		if (url.pathname.startsWith('/_')) {
			return false
		}

		// If this looks like a URL for a resource, because it contains
		// a file extension, skip.
		if (url.pathname.match(fileExtensionRegexp)) {
			return false
		}

		// Return true to signal that we want to use the handler.
		return true
	},
	createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
)
//#endregion

//#region SKIP WAITING
//This allows the web app to trigger skipWaiting via registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting()
	}
})
//#endregion

//#region POST MESSAGE
const getTabByInData = async (
	tabId: number,
	table: Dexie.Table<TabEntity, number>,
): Promise<TabEntity | undefined> => {
	if (hasNoValue(tabId)) return

	return await table.where('id').equals(tabId).first()
}

const onTabClosed = async (tabId: number) => {
	const table: Dexie.Table<TabEntity, number> = Database.tab
	const currentTab = await getTabByInData(tabId, table)

	if (!currentTab) return

	await table.where('id').equals(currentTab.id!).delete()

	const isNotMainTab = currentTab.isMain === 0

	if (!isNotMainTab) return

	const tabsSearch = await table.toArray()

	if (tabsSearch.length === 0) return

	const clients = await self.clients.matchAll()

	if (clients.length === 0) {
		await table.clear()
		return
	}

	const newMainTab = tabsSearch.sort((a, b) => (a > b ? 1 : -1))[0]
	newMainTab.isMain = 1
	await table.put(newMainTab)

	const messageData: PostMessageData<number> = {
		type: PostMessageType.CHANGE_MAIN_TAB,
		info: newMainTab.id!,
	}
	clients.forEach(client => client.postMessage(messageData))
}

const setMainTab = async (tabId: number) => {
	const table: Dexie.Table<TabEntity, number> = Database.tab
	const newMainTab = await getTabByInData(tabId, table)

	if (!newMainTab) return

	const currentMainTab = await table.where('isMain').equals(1).first()

	if (currentMainTab) {
		currentMainTab.isMain = 0
		await table.put(currentMainTab)
	}

	newMainTab.isMain = 1
	await table.put(newMainTab)

	const clients = await self.clients.matchAll()
	const messageData: PostMessageData<number> = {
		type: PostMessageType.CHANGE_MAIN_TAB,
		info: newMainTab.id!,
	}
	clients.forEach(client => client.postMessage(messageData))
}

const registerNewTab = async (tabId: number) => {
	const table: Dexie.Table<TabEntity, number> = Database.tab
	const currentTab = await getTabByInData(tabId, table)

	if (!currentTab) return

	const tabs = await table.toArray()

	for (const tab of tabs) {
		if (tab.isMain && tab.id !== tabId) {
			tab.isMain = 0
			await table.put(tab)
		}
	}

	const clients = await self.clients.matchAll()

	if (clients.length !== tabs.length) {
		await table.where('id').notEqual(tabId).delete()
		const messageData: PostMessageData<number> = {
			type: PostMessageType.TAB_PROOF_OF_LIFE_REQUISITION,
			info: tabId,
		}
		clients.forEach(client => client.postMessage(messageData))
	} else {
		const messageData: PostMessageData<number> = {
			type: PostMessageType.CHANGE_MAIN_TAB,
			info: tabId,
		}

		clients.forEach(client => client.postMessage(messageData))
	}
}

self.addEventListener('message', event => {
	if (event.data && hasValue(event.data.type)) {
		if (event.data.type === PostMessageType.TAB_CLOSED) {
			onTabClosed(event.data.info)
			return
		}
		if (event.data.type === PostMessageType.SET_MAIN_TAB) {
			setMainTab(event.data.info)
			return
		}
		if (event.data.type === PostMessageType.REGISTER_NEW_TAB) {
			registerNewTab(event.data.info)
			return
		}
	}
})
//#endregion
