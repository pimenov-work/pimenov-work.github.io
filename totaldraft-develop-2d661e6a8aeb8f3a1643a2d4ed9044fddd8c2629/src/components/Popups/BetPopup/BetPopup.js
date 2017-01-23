import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import s from './BetPopup.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Popup from '../Popup';
import { getCurrencySymbol, getPropByLocale } from '../../../utils';
// import IconSVG from 'components/IconSVG';
import Link from 'components/Link';
import messages from './messages';

class BetPopup extends Component {

  static propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    myTeam: PropTypes.object,
    onSave: PropTypes.func,
    onUpdate: PropTypes.func,
    roomId: PropTypes.number,
    user: PropTypes.object,
    room: PropTypes.object,
    payAndPlay: PropTypes.func,
    intl: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      teamName: null,
      cashValue: null,
      isTeamShown: true,
      isPaymentShown: false
    };
  }

  componentWillReceiveProps(newProps) {
    const { room } = this.props;

    if (room && !this.state.cashValue) {
      this.setState({ cashValue: room.fee });
    }
    if (newProps.myTeam) {
      this.setState({ teamName: newProps.myTeam.title });
    }
  }

  componentWillUnmount() {
    this.resetPopup();
  }

  onSave() {
    const teamTitle = this.state.teamName.trim();

    this.props.onSave(this.props.myTeam, teamTitle);
    this.resetPopup();
  }

  onCancel() {
    this.props.onClose();
    this.resetPopup();
  }

  payAndPlay() {
    const teamTitle = this.state.teamName.trim();
    this.props.payAndPlay(this.props.myTeam, teamTitle, this.state.cashValue);
  }

  handlePlayFormSubmit(e) {
    e.preventDefault();
    this.onSave();
  }

  handlePayFormSubmit(e) {
    e.preventDefault();
    this.payAndPlay();
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

  handleCashValueChange(e) {
    this.setState({ cashValue: e.currentTarget.value });
  }

  resetPopup() {
    this.setState({
      teamName: null,
      cashValue: null,
      isTeamShown: true,
      isPaymentShown: false
    });
  }

  render() {
    const { user, room, intl, currentLocale } = this.props;
    const { formatMessage } = intl;
    let popupTitle = room ? `${formatMessage(messages.playLabel)} «${getPropByLocale(room.title, currentLocale)}»` : formatMessage(messages.playLabel);

    return (
      <Popup
        isOpen={this.props.isOpen}
        onClose={() => { this.onCancel(); this.resetPopup(); }}
        title={popupTitle}
      >
        <div className={s.root}>
          {/* {user && room && (user.money - room.fee < 0) ?
            <div className={s.guide}>
              <div className={cx(s.guideItem, { [s.guideItemIsActive]: this.state.isTeamShown, [s.guideItemIsDone]: this.state.isPaymentShown })}>
                <div className={s.guideTitle}>Команда</div>
                <div className={s.guideShape}></div>
              </div>
              <div className={cx(s.guideItem, { [s.guideItemIsActive]: this.state.isPaymentShown })}>
                <div className={s.guideTitle}>Баланс</div>
              </div>
            </div>
          : null} */}

          {this.state.isTeamShown ?
            <form action="" onSubmit={this.handlePlayFormSubmit.bind(this)} className={s.form}>
              <div className={s.sectionTeam}>
                {user && room && (user.money - room.fee >= 0) ?
                  <div className={s.sectionTitle}>
                  <FormattedMessage {...messages.teamTitle} />:
                  </div>
                : null }
                {user && room && (user.money - room.fee >= 0) ?
                  <div className={s.formSectionCentered}>
                    <input
                      type="text"
                      placeholder={formatMessage(messages.teamPlaceholder)}
                      value={this.state.teamName}
                      onChange={(e) => this.handleTeamNameChange(e)}
                    />
                  </div>
                : null}
                <div className={s.formSectionButtons}>
                  {user && room && (user.money - room.fee >= 0) ?
                    <div className={s.formSectionCentered}>
                      <button
                        data-gtm="play-template"
                        type="submit"
                        className={cx(s.btnSubmit, { [s.btnSubmitIsActive]: this.state.teamName && this.state.teamName.trim() !== '' })}
                      >
                        {room && room.fee ?
                          <FormattedMessage
                            {...messages.btnPlayFeeLabel}
                            values={{
                              money: `${room.fee} ${getCurrencySymbol(room.currency)}`
                            }}
                          /> :
                          <FormattedMessage {...messages.btnPlayLabel} />
                        }
                      </button>
                      <div className={s.btnCancel} onClick={() => { this.onCancel(); this.resetPopup(); }}>
                        Отмена
                      </div>
                    </div>
                  :
                    <div className={s.formWarning}>
                      <div className={s.formWarningLabel}><FormattedMessage {...messages.noMoneyLabel} /></div>
                      <Link className={cx(s.btn, { [s.btnIsActive]: true })} to="/lobby">
                        <FormattedMessage {...messages.lobbyLink} />
                      </Link>
                    </div>
                  }
                  {/* <div
                    className={cx(s.btn, { [s.btnIsActive]: this.state.teamName && this.state.teamName.trim() !== '' })}
                    onClick={ () => this.setState({ isTeamShown: false, isPaymentShown: true }) }
                  >
                    Пополнить баланс
                    <IconSVG icon="smart-arrow-right" size="13" cssClass={s.btnIcon} />
                  </div>
                  <div className={s.btnCancel} onClick={ () => { this.onCancel(); this.resetPopup(); }}>
                    Отмена
                  </div> */}
                </div>
                <div className={s.note}>
                  {user && room && (user.money - room.fee < 0) ?
                    <FormattedMessage {...messages.noMoneyNote} />
                    :
                    <FormattedMessage {...messages.moneyNote} />
                  }
                </div>
              </div>
            </form>
          : null}

          {this.state.isPaymentShown ?
            <form action="" onSubmit={this.handlePayFormSubmit.bind(this)} className={s.form}>
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
                    onKeyDown={(e) => this.handleInputKeyDown(e)}
                    onChange={(e) => this.handleCashValueChange(e)}
                  />
                </div>
                <div className={s.formSectionButtons}>
                  <button
                    type="submit"
                    className={cx(s.btnSubmit, { [s.btnSubmitIsActive]: this.state.cashValue >= (room.fee - user.money) })}
                  ><FormattedMessage {...messages.payAndPlayLabel} /></button>
                  <div
                    className={s.btnCancel}
                    onClick={() => {
                      this.onCancel();
                      this.resetPopup();
                    }}
                  ><FormattedMessage {...messages.cancelLabel} /></div>
                </div>
                <div className={s.note}>
                  * <FormattedMessage {...messages.paymentNote} />
                </div>
              </div>
            </form>
        : null}
        </div>
      </Popup>
    );
  }
}

export default injectIntl(withStyles(s)(BetPopup));
