import { AppBar, Tab, Tabs } from '@material-ui/core'
import React, { useState } from 'react'
import { DinoTabPanelProps, TabPanelProps } from './props'
import './styles.css'

function getProps(index: number) {
	return {
	  id: `full-width-tab-${index}`,
	  'aria-controls': `full-width-tabpanel-${index}`,
	};
 }

 const DinoTabPanel: React.FC<DinoTabPanelProps> = ({ panels, currentTab }) => { 

  const [valueTab, setValueTab] = useState(currentTab || 0)

  const TabPanel = ({ children, value, index }: TabPanelProps) => {
    return (
      <div
        className='dino__tab__panel'
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        >
        {value === index && children}
      </div>
	  )
 }

  return (
    <div className='dino_tab_panels'>
      <AppBar position="static" color="default">
        <Tabs
          value={valueTab}
          onChange={(event, newValue: number) => setValueTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs"
        >
          {panels.map((e, index) => <Tab wrapped key={index} label={e.Label} {...getProps(index)} />)}
        </Tabs>
      </AppBar>
        {panels.map((e, index) => 
          <TabPanel key={index} value={valueTab} index={index}>
            {e.Component}
          </TabPanel>
        )}
    </div>
    )
  }

  export default DinoTabPanel