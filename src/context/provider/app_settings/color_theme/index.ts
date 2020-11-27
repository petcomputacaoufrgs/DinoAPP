import { useState } from 'react'
import AppSettingsService from '../../../../services/app_settings/AppSettingsService'
import ColorThemeContextType, { ColorThemeOption } from '../../../../types/context_provider/ColorThemeContextType'
import ColorThemeEnum from '../../../../types/app_settings/ColorThemeEnum'

const ColorThemeContextProvider = (): ColorThemeContextType => {
  const [currentColorTheme, setCurrentColorTheme] = useState(
    AppSettingsService.getColorTheme()
  )

  const updateColorTheme = (): void => {
    const colorTheme = AppSettingsService.getColorTheme()

    setCurrentColorTheme(colorTheme)
  }

  const getColorThemeOptions = (): ColorThemeOption[] => {
    const language = AppSettingsService.getLanguageBase()

    return [
      {
        code: ColorThemeEnum.DEVICE,
        name: language.DEVICE_DEFAULT_THEME_NAME,
      },
      {
        code: ColorThemeEnum.LIGHT,
        name: language.LIGHT_THEME_NAME,
      },
      {
        code: ColorThemeEnum.DARK,
        name: language.DARK_THEME_NAME,
      },
      {
        code: ColorThemeEnum.DALTONIAN,
        name: language.DALTONIAN_THEME_NAME,
      },
    ]
  }

  const value: ColorThemeContextType = {
    currentCode: currentColorTheme,
    currentName: AppSettingsService.getColorThemeName(currentColorTheme),
    updateColorTheme: updateColorTheme,
    getColorThemeOptions: getColorThemeOptions
  }

  return value
}

export default ColorThemeContextProvider