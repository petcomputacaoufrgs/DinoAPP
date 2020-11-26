import React, { useState } from 'react'
import { Switch } from 'react-router'
import { useCurrentLanguage } from '../../context/provider/app_settings'
import { ReactComponent as GlossarySVG } from '../../assets/icons/menu_icons/glossary.svg'
import { ReactComponent as ContactsSVG } from '../../assets/icons/menu_icons/phone.svg'
import { ReactComponent as HomeSVG } from '../../assets/icons/menu_icons/home.svg'
import { ReactComponent as NotesSVG } from '../../assets/icons/menu_icons/note.svg'
import { ReactComponent as FaqSVG } from '../../assets/icons/menu_icons/faq.svg'
import { ReactComponent as SettingsSVG } from '../../assets/icons/menu_icons/settings.svg'
import { ReactComponent as LogoutSVG } from '../../assets/icons/menu_icons/logout.svg'
import PathConstants from '../../constants/app/PathConstants'
import DrawerNavigation from '../../components/drawer_navigation'
import PrivateRoute from '../../components/private_route'
import GlossaryItem from './glossary/glossary_item'
import Glossary from './glossary'
import Contacts from './contacts'
import Home from './home'
import Settings from './settings'
import LogoutDialog from '../../components/logout_dialog'
import Notes from './notes'
import NotFound from '../not_found/index'
import NoteContextProvider from '../../context/provider/note'
import FaqContextProvider from '../../context/provider/faq'
import GlossaryContextProvider from '../../context/provider/glossary'
import ContactsContextProvider from '../../context/provider/contact'
import NoteColumnContextProvider from '../../context/provider/note_column'
import Faq from './faq'
import MenuItemViewModel from '../../types/menu/MenuItemViewModel'
import Calendar from './calendar'
import AboutUs from './about'
import AuthService from '../../services/auth/AuthService'
import MenuService from '../../services/menu/MenuService'

const Main = (): JSX.Element => {
  const language = useCurrentLanguage()

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true)
  }

  const handleLogoutAgree = () => {
    AuthService.googleLogout()
  }

  const handleLogoutDisagree = () => {
    setOpenLogoutDialog(false)
  }

  const groupedItems: MenuItemViewModel[][] = MenuService.getGroupedMenuItems(language, handleLogoutClick)

  const renderMainContent = (): JSX.Element => {
    return (
      <Switch>
        <PrivateRoute exact path={PathConstants.HOME} component={Home} />
        <PrivateRoute
          exact
          path={PathConstants.GAMES}
          component={() => <></>}
        />
        <PrivateRoute
          exact
          path={PathConstants.GLOSSARY}
          component={() => (
            <GlossaryContextProvider>
              <Glossary />
            </GlossaryContextProvider>
          )}
        />
        <PrivateRoute
          exact
          path={PathConstants.CONTACTS}
          component={() => (
            <ContactsContextProvider>
              <Contacts />
            </ContactsContextProvider>
          )}
        />
        <PrivateRoute
          exact
          path={PathConstants.NOTES}
          component={() => (
            <NoteColumnContextProvider>
              <NoteContextProvider>
                <Notes />
              </NoteContextProvider>
            </NoteColumnContextProvider>
          )}
        />
        <PrivateRoute
          exact
          path={PathConstants.SETTINGS}
          component={Settings}
        />
        <PrivateRoute
          path={`${PathConstants.GLOSSARY}/:id`}
          component={() => (
            <GlossaryContextProvider>
              <GlossaryItem />
            </GlossaryContextProvider>
          )}
        />
        <PrivateRoute
          path={PathConstants.FAQ}
          component={() => (
            <FaqContextProvider>
              <Faq />
            </FaqContextProvider>
          )}
        />
        <PrivateRoute
          path={PathConstants.ABOUT_US}
          component={() => (
            <AboutUs />
          )}
        />
        <PrivateRoute path={PathConstants.CALENDAR} component={Calendar} />
        <PrivateRoute path={'/'} component={NotFound} />
      </Switch>
    )
  }

  return (
    <>
      <DrawerNavigation
        groupedItems={groupedItems}
        component={renderMainContent()}
      />
      <LogoutDialog
        onAgree={handleLogoutAgree}
        onDisagree={handleLogoutDisagree}
        open={openLogoutDialog}
      />
    </>
  )
}

export default Main
