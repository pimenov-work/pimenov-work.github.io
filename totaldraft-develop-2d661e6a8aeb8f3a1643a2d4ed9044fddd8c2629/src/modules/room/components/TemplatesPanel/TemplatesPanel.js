import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import groupBy from 'lodash/groupBy';
import union from 'lodash/union';
import s from './TemplatesPanel.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IconSVG from 'components/IconSVG';
import Link from 'components/Link';
import TemplateDeletePopup from 'components/Popups/TemplateDeletePopup';
import InvalidBidPopup from 'components/Popups/InvalidBidPopup';
import BetPopup from 'components/Popups/BetPopup';
import Template from './Template';
import { getRoomData } from '../../selectors';
import authModule from 'modules/auth';
import teamsModule from 'modules/teams';
import roomModule from 'modules/room';
import playersModule from 'modules/players';
import intlModule from 'modules/intl';
import { DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM } from 'config';
import { getCookie } from 'utils';
import { navigate } from 'routes/actions';
import messages from './messages';

class TemplatesPanel extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    templates: PropTypes.array,
    players: PropTypes.array,
    teams: PropTypes.array,
    room: PropTypes.object.isRequired,
    onClosePanel: PropTypes.func.isRequired,
    openTeamDetails: PropTypes.func,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isDeleteTemplateShown: false,
      isBetPopupShown: false,
      isInvalidBidPopupShown: false,
      invalidBidMessage: null,
      bidToPopup: null,
    };
  }

  deleteTemplateOnSubmit(template) {
    const { dispatch } = this.props;
    const token = getCookie('access_token');

    dispatch(authModule.actions.deleteTemplate(template.template_id, token)).then(res => {
      if (res) {
        dispatch(authModule.actions.fetchUserTemplates(token));
        this.setState({ isDeleteTemplateShown: false, bidToPopup: null });
      }
    });
  }

  getInvalidReason(template) {
    const { room } = this.props;

    if (this.isPlayersStillExistAndValid(template.main) && this.isPlayersStillExistAndValid(template.reserve)) {
      if (!this.isUserTemplateFitsOnBudgetOfRoom(template)) {
        this.setState({ invalidBidMessage: <FormattedMessage {...messages.errorPlayersRevoked} values ={{ budget: `${room ? room.plr_price_limit : ''}` }}/> });
      } else if (!this.isUserTemplateFitsOnMaxPlayersCountFromOneTeam(template)) {
        this.setState({ invalidBidMessage: <FormattedMessage {...messages.errorNumPlayersFromOneTeam} />  });
      }
    } else {
      this.setState({ invalidBidMessage: <FormattedMessage {...messages.errorPlayersRevoked} /> });
    }
  }

  makeABet(template) {
    if (!this.isUserTemplateValid(template)) {
      this.getInvalidReason(template);
      this.setState({ isInvalidBidPopupShown: true, bidToPopup: template });
    } else {
      this.setState({ bidToPopup: template });
      setTimeout(() => {
        this.setState({ isBetPopupShown: true });
      }, 100);
    }
  }

  makeBetRequest(teamPlayers, teamName) {
    const { dispatch, room, onClosePanel } = this.props;
    const token = getCookie('access_token');

    dispatch(roomModule.actions.sendBetRequest(teamPlayers, teamName, room.room_id)).then(res => {
      if (!res.error) {
        dispatch(roomModule.actions.fetchUserBids(room.room_id, token));
        dispatch(roomModule.actions.fetchRoom(room.room_id));
        dispatch(roomModule.actions.fetchRoomBids(room.room_id));
        onClosePanel();
      }
    });
  }

  payAndPlay(teamPlayers, teamName, cashValue) {
    const { dispatch, room } = this.props;
    const token = getCookie('access_token');

    dispatch(paymentModule.actions.addDeposit(cashValue, token)).then(response => {
      if (!response.error && (response.data.user.money - room.fee) >= 0) {
        this.makeBetRequest(teamPlayers, teamName);
      }
    });
  }

  isUserTemplateValid(template) {
    return this.isPlayersStillExistAndValid(template.main) &&
           this.isPlayersStillExistAndValid(template.reserve) &&
           this.isUserTemplateFitsOnBudgetOfRoom(template) &&
           this.isUserTemplateFitsOnMaxPlayersCountFromOneTeam(template);
  }

  isUserTemplateFitsOnBudgetOfRoom(bid) {
    const { room } = this.props;
    let totalPriceOfUserTeam = bid.main.reduce((memo, myTeamPlayerId) => memo + this.getPlayerPriceById(myTeamPlayerId), 0);
    totalPriceOfUserTeam = bid.reserve.reduce((memo, myTeamPlayerId) => memo + this.getPlayerPriceById(myTeamPlayerId), totalPriceOfUserTeam);
    return (room && totalPriceOfUserTeam <= room.plr_price_limit);
  }

  isUserTemplateFitsOnMaxPlayersCountFromOneTeam(bid, maxPlayersFromOneTeam = DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM) {
    const { room } = this.props;
    if (room) {
      maxPlayersFromOneTeam = room.plr_per_team;
    }
    return this.getTeamsIdsWhichNotFitsOnMaxPlayersCount(bid, maxPlayersFromOneTeam).length === 0;
  }

  isPlayersStillExistAndValid(myTeamPlayers) {
    const { players, teams } = this.props;
    return myTeamPlayers.every(myTeamPlayer => {
      return players.some(p => myTeamPlayer === p.id && teams.find(team => team.team_id === p.team_id));
    });
  }

  updateStoragePlayers(template) {
    const mainPlayers = this.loadSquad(template.main, true);
    const reservePlayers = this.loadSquad(template.reserve, false);
    const team = union(mainPlayers, reservePlayers);

    localStorage.players = JSON.stringify(team);
  }

  loadSquad(squad, isMain) {
    const { players, teams } = this.props;

    const myTeamPlayers = [];
    let tmpPlayer;

    squad.forEach(p => {
      tmpPlayer = players.find(player => player.id === p);

      if (tmpPlayer && teams.find(team => tmpPlayer.team_id === team.team_id) ) {
        tmpPlayer.isMain = isMain;
        myTeamPlayers.push(tmpPlayer);
      }
    });
    return myTeamPlayers;
  }

  getPlayerById(playerId) {
    return this.props.players.find(player => player.id === playerId);
  }

  getPlayerPriceById(playerId) {
    return this.getPlayerById(playerId).price || 0;
  }

  getTeamsIdsWhichNotFitsOnMaxPlayersCount(bid, maxPlayersFromOneTeam = DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM) {
    const { room } = this.props;

    const teamsIds = [];
    const teamPlayers = [];

    if (room) {
      maxPlayersFromOneTeam = room.plr_per_team;
    }

    if (bid && bid.main && bid.reserve) {
      bid.main.forEach(playerId => teamPlayers.push(this.getPlayerById(playerId)));
      bid.reserve.forEach(playerId => teamPlayers.push(this.getPlayerById(playerId)));

      const groupedPlayersByTeam = groupBy(teamPlayers, player => player ? player.team_id : null);

      for (let teamId in groupedPlayersByTeam) {
        if (groupedPlayersByTeam[teamId].length > maxPlayersFromOneTeam) {
          teamsIds.push(parseInt(teamId, 10));
        }
      }
    }

    return teamsIds;
  }

  render() {
    const { isActive, templates, room, user, currentLocale } = this.props;

    return (
      <section className={cx(s.root, { [s.isActive]: isActive })}>
        <header className={s.header}>
          <div className={s.headerSection}>
            <div className={s.headerTitle}>
              <div className={s.headerClose} onClick={this.props.onClosePanel}>
                <IconSVG icon="smart-arrow-left" size="22" cssClass={s.dismissBtn} />
              </div>
              <div className={s.headerText}>
                <FormattedMessage {...messages.addTeamLabel} />
              </div>
            </div>
          </div>
        </header>
        <Link to={`/rooms/${room.room_id}/teams`} className={s.teamAddBtn}>
          <FormattedMessage {...messages.collectTeamLabel} />
        </Link>
        <header className={s.sectionHeader}>
          <FormattedMessage {...messages.useTeamLabel} />
        </header>
        <div className={s.templates}>
          {templates ? templates.map((template) =>
            <Template
              template={template}
              isUserTemplateValid={(template) => this.isUserTemplateValid(template)}
              key={template.template_id}
              makeABet={() => this.makeABet(template)}
              openTeamDetails={(template) => this.props.openTeamDetails(template)}
              openDeleteTemplatePopup={() => this.setState({ bidToPopup: template, isDeleteTemplateShown: true })}
            />
          ) : null}
        </div>

        <TemplateDeletePopup
          isOpen={this.state.isDeleteTemplateShown}
          template={this.state.bidToPopup}
          onSubmit={(template) => this.deleteTemplateOnSubmit(template)}
          onClose={() => this.setState({ isDeleteTemplateShown: false, bidToPopup: null })}
        />

        <BetPopup
          isOpen={this.state.isBetPopupShown}
          myTeam={this.state.bidToPopup}
          roomId={room.room_id}
          room={room}
          user={user}
          currentLocale={currentLocale}
          onSave={(teamPlayers, teamName) => {
            this.makeBetRequest(teamPlayers, teamName);
            this.setState({ isTemplatesPanelShown: false, isBetPopupShown: false, bidToPopup: null });
          }}
          payAndPlay={(teamPlayers, teamName, cashValue) => {
            this.payAndPlay(teamPlayers, teamName, cashValue);
            this.setState({ isTemplatesPanelShown: false, isBetPopupShown: false, bidToPopup: null });
          }}
          onClose={() => this.setState({ isBetPopupShown: false, bidToPopup: null })}
        />

        <InvalidBidPopup
          isOpen={this.state.isInvalidBidPopupShown}
          bid={this.state.bidToPopup}
          note={this.state.invalidBidMessage}
          onSubmit={(template) => {
            const { dispatch } = this.props;
            localStorage.setItem('roomId', room.room_id);
            this.updateStoragePlayers(template);
            dispatch(navigate(`/rooms/${room.room_id}/teams`))
          }}
          onClose={() => this.setState({ isInvalidBidPopupShown: false, bidToPopup: null })}
        />
      </section>
    );
  }
}

export default connect(
  createStructuredSelector({
    room: getRoomData,
    user: authModule.selectors.getUser,
    teams: teamsModule.selectors.getTeams,
    players: playersModule.selectors.getPlayers,
    templates: authModule.selectors.getUserTemplates,
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(TemplatesPanel));
