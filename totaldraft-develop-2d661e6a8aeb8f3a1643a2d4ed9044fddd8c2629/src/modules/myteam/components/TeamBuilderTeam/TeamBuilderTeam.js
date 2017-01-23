import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import reject from 'lodash/reject';
import groupBy from 'lodash/groupBy';
import countBy from 'lodash/countBy';
import isEmpty from 'lodash/isEmpty';
import sample from 'lodash/sample';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PlayerInfo from 'components/PlayerInfo';
import IconSVG from 'components/IconSVG';
import myteamModule from 'modules/myteam';
import playersModule from 'modules/players';
import roomModule from 'modules/room';
import appstateModule from 'modules/appstate';
import intlModule from 'modules/intl';
import { MY_TEAM_SIZE, PLAYER_POSITIONS_G, PLAYER_POSITIONS_D, PLAYER_POSITIONS_M,
         PLAYER_POSITIONS_F, MY_TEAM_GOALKEEPERS_SIZE, MY_TEAM_DEFENDERS_SIZE,
         MY_TEAM_MIDFIELDERS_SIZE, MY_TEAM_FORWARDS_SIZE
       } from '../../constants';
import { convertToMillion, checkAvailablePositionInMyTeam,
         getApplicationMessage
       } from 'utils';
import { APP_MESSAGES } from 'config';
import s from './TeamBuilderTeam.css';
import PlayersByPositionInMyTeam from '../PlayersByPositionInMyTeam';
import TeamBuilderField from '../TeamBuilderField';
import messages from './messages';
import { filterRoomTeamsSelector, filterPlayersSelector,
         getPlayersByTeamsSelector, getAvailableBudgetSelector
       } from '../TeamBuilder/selectors';

class TeamBuilderTeam extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    myTeam: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    room: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    allPlayers: PropTypes.array.isRequired,
    stats: PropTypes.array.isRequired,
    currentLocale: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    playerTeamStats: PropTypes.object,
    availableBudget: PropTypes.number,
    selectedPlayerIndex: PropTypes.number,
    selectedPlayerPosition: PropTypes.string,
    teamId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      isCompareStatsActive: false,
      isFieldViewActive: true
    };
  }

  removePlayerFromLocalStorage(player, teamId) {
    const storedPlayers = localStorage.players ? JSON.parse(localStorage.players) : [];
    const updatedPlayers = reject(storedPlayers, p => p.id === player.id);
    localStorage.players = JSON.stringify(updatedPlayers);
  }

  removePlayerFromMyTeam(player) {
    const { dispatch, teamId } = this.props;
    if (!teamId) {
      this.removePlayerFromLocalStorage(player, teamId);
    }
    dispatch(myteamModule.actions.removePlayerMyTeam(player));
  }

  openTeamPlayerStats(playerId) {
    const { dispatch, room } = this.props;
    const tournamentId = room.tournaments[0];

    dispatch(myteamModule.actions.fetchComparePlayerStats(tournamentId, playerId))
      .then(response => {
        if (!response.error && response.data.aggr) {
          setTimeout(() => this.setState({ isCompareStatsActive: true }), 100);
        } else {
          this.setState({ isCompareStatsActive: false });
        }
      });
  }

  toggleView() {
    this.setState({ isFieldViewActive: !this.state.isFieldViewActive });
  }

  clearMyTeam() {
    const { dispatch } = this.props;
    dispatch(myteamModule.actions.clearMyTeam());
    localStorage.setItem('players', []);
  }

  // Random players collecting
  checkAvailablePositionInTeam(team, player, limitPlayersFromOneTeam) {
    const randomScheme = { F: 3, M: 5, D: 5, G: 2 }; // max with reserve
    let isValid = false;

    const forwards = countBy(team, p => p.pos === 'F' ? 'count' : 'others');
    const midfielders = countBy(team, p => p.pos === 'M' ? 'count' : 'others');
    const defenders = countBy(team, p => p.pos === 'D' ? 'count' : 'others');
    const goalkeepers = countBy(team, p => p.pos === 'G' ? 'count' : 'others');

    // Validate by position
    switch (player.pos) {
      case 'F':
        isValid = isEmpty(forwards) || (!isEmpty(forwards) && !forwards.count) || (forwards.count && forwards.count < randomScheme.F);
        break;
      case 'M':
        isValid = isEmpty(midfielders) || (!isEmpty(midfielders) && !midfielders.count) || (midfielders.count && midfielders.count < randomScheme.M);
        break;
      case 'D':
        isValid = isEmpty(defenders) || (!isEmpty(defenders) && !defenders.count) || (defenders.count && defenders.count < randomScheme.D);
        break;
      case 'G':
        isValid = isEmpty(goalkeepers) || (!isEmpty(goalkeepers) && !goalkeepers.count) || (goalkeepers.count && goalkeepers.count < randomScheme.G);
        break;
      default:
        isValid = false;
    }

    // Validate by team limit
    if (this.checkNumberPlayersFromOneClub(team, player) >= limitPlayersFromOneTeam) {
      isValid = false;
    }

    return isValid;
  }

  checkPlayerGotRedCard(playerId, cards) {
    return cards && cards.indexOf(playerId) > -1;
  }

  checkNumberPlayersFromOneClub(team, player) {
    return team.reduce((c, p) => (p.team_id === player.team_id) ? c + 1 : c, 0)
  }

  fullyRandomCollection() {
    const { dispatch, room, allPlayers } = this.props;
    const availableBudget = room.plr_price_limit;
    const playersLimit = room.plr_per_team;
    let availablePlayers = allPlayers;
    let newTeam = [];

    while (newTeam.length < 15) {
      const teamPrice = newTeam.reduce((memo, player) => memo + player.price, 0);
      const budgetPerPlayerLeft = parseFloat((availableBudget - teamPrice) / (MY_TEAM_SIZE - newTeam.length)).toFixed(0);
      const isPlayerAvailable = availablePlayers.find(p => p.price <= budgetPerPlayerLeft);
      if (isPlayerAvailable) {
        const randomPlayer = sample(availablePlayers);
        if (randomPlayer.price <= budgetPerPlayerLeft
          && this.checkAvailablePositionInTeam(newTeam, randomPlayer, playersLimit)
          && !this.checkPlayerGotRedCard(randomPlayer.id, room.missing.rc)
        ) {
          let player =  { ...randomPlayer, isMain: true };
          newTeam.push(player);
          availablePlayers = reject(availablePlayers, p => p.id === player.id);
        }
      } else {
        const msg = getApplicationMessage(APP_MESSAGES.COMPLETE_TEAM_ERROR);
        dispatch(appstateModule.actions.showGlobalNotification(msg, true));
        return newTeam;
      }
    }

    // Set random reserve
    ['F', 'M', 'D', 'G'].forEach(pos => {
      const p = newTeam.find(plr => plr.pos === pos);
      p.isMain = false;
    });

    return newTeam;
  }

  completeTeam() {
    const { dispatch, room, allPlayers, myTeam } = this.props;
    const availableBudget = room.plr_price_limit;
    const playersLimit = room.plr_per_team;
    let availablePlayers = allPlayers;
    let newTeam = JSON.parse(localStorage.players);

    while (newTeam.length < 15) {
      const teamPrice = newTeam.reduce((memo, player) => memo + player.price, 0);
      const budgetPerPlayerLeft = parseFloat((availableBudget - teamPrice) / (MY_TEAM_SIZE - newTeam.length)).toFixed(0);
      const isPlayerAvailable = availablePlayers.find(p => p.price <= budgetPerPlayerLeft);
      if (isPlayerAvailable) {
        const randomPlayer = sample(availablePlayers);

        const totalMainPlayers = newTeam.reduce((c, p) => p.isMain ? c + 1 : c , 0);

        if (totalMainPlayers < 11) {
          const availablePositions = checkAvailablePositionInMyTeam(newTeam);
          // Set main players
          if (randomPlayer.price <= budgetPerPlayerLeft
            && availablePositions[randomPlayer.pos]
            && this.checkNumberPlayersFromOneClub(newTeam, randomPlayer) < playersLimit
            && !this.checkPlayerGotRedCard(randomPlayer.id, room.missing.rc)
          ) {
            let player =  { ...randomPlayer, isMain: true };
            newTeam.push(player);
            availablePlayers = reject(availablePlayers, p => p.id === player.id);
          }
        } else {
          const teamReserve = groupBy(newTeam, p => !p.isMain ? p.pos : 'main');
          if (randomPlayer.price <= budgetPerPlayerLeft
            && !teamReserve[randomPlayer.pos]
            && this.checkNumberPlayersFromOneClub(newTeam, randomPlayer) < playersLimit
            && !this.checkPlayerGotRedCard(randomPlayer.id, room.missing.rc)
          ) {
            let player =  { ...randomPlayer, isMain: false };
            newTeam.push(player);
            availablePlayers = reject(availablePlayers, p => p.id === player.id);
          }
        }
      } else {
        const msg = getApplicationMessage(APP_MESSAGES.COMPLETE_TEAM_ERROR);
        dispatch(appstateModule.actions.showGlobalNotification(msg, true));
        return newTeam;
      }
    }

    return newTeam;
  }

  randomCollectTeam() {
    const { dispatch } = this.props;
    const currentTeam = localStorage.players ? JSON.parse(localStorage.players) : [];
    const team = currentTeam.length === 0 ? this.fullyRandomCollection() : this.completeTeam();

    // Set up new team
    if (team.length === MY_TEAM_SIZE) {
      this.clearMyTeam();
      dispatch(myteamModule.actions.loadPlayerMyTeam(team, ''));
      localStorage.players = JSON.stringify(team);
    }
  }

  render() {
    const { dispatch, myTeam, teamId, intl } = this.props;
    const { formatMessage } = intl;
    const myTeamSize = myTeam.players.length;
    const availableBudget = this.props.availableBudget;
    const convertedBudget = convertToMillion(availableBudget);
    const budgetPerPlayerLeft = parseFloat(availableBudget / (MY_TEAM_SIZE - myTeamSize)).toFixed(0);
    const groupedPlayersByPosition = groupBy(myTeam.players, player => player.pos);

    return (
      <section className={cx(s.root, { [s.isFieldView]: this.state.isFieldViewActive })}>
        <img className={s.propImg} src="/images/football-field-proportions.png" role="presentation" />
        <section className={s.content}>
          <header className={s.header} >
            <div className={s.titleBlock}>
              <div className={s.title}>{teamId ? myTeam.title : <FormattedMessage {...messages.title} />} {myTeamSize} / 15</div>
              <div
                className={cx(s.changeViewControl, { [s.tableView]: this.state.isFieldViewActive })}
                onClick={() => this.toggleView()}
                title={formatMessage(messages.switchLabel)}
              >
                <IconSVG size="28" icon="list-view-icon" cssClass={s.controlIconList} />
                <IconSVG size="24" icon="table-view-icon" cssClass={s.controlIconTable} />
                <div className={s.changeViewControlShape}>
                  {this.state.isFieldViewActive
                    ? <IconSVG size="24" icon="table-view-icon" cssClass={s.shapeIcon} />
                    : <IconSVG size="28" icon="list-view-icon" cssClass={s.shapeIcon} />
                  }
                </div>
              </div>
            </div>
            <div className={s.info}>
              <div className={s.budgetLabel}>
                <span className={cx(s.infoLabel, { [s.overBudget]: availableBudget < 0 })}>
                  <FormattedMessage {...messages.availableBudget} />:
                </span>
                <span className={cx(s.infoText, { [s.overBudget]: availableBudget < 0 })}>
                  {convertedBudget}
                </span>
                {availableBudget < 0
                  ? <div className={s.budgetShape}>!</div>
                : null}
              </div>
              {myTeamSize === MY_TEAM_SIZE ?
                (<div className={s.clearTeamBtnIsActive} onClick={() => this.clearMyTeam()}>
                  <FormattedMessage {...messages.clearTeamLabel} />
                </div>)
                :
                (<div className={s.clearTeamBtn} onClick={() => this.randomCollectTeam()}>
                  {myTeamSize > 0
                    ? <FormattedMessage {...messages.completeTeam} />
                    : <FormattedMessage {...messages.randomCollectTeam} />
                  }
                </div>)
              }
            </div>
          </header>
          <div className={s.wrapper}>
            {this.state.isFieldViewActive ?
              <TeamBuilderField
                myTeam={this.props.myTeam}
                teams={this.props.teams}
                budgetPerPlayer={budgetPerPlayerLeft}
                filterByPosition={(position) => dispatch(myteamModule.actions.filterByPosition(position))}
                swapPlayersMyTeam={(source, dest) => dispatch(myteamModule.actions.swapPlayersMyTeam(source, dest))}
                removePlayerFromMyTeam={(player) => this.removePlayerFromMyTeam(player)}
                openTeamPlayerStats={(playerId) => this.openTeamPlayerStats(playerId)}
              />
              :
              <div className={s.teammates} id="myTeamList">
                <PlayersByPositionInMyTeam
                  title={formatMessage(messages.posForwards)}
                  position={PLAYER_POSITIONS_F}
                  myTeam={myTeam}
                  players={groupedPlayersByPosition}
                  maxCount={MY_TEAM_FORWARDS_SIZE}
                  budgetPerPlayer={budgetPerPlayerLeft}
                  filterByPosition={(position) => dispatch(myteamModule.actions.filterByPosition(position))}
                  teams={this.props.teams}
                  currentLocale={this.props.currentLocale}
                  updateSelectedPlayerIndex={(index, position) =>
                    dispatch(myteamModule.actions.updateSelectedPlayerIndex(index, position))
                  }
                  cssID={'forward'}
                  removePlayerMyTeam={(player) => this.removePlayerFromMyTeam(player)}
                  selectedPlayerIndex={this.props.selectedPlayerIndex}
                  selectedPlayerPosition={this.props.selectedPlayerPosition}
                  openTeamPlayerStats={playerId =>
                    this.openTeamPlayerStats(playerId)
                  }
                />
                <PlayersByPositionInMyTeam
                  title={formatMessage(messages.posMidfielders)}
                  position={PLAYER_POSITIONS_M}
                  myTeam={myTeam}
                  players={groupedPlayersByPosition}
                  maxCount={MY_TEAM_MIDFIELDERS_SIZE}
                  budgetPerPlayer={budgetPerPlayerLeft}
                  filterByPosition={(position) => dispatch(myteamModule.actions.filterByPosition(position))}
                  teams={this.props.teams}
                  currentLocale={this.props.currentLocale}
                  updateSelectedPlayerIndex={(index, position) =>
                    dispatch(myteamModule.actions.updateSelectedPlayerIndex(index, position))
                  }
                  cssID={'midfielder'}
                  removePlayerMyTeam={(player) => this.removePlayerFromMyTeam(player)}
                  selectedPlayerIndex={this.props.selectedPlayerIndex}
                  selectedPlayerPosition={this.props.selectedPlayerPosition}
                  openTeamPlayerStats={playerId =>
                    this.openTeamPlayerStats(playerId)
                  }
                />
                <PlayersByPositionInMyTeam
                  title={formatMessage(messages.posDefenders)}
                  position={PLAYER_POSITIONS_D}
                  myTeam={myTeam}
                  players={groupedPlayersByPosition}
                  maxCount={MY_TEAM_DEFENDERS_SIZE}
                  budgetPerPlayer={budgetPerPlayerLeft}
                  filterByPosition={(position) => dispatch(myteamModule.actions.filterByPosition(position))}
                  teams={this.props.teams}
                  currentLocale={this.props.currentLocale}
                  updateSelectedPlayerIndex={(index, position) =>
                    dispatch(myteamModule.actions.updateSelectedPlayerIndex(index, position))
                  }
                  cssID={'defender'}
                  removePlayerMyTeam={(player) => this.removePlayerFromMyTeam(player)}
                  selectedPlayerIndex={this.props.selectedPlayerIndex}
                  selectedPlayerPosition={this.props.selectedPlayerPosition}
                  openTeamPlayerStats={playerId =>
                    this.openTeamPlayerStats(playerId)
                  }
                />
                <PlayersByPositionInMyTeam
                  title={formatMessage(messages.posGoalkeepers)}
                  players={groupedPlayersByPosition}
                  position={PLAYER_POSITIONS_G}
                  myTeam={myTeam}
                  maxCount={MY_TEAM_GOALKEEPERS_SIZE}
                  myTeamSize={myTeam.players.length}
                  budgetPerPlayer={budgetPerPlayerLeft}
                  filterByPosition={(position) => dispatch(myteamModule.actions.filterByPosition(position))}
                  teams={this.props.teams}
                  currentLocale={this.props.currentLocale}
                  updateSelectedPlayerIndex={(index, position) =>
                    dispatch(myteamModule.actions.updateSelectedPlayerIndex(index, position))
                  }
                  cssID={'goalkeeper'}
                  removePlayerMyTeam={(player) => this.removePlayerFromMyTeam(player)}
                  selectedPlayerIndex={this.props.selectedPlayerIndex}
                  selectedPlayerPosition={this.props.selectedPlayerPosition}
                  openTeamPlayerStats={playerId =>
                    this.openTeamPlayerStats(playerId)
                  }
                />
              </div>
            }
          </div>
        </section>
        <PlayerInfo
          isCompareMode
          isActive={this.state.isCompareStatsActive}
          removePlayerMyTeam={(player) => this.removePlayerFromMyTeam(player)}
          allPlayers={this.props.allPlayers}
          teams={this.props.teams}
          stats={this.props.stats}
          playerStats={this.props.playerTeamStats}
          closePlayerStats={() => this.setState({ isCompareStatsActive: false }) }
        />
      </section>
    );
  }
}

export default injectIntl(
  connect(
    createStructuredSelector({
      teams: filterRoomTeamsSelector,
      players: filterPlayersSelector,
      allPlayers: getPlayersByTeamsSelector,
      availableBudget: getAvailableBudgetSelector,
      room: roomModule.selectors.getRoomData,
      myTeam: myteamModule.selectors.getMyTeam,
      playerTeamStats: myteamModule.selectors.getCollectTeamStateComparePlayerStats,
      selectedPlayerIndex: myteamModule.selectors.getSelectedPlayerIndex,
      selectedPlayerPosition: myteamModule.selectors.getSelectedPlayerPosition,
      stats: playersModule.selectors.getPlayersStats,
      currentLocale: intlModule.selectors.getLocale
    })
  )(withStyles(s)(TeamBuilderTeam))
);
