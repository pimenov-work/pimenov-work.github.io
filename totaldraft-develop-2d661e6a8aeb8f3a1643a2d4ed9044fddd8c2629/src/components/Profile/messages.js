import { defineMessages } from 'react-intl';

const messages = defineMessages({
  pageTitle: {
    id: 'profile.pageTitle',
    defaultMessage: 'Профиль',
    description: 'Профиль',
  },
  userDataLabel: {
    id: 'profile.userDataLabel',
    defaultMessage: 'Персональные данные',
    description: 'Персональные данные',
  },
  changePasswordLabel: {
    id: 'profile.changePasswordLabel',
    defaultMessage: 'Сменить пароль',
    description: 'Сменить пароль',
  },
  changeLangLabel: {
    id: 'profile.changeLangLabel',
    defaultMessage: 'Язык',
    description: 'Язык',
  },
  namePlaceholder: {
    id: 'profile.namePlaceholder',
    defaultMessage: 'ИМЯ',
    description: 'ИМЯ',
  },
  newPwdPlaceholder: {
    id: 'profile.newPwdPlaceholder',
    defaultMessage: 'НОВЫЙ ПАРОЛЬ',
    description: 'НОВЫЙ ПАРОЛЬ',
  },
  errorShortPwd: {
    id: 'profile.errorShortPwd',
    defaultMessage: 'Пароль должен быть длинной от 6 до 16 символов',
    description: 'Пароль должен быть длинной от 6 до 16 символов',
  },
  saveButtonLabel: {
    id: 'profile.saveButtonLabel',
    defaultMessage: 'Сохранить',
    description: 'Сохранить',
  }
});

export default messages;
