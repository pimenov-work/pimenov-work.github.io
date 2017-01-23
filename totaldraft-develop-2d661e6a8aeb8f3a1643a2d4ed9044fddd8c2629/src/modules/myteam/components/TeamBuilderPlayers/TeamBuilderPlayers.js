import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import groupBy from 'lodash/groupBy';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { checkAvailablePositionInMyTeam, convertToMillion } from 'utils';
import intlModule from 'modules/intl';
import s from './TeamBuilderPlayers.css';
import TeamDropdown from '../TeamDropdown';
import PlayersFilter from '../PlayersFilter';
import PlayersList from '../PlayersList';
import PlayerInfo from 'components/PlayerInfo';
import SearchBlock from 'components/SearchBlock';
import { PLAYER_POSITIONS_G, PLAYER_POSITIONS_D, PLAYER_POSITIONS_M,
  PLAYER_POSITIONS_F, MY_TEAM_GOALKEEPERS_SIZE, MY_TEAM_DEFENDERS_SIZE,
  MY_TEAM_MIDFIELDERS_SIZE, MY_TEAM_FORWARDS_SIZE, MY_TEAM_SIZE } from '../../constants';
import messages from './messages';
import { getAvailableBudgetSelector } from '../TeamBuilder/selectors';

class TeamBuilderPlayers extends Component {

  static propTypes = {
    players: PropTypes.array.isRequired,
    stats: PropTypes.array.isRequired,
    myTeam: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    applySort: PropTypes.func.isRequired,
    filterByPosition: PropTypes.func.isRequired,
    filterByTeams: PropTypes.func.isRequired,
    filterByName: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired,
    playersCountInInfiniteGrid: PropTypes.number.isRequired,
    loadMoreElementsIntoInfinitePlayersGrid: PropTypes.func.isRequired,
    addPlayerMyTeam: PropTypes.func.isRequired,
    updateSelectedPlayerIndex: PropTypes.func.isRequired,
    competitionId: PropTypes.number.isRequired,
    playerStats: PropTypes.object,
    fetchPlayerStats: PropTypes.func.isRequired,
    selectedPlayerIndex: PropTypes.number,
    selectedPlayerPosition: PropTypes.string,
    allPlayers: PropTypes.array,
    resetGuide: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    isActiveOnMobile: PropTypes.bool,
    availableBudget: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      playerInfoIsShown: false
    };
  }

  getGroupedMyTeamPlayersByPosition() {
    return groupBy(this.props.myTeam.players, p => p.pos);
  }

  getIsAllowAddByPosition(player) {
    const { players } = this.props.myTeam;

    let isAllowAddByPosition = players.length === 0;

    if (players.length > 0) {
      const groupPlayersByPosition = this.getGroupedMyTeamPlayersByPosition();

      if (groupPlayersByPosition[player.pos]) {
        switch (player.pos) {
          case PLAYER_POSITIONS_G:
            isAllowAddByPosition = groupPlayersByPosition[PLAYER_POSITIONS_G].length < MY_TEAM_GOALKEEPERS_SIZE;
            break;
          case PLAYER_POSITIONS_D:
            isAllowAddByPosition = groupPlayersByPosition[PLAYER_POSITIONS_D].length < MY_TEAM_DEFENDERS_SIZE;
            break;
          case PLAYER_POSITIONS_M:
            isAllowAddByPosition = groupPlayersByPosition[PLAYER_POSITIONS_M].length < MY_TEAM_MIDFIELDERS_SIZE;
            break;
          case PLAYER_POSITIONS_F:
            isAllowAddByPosition = groupPlayersByPosition[PLAYER_POSITIONS_F].length < MY_TEAM_FORWARDS_SIZE;
            break;
          default:
            isAllowAddByPosition = false;
        }
      } else {
        isAllowAddByPosition = true;
      }
    }

    return isAllowAddByPosition;
  }

  openPlayerInfo() {
    this.setState({ playerInfoIsShown: true });
  }

  closePlayerInfo() {
    this.setState({ playerInfoIsShown: false });
  }

  getPlayerIndex(player) {
    if (player.pos === this.props.selectedPlayerPosition && this.props.selectedPlayerIndex) {
      return this.props.selectedPlayerIndex;
    } else {
      const playersGroupedByPosition = groupBy(this.props.myTeam.players, p => p.pos);
      const playersForPosition = playersGroupedByPosition[player.pos];
      if (playersForPosition) {
        for (let i = 0; i < 5; i++) {
          if (!playersForPosition.some(p => p.index === i)) {
            return i;
          }
        }
      }
    }
  }

  getPlayerTeamStatus(player) {
    const availablePositions = checkAvailablePositionInMyTeam(this.props.myTeam.players);
    return availablePositions[player.pos];
  }

  addPlayerIntoMyTeam(player) {
    if (this.getIsAllowAddByPosition(player)) {
      player.isMain = this.getPlayerTeamStatus(player); // true or false
      player.index = this.getPlayerIndex(player); // TODO: Check this method later. Is return wrong index?
      this.props.addPlayerMyTeam(player);
      this.props.updateSelectedPlayerIndex(null, null);
      this.scrollToElement(player);
      this.closePlayerInfo();
    }
  }

  scrollToElement(player) {
    let cssSelector;
    switch (player.pos) {
      case PLAYER_POSITIONS_G:
        cssSelector = 'goalkeeper';
        break;
      case PLAYER_POSITIONS_D:
        cssSelector = 'defender';
        break;
      case PLAYER_POSITIONS_M:
        cssSelector = 'midfielder';
        break;
      case PLAYER_POSITIONS_F:
        cssSelector = 'forward';
        break;
      default:
        break;
    }
    if (document && document.getElementById('myTeamList')) {
      document.getElementById('myTeamList').scrollTop = document.getElementById(cssSelector).offsetParent.offsetTop;
    }
  }

  render() {
    const currentTeamSize = this.props.myTeam.players.length;
    const availableBudget = this.props.availableBudget;
    const convertedBudget = convertToMillion(availableBudget);
    const playersLeft = MY_TEAM_SIZE === currentTeamSize ? 1 : MY_TEAM_SIZE - currentTeamSize;
    const budgetPerPlayerLeft = convertToMillion(parseFloat(availableBudget / playersLeft).toFixed(0));

    return (
      <section className={cx(s.root, { [s.isActiveOnMobile]: this.props.isActiveOnMobile })}>
        <header className={s.header}>
          <SearchBlock
            handleSearchChange={value => this.props.filterByName(value)}
            white
          />
          <div className={s.titleBlock}>
            <div className={s.title}>
              <FormattedMessage {...messages.title} />
            </div>
            <TeamDropdown
              filter={this.props.filter}
              filterByTeams={this.props.filterByTeams}
              teams={this.props.teams}
              room={this.props.room}
              currentLocale={this.props.currentLocale}
            />
            <div className={s.mobileBudget}>
              <div className={s.mobileBudgetItem}>
                <div className={s.mobileBudgetLabel}>Бюджет:</div>{convertedBudget}
              </div>
              <div className={s.mobileBudgetItem}>
                <div className={s.mobileBudgetLabel}>На игрока:</div>{budgetPerPlayerLeft}
              </div>
            </div>
          </div>
          <PlayersFilter
            filter={this.props.filter}
            filterByPosition={this.props.filterByPosition}
          />
        </header>
        <PlayersList
          room={this.props.room}
          players={this.props.players}
          stats={this.props.stats}
          myTeam={this.props.myTeam}
          teams={this.props.teams}
          sort={this.props.sort}
          addPlayerIntoMyTeam={player => this.addPlayerIntoMyTeam(player)}
          applySort={this.props.applySort}
          playersCountInInfiniteGrid={this.props.playersCountInInfiniteGrid}
          loadMoreElementsIntoInfinitePlayersGrid={this.props.loadMoreElementsIntoInfinitePlayersGrid}
          addPlayerMyTeam={this.props.addPlayerMyTeam}
          openPlayerInfo={() => this.openPlayerInfo()}
          competitionId={this.props.competitionId}
          fetchPlayerStats={this.props.fetchPlayerStats}
          resetGuide={this.props.resetGuide}
        />
        <PlayerInfo
          isActive={this.state.playerInfoIsShown}
          room={this.props.room}
          players={this.props.players}
          allPlayers={this.props.allPlayers}
          teams={this.props.teams}
          stats={this.props.stats}
          playerStats={this.props.playerStats}
          addPlayerMyTeam={this.props.addPlayerMyTeam}
          addPlayerIntoMyTeam={player => this.addPlayerIntoMyTeam(player)}
          closePlayerStats={() => this.closePlayerInfo() }
        />
      </section>
    );
  }
}

export default connect(
  createStructuredSelector({
    availableBudget: getAvailableBudgetSelector,
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(TeamBuilderPlayers));
