import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import RoomInfo from 'components/RoomInfo';
import auth from 'modules/auth';
import tournaments from 'modules/tournaments';
import appstateModule from 'modules/appstate';
import intlModule from 'modules/intl';
import s from './Lobby.css';
import { getSpecialRooms } from '../../selectors';
import SportSwitcher from '../SportSwitcher';
import SpecialRooms from '../SpecialRooms';
import Rooms from '../Rooms';
import messages from './messages';

class Lobby extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    specialRooms: PropTypes.array,
    intl: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { dispatch, intl } = this.props;
    const { formatMessage } = intl;

    this.context.setTitle(formatMessage(messages.pageTitle));
    dispatch(tournaments.actions.fetchTournaments());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(appstateModule.actions.hideRoomInfo());
  }

  render() {
    const { user, specialRooms, currentLocale } = this.props;

    return (
      <div className={s.root}>
        <SportSwitcher />
        <Rooms />
        <SpecialRooms
          user={user}
          rooms={specialRooms}
          currentLocale={currentLocale}
        />
        <RoomInfo isRoom={false} />
      </div>
    );
  }
}

export default injectIntl(connect(
  createStructuredSelector({
    user: auth.selectors.getUser,
    specialRooms: getSpecialRooms,
    currentLocale: intlModule.selectors.getLocale,
  })
)(withStyles(s)(Lobby)));
