import React from 'react'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import Typography from '@material-ui/core/Typography'
import Constants from '../../../../../constants/contact/ContactsConstants'
import TextButton from '../../../../../components/button/text_button'
import { useUserSettings } from '../../../../../context/provider/user_settings'
import './styles.css'

const ContactFormDialogContent = (
  props: ContactFormDialogContentProps
): JSX.Element => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
  const isNumberTaken = (tel: string): boolean =>
    props.helperText.number === tel

  const isNumberInvalid = (tel: string) =>
    isNumberTaken(tel)

  const isNameInvalid = (name: string) =>
    name.length === Constants.NAME_MAX || props.invalidName

  return (
    <div className="dialog_form__content">
      <TextField
        required
        fullWidth
        value={props.name}
        onChange={props.handleChangeName}
        margin="dense"
        id="name"
        label={`${language.FORM_NAME} (${language.MAX} ${Constants.NAME_MAX})`}
        type="name"
        inputProps={{ maxLength: Constants.NAME_MAX }}
        error={isNameInvalid(props.name)}
      />
      <br />
      <TextField
        fullWidth
        value={props.description}
        onChange={props.handleChangeDescription}
        margin="dense"
        id="description"
        label={`${language.FORM_DESCRIPTION} (${language.MAX} ${Constants.DESCRIPTION_MAX})`}
        type="text"
        inputProps={{ maxLength: Constants.DESCRIPTION_MAX }}
        error={props.description.length === Constants.DESCRIPTION_MAX}
      />
      <br />

      {props.phones.map((phone, index) => (
        <div key={index}>
          <PhoneFields
            type={phone.type}
            onChangeType={(e) => props.handleChangeType(e, index)}
            number={phone.number}
            onChangeNumber={(e) => props.handleChangeNumber(e, index)}
            error={isNumberInvalid(phone.number)}
            helperText={
              isNumberTaken(phone.number) ? props.helperText.text : ''
            }
            handleDeletePhone={() => props.handleDeletePhone(phone.number)}
          />
          <br />
        </div>
      ))}
      <TextButton className="add-phone__button" onClick={props.handleAddPhone}>
        <Typography variant="body2" color="textSecondary" display="block">
          {language.FORM_ADD_PHONE}
        </Typography>
      </TextButton>
    </div>
  )
}

export default ContactFormDialogContent
