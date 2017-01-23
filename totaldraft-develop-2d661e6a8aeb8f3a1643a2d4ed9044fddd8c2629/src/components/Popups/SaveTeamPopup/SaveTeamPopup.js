import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Checkbox from 'components/Checkbox';
import Link from 'components/Link';
import { getCurrencySymbol, getPropByLocale } from 'utils';
// import IconSVG from 'components/IconSVG';
import SocialAuth from 'components/SocialAuth';
import RulesConfirmationForm from 'components/RulesConfirmationForm';
import s from './SaveTeamPopup.css';
import Popup from '../Popup';
import messages from './messages';

class SaveTeamPopup extends Component {

  static propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    myTeam: PropTypes.object.isRequired,
    onSave: PropTypes.func,
    onUpdate: PropTypes.func,
    roomId: PropTypes.number,
    teamId: PropTypes.string,
    user: PropTypes.object,
    room: PropTypes.object,
    payAndPlay: PropTypes.func,
    onLogin: PropTypes.func,
    onRegistration: PropTypes.func,
    intl: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      code: null,
      name: null,
      teamName: null,
      cashValue: null,
      approvedTerms: false,
      isLoginFormShown: true,
      isRegistrationFormShown: false,
      isRulesConfirmationShown: false,
      isLoginShown: false,
      isTeamShown: true,
      isPaymentShown: false,
      isAddToUserTemplate: false,
      isUserLoggedIn: props.user ? true : false
    };
  }

  componentWillReceiveProps(newProps) {
    const { user, room, myTeam } = this.props;

    if (!user && !this.state.isLoginShown) {
      this.setState({
        isLoginShown: true,
        isTeamShown: false,
        isPaymentShown: false,
        isRulesConfirmationShown: false
      });
    }

    if (user && user.data.r && !this.state.isPaymentShown) {
      this.setState({
        isLoginShown: false,
        isTeamShown: true,
        isPaymentShown: false,
        isRulesConfirmationShown: false
      });
    }

    if (room && !this.state.cashValue) {
      this.setState({ cashValue: room.fee });
    }

    if (myTeam && myTeam.players) {
      this.setState({ teamName: myTeam.title });
    }

    if (user && !user.data.r) {
      this.setState({
        isRulesConfirmationShown: true,
        isLoginShown: false,
        isRegistrationFormShown: false,
      });
    }
  }

  componentWillUnmount() {
    this.resetPopup();
  }

  onSave() {
    const { teamId, myTeam, onUpdate, onSave } = this.props;
    const main = [];
    const reserve = [];

    myTeam.players.forEach(p => {
      if (p.isMain) {
        main.push(p.id);
      } else {
        reserve.push(p.id);
      }
    });

    const team = { main, reserve };
    const teamTitle = this.state.teamName.trim();

    if (teamTitle !== '') {
      if (teamId) {
        onUpdate(team, teamTitle);
      } else {
        onSave(team, teamTitle, this.state.isAddToUserTemplate);
      }
    }
  }

  onCancel() {
    this.props.onClose();
    this.resetPopup();
  }

  payAndPlay() {
    const { myTeam, payAndPlay } = this.props;
    const main = [];
    const reserve = [];

    myTeam.players.forEach(p => {
      if (p.isMain) {
        main.push(p.id);
      } else {
        reserve.push(p.id);
      }
    });

    const team = { main, reserve };
    const teamTitle = this.state.teamName.trim();

    payAndPlay(team, teamTitle, this.state.cashValue, this.state.isAddToUserTemplate);
  }

  handleInputKeyDown(e) {
    const charCode = e.keyCode;
    const validKeys = [8, 9, 37, 39, 46];

    if ((charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)
      && validKeys.indexOf(charCode) === -1) {
      e.preventDefault();
    }
  }

  handleTeamNameChange(event) {
    this.setState({ teamName: event.currentTarget.value });
  }

  handleEmailChange(e) {
    const value = e.currentTarget.value;
    this.setState({ email: value });
    this.setState({ name: value.substring(0, value.indexOf('@')) });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.currentTarget.value });
  }

  handleCodeChange(e) {
    this.setState({ code: e.currentTarget.value });
  }

  handleCashValueChange(e) {
    this.setState({ cashValue: e.currentTarget.value });
  }

  resetPopup() {
    this.setState({
      email: null,
      password: null,
      code: null,
      name: null,
      teamName: null,
      cashValue: null,
      approvedTerms: false,
      isLoginFormShown: true,
      isRegistrationFormShown: false,
      isLoginShown: false,
      isTeamShown: true,
      isPaymentShown: false,
      isAddToUserTemplate: false
    });
  }

  handleLoginFormSubmit(e) {
    e.preventDefault();

    const { onLogin, onRegistration } = this.props;
    const { email, password, code, name, approvedTerms, isLoginFormShown } = this.state;

    if (isLoginFormShown && email && password) {
      onLogin(email, password);
    }
    if (!isLoginFormShown && email && password && approvedTerms) {
      onRegistration(email, password, code, name);
    }
  }

  handleSaveFormSubmit(e) {
    e.preventDefault();
    this.onSave();
  }

  handlePaymentFormSubmit(e) {
    e.preventDefault();
    this.payAndPlay();
  }

  render() {
    const { user, room, teamId, intl, currentLocale } = this.props;
    const { formatMessage } = intl;
    const popupTitle = <FormattedMessage {...messages.playInRoomTitle} values={{ title: room ? `«${getPropByLocale(room.title, currentLocale)}»` : '' }} />

    return (
      <Popup
        isOpen={this.props.isOpen}
        onClose={ () => { this.onCancel(); this.resetPopup(); }}
        title={popupTitle}
        cssClass={s.root}
      >
        <div className={s.root}>
          {/* <div className={s.guide}>
            {!this.state.isUserLoggedIn ?
              <div className={s.guideBlock}>
                <div className={cx(s.guideItem, { [s.guideItemIsActive]: this.state.isLoginShown, [s.guideItemIsDone]: this.state.isTeamShown || this.state.isPaymentShown })}>
                  <div className={s.guideTitle}>Авторизация</div>
                  <div className={s.guideShape}></div>
                </div>
                <div className={cx(s.guideItem, { [s.guideItemIsActive]: this.state.isTeamShown, [s.guideItemIsDone]: this.state.isPaymentShown })}>
                  <div className={s.guideTitle}>Команда</div>
                </div>
              </div>
            : null}
            {user && room && (user.money - room.fee < 0) ?
              <div className={s.guideBlock}>
                <div className={cx(s.guideItem, { [s.guideItemIsActive]: this.state.isTeamShown, [s.guideItemIsDone]: this.state.isPaymentShown })}>
                  <div className={s.guideTitle}>Команда</div>
                  <div className={s.guideShape}></div>
                </div>
                <div className={cx(s.guideItem, { [s.guideItemIsActive]: this.state.isPaymentShown })}>
                  <div className={s.guideTitle}>Баланс</div>
                </div>
              </div>
            : null}
          </div> */}

          <div className={s.sectionAuth}>
            {this.state.isRulesConfirmationShown ?
              <RulesConfirmationForm
                user={user}
                isActive
                isDarkColored
              />
            : null}

            {(this.state.isLoginShown || this.state.isRegistrationFormShown) ?
              <SocialAuth
                refCode={this.state.code}
                isDarkColored
                isRedirectDisabled
              />
            : null}

            {this.state.isLoginShown && !user ?
              <form action="" onSubmit={this.handleLoginFormSubmit.bind(this)} className={s.form}>
                <div className={s.sectionTitle}>
                  <span
                    className={cx(s.sectionAuthLabel, { [s.sectionAuthLabelIsActive]: this.state.isLoginFormShown })}
                    onClick={() => this.setState({ isLoginFormShown: true, isRegistrationFormShown: false })}
                  ><FormattedMessage {...messages.loginLabel} /></span>
                  <span
                    data-gtm="signup-popup"
                    className={cx(s.sectionAuthLabel, { [s.sectionAuthLabelIsActive]: this.state.isRegistrationFormShown })}
                    onClick={() => this.setState({ isLoginFormShown: false, isRegistrationFormShown: true })}
                  ><FormattedMessage {...messages.regLabel} /></span>
                </div>
                <div className={s.formSectionCentered}>
                  <input
                    type="text"
                    placeholder="EMAIL"
                    value={this.state.email}
                    onChange={(e) => this.handleEmailChange(e)}
                  />
                </div>
                <div className={s.formSectionCentered}>
                  <input
                    type="password"
                    placeholder={formatMessage(messages.passwordPlaceholder)}
                    value={this.state.password}
                    onChange={(e) => this.handlePasswordChange(e)}
                  />
                </div>
                {this.state.isRegistrationFormShown ?
                  <div className={s.section}>
                    <div className={s.formSectionCentered}>
                      <input
                        type="text"
                        placeholder={formatMessage(messages.codePlaceholder)}
                        value={this.state.code}
                        onChange={(e) => this.handleCodeChange(e)}
                      />
                    </div>
                    <div className={s.formSectionCentered}>
                      <Checkbox
                        isDarkColored
                        isChecked={this.state.approvedTerms}
                        cssClass={s.termsCheckbox}
                        toggleCheckbox={(isChecked) => this.setState({ approvedTerms: isChecked })}
                      >
                        <FormattedMessage
                          {...messages.termsCheckboxLabel}
                          values={{
                            termsLink: <a target="_blank" rel="noopener noreferrer" href="/terms-and-conditions"><FormattedMessage {...messages.termsLabel}/></a>
                          }}
                        />
                      </Checkbox>
                    </div>
                  </div>
                : null}
                <div className={s.formSectionCentered}>
                  {this.state.isLoginFormShown ?
                    <button
                      data-gtm="login-after"
                      type="submit"
                      className={cx(s.btn, { [s.btnIsActive]: this.state.email && this.state.password })}
                    ><FormattedMessage {...messages.loginBtnLabel} /></button>
                    :
                    <button
                      data-gtm="join-after"
                      type="submit"
                      className={cx(s.btn, { [s.btnIsActive]: this.state.email && this.state.password && this.state.approvedTerms })}
                    ><FormattedMessage {...messages.joinLabel} /></button>
                  }
                </div>
              </form>
            : null}
          </div>

          {this.state.isTeamShown ?
            <form action="" onSubmit={this.handleSaveFormSubmit.bind(this)} className={s.form}>
              <div className={s.sectionTeam}>
                {/* <div className={s.sectionTitle}></div> */}

                {user && room && (user.money - room.fee) >= 0 ?
                  <div className={s.formSectionCentered}>
                    <input
                      type="text"
                      placeholder={formatMessage(messages.teamNamePlaceholder)}
                      value={this.state.teamName}
                      onChange={(e) => this.handleTeamNameChange(e)}
                    />
                  </div>
                : null}

                {!teamId && (user && room && (user.money - room.fee) >= 0) ?
                  <div className={s.formSectionCentered}>
                    <Checkbox
                      isDarkColored
                      isChecked={this.state.isAddToUserTemplate}
                      label={formatMessage(messages.templateCheckLabel)}
                      cssClass={s.formCheckbox}
                      toggleCheckbox={(isChecked) => this.setState({ isAddToUserTemplate: isChecked })}
                    />
                  </div>
                : null}

                {teamId ?
                  <div className={s.formSectionButtons}>
                    <button
                      type="submit"
                      className={cx(s.btnSubmit, { [s.btnSubmitIsActive]: this.state.teamName && this.state.teamName.trim() !== '' })}
                    ><FormattedMessage {...messages.saveLabel} /></button>
                    <div className={s.btnCancel} onClick={() => this.onCancel()}>
                      <FormattedMessage {...messages.cancelLabel} />
                    </div>
                  </div>
                :
                  <div className={s.formSectionButtons}>
                    {user && room && (user.money - room.fee >= 0) ?
                      <div className={s.formSectionCentered}>
                        <button
                          data-gtm="play"
                          type="submit"
                          className={cx(s.btnSubmit, { [s.btnSubmitIsActive]: this.state.teamName && this.state.teamName.trim() !== '' })}
                        >
                          {room && room.fee ?
                            <FormattedMessage {...messages.playWithFeeLabel} values={{ fee: `${room.fee} ${getCurrencySymbol(room.currency)}` }} />
                            :
                            <FormattedMessage {...messages.playLabel} />
                          }
                        </button>
                        <div className={s.btnCancel} onClick={() => this.onCancel()}>
                          <FormattedMessage {...messages.cancelLabel} />
                        </div>
                      </div>
                    :
                      <div className={s.formWarning}>
                        <div className={s.formWarningLabel}>
                          <FormattedMessage {...messages.noMoneyLabel} />
                        </div>
                        <Link className={cx(s.btn, { [s.btnIsActive]: true })} to="/lobby">
                          <FormattedMessage {...messages.lobbyLinkLabel} />
                        </Link>
                      </div>
                    }
                    {/*
                    <div
                      className={cx(s.btn, { [s.btnIsActive]: this.state.teamName && this.state.teamName.trim() !== '' })}
                      onClick={() => this.setState({ isTeamShown: false, isPaymentShown: true })}
                    >
                      Пополнить баланс
                      <IconSVG icon="smart-arrow-right" size="13" cssClass={s.btnIcon} />
                    </div>
                    */}
                  </div>
                }
                {!teamId ?
                  <div>
                    {user && room && (user.money - room.fee < 0) ?
                      <div className={s.note}>
                        <FormattedMessage {...messages.noMoneyNote} />
                      </div>
                      : null
                    }
                    {user && room && (room.fee > 0 && user.money - room.fee < 0) ?
                      <div className={s.note}>
                        <FormattedMessage {...messages.feeNote} />
                      </div>
                      : null
                    }
                  </div>
                : null}
              </div>
            </form>
          : null}

          {this.state.isPaymentShown ?
            <form action="" onSubmit={this.handlePaymentFormSubmit.bind(this)} className={s.form}>
              <div className={s.sectionPayment}>
                <div className={s.sectionTitle}>
                  <FormattedMessage {...messages.paymentTitle} />:
                </div>
                <div className={s.formSectionCentered}>
                  <input
                    type="text"
                    placeholder={formatMessage(messages.amountPlaceholder)}
                    value={this.state.cashValue}
                    className={cx({ [s.inputError]: this.state.cashValue < (room.fee - user.money) })}
                    onKeyDown={ (e) => this.handleInputKeyDown(e) }
                    onChange={ (e) => this.handleCashValueChange(e) }
                  />
                </div>
                <div className={s.formSectionButtons}>
                  <button
                    type="submit"
                    className={cx(s.btnSubmit, { [s.btnSubmitIsActive]: this.state.cashValue >= (room.fee - user.money) })}
                  >
                    <FormattedMessage {...messages.payAndPlayLabel} />
                  </button>
                  <div className={s.btnCancel} onClick={() => this.onCancel()}>
                    <FormattedMessage {...messages.cancelLabel} />
                  </div>
                </div>
                <div className={s.note}>* <FormattedMessage {...messages.paymentNote} /></div>
              </div>
            </form>
          : null}
        </div>
      </Popup>
    );
  }
}

export default injectIntl(withStyles(s)(SaveTeamPopup));
