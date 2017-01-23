import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import union from 'lodash/union';
import s from './TeamBuilder.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TeamBuilderPlayers from '../TeamBuilderPlayers';
import TeamBuilderTeam from '../TeamBuilderTeam';
import SaveTeamPopup from 'components/Popups/SaveTeamPopup';
import { getCookie, getApplicationMessage } from 'utils';
import { MY_TEAM_SIZE, MY_TEAM_GOALKEEPERS_SIZE, MY_TEAM_DEFENDERS_SIZE,
         MY_TEAM_MIDFIELDERS_SIZE, MY_TEAM_FORWARDS_SIZE } from 'constants';
import { filterRoomTeamsSelector,
  getPlayersByTeamsSelector, filterPlayersSelector } from './selectors';
import { addPlayerMyTeam, applySort, filterByPosition, filterByName,
  filterByTeams, loadMoreElementsIntoInfinitePlayersGrid,
  loadPlayerMyTeam, resetCollectTeamFilters,
  updateSelectedPlayerIndex, fetchPlayerStats } from '../../actions';
import { getMyTeam } from '../../selectors';
import { APP_MESSAGES } from 'config';
import { navigate } from 'routes/actions';
import myteamModule from 'modules/myteam';
import roomModule from 'modules/room';
import authModule from 'modules/auth';
import playersModule from 'modules/players';
import paymentModule from 'modules/payment';
import intlModule from 'modules/intl';

class TeamBuilder extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    room: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    closeSaveTeamPopup: PropTypes.func.isRequired,
    stats: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    collectTeamSort: PropTypes.object.isRequired,
    collectTeamFilter: PropTypes.object.isRequired,
    myTeam: PropTypes.object.isRequired,
    playersCountInInfiniteGrid: PropTypes.number.isRequired,
    playerStats: PropTypes.object,
    user: PropTypes.object,
    userbids: PropTypes.array,
    selectedPlayerIndex: PropTypes.number,
    selectedPlayerPosition: PropTypes.string,
    teamId: PropTypes.string,
    allPlayers: PropTypes.array,
    resetGuide: PropTypes.func.isRequired,
    openGuide: PropTypes.func.isRequired,
    isSaveTeamPopupShown: PropTypes.bool,
    currentLocale: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { dispatch, room, teamId, players, openGuide } = this.props;
    const token = getCookie('access_token');

    openGuide();

    if (!teamId) {
      const storedPlayers = (localStorage.players && room.room_id === parseInt(localStorage.roomId)) ?
        JSON.parse(localStorage.players) : [];

      if (storedPlayers.length > 0) {
        dispatch(myteamModule.actions.loadPlayerMyTeam(storedPlayers, ''));
      } else {
        this.clearMyTeam();
      }
    }

    if (teamId && token) {
      if (players.length > 0) {
        this.loadMyTeamPlayers();
      } else {
        dispatch(playersModule.actions.fetchPlayersByTeams(room.teams)).then(res => {
          if (!res.error) {
            this.loadMyTeamPlayers();
          }
        });
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetCollectTeamFilters());
  }

  loadMyTeamPlayers() {
    const { dispatch } = this.props;

    const currentBid = this.getCurrentBid();
    const myTeamPlayersSquad = union(this.loadSquad(currentBid.main, true), this.loadSquad(currentBid.reserve, false));

    dispatch(myteamModule.actions.loadPlayerMyTeam(myTeamPlayersSquad, currentBid.title));
  }

  getCurrentBid() {
    const { userbids, teamId } = this.props;
    return userbids.find(bid => bid.bid_id === parseInt(teamId));
  }

  loadSquad(squad, isMain) {
    const { players } = this.props;

    const myTeamPlayers = [];
    let tmpPlayer;

    squad.forEach(p => {
      tmpPlayer = players.find(player => player.id === p);

      if (tmpPlayer) {
        tmpPlayer.isMain = isMain;
        myTeamPlayers.push(tmpPlayer);
      }
    });

    return myTeamPlayers;
  }

  addPlayerIntoLocalStorage(player, teamId) {
    if (!teamId) {
      const storedPlayers = localStorage.players ? JSON.parse(localStorage.players) : [];
      storedPlayers.push(player);
      localStorage.players = JSON.stringify(storedPlayers);
      localStorage.roomId = this.props.room.room_id;
    }
  }

  updateStoragePlayers(template) {
    const mainPlayers = this.loadSquad(template.main, true);
    const reservePlayers = this.loadSquad(template.reserve, false);
    const team = union(mainPlayers, reservePlayers);

    localStorage.players = JSON.stringify(team);
  }

  clearMyTeam() {
    const { dispatch } = this.props;
    dispatch(myteamModule.actions.clearMyTeam());
    localStorage.setItem('players', []);
  }

  render() {
    const { dispatch, room, players, allPlayers, stats, myTeam,
      teams, teamId, collectTeamSort, collectTeamFilter, playersCountInInfiniteGrid,
      selectedPlayerIndex, selectedPlayerPosition,
      playerStats, user, currentLocale, isPlayersListActive } = this.props;
    const competitionId = room.tournaments[0];

    return (
      <div className={s.root}>
        <div className={s.content}>
          <TeamBuilderTeam teamId={teamId} />
          <TeamBuilderPlayers
            room={room}
            players={players}
            allPlayers={allPlayers}
            stats={stats}
            myTeam={myTeam}
            teams={teams}
            sort={collectTeamSort}
            filter={collectTeamFilter}
            isActiveOnMobile={isPlayersListActive}
            playersCountInInfiniteGrid={playersCountInInfiniteGrid}
            resetGuide={() => this.props.resetGuide()}
            applySort={(direction, column) =>
              dispatch(applySort(direction, column))
            }
            filterByPosition={(position) =>
              dispatch(filterByPosition(position))
            }
            filterByName={(name) =>
              dispatch(filterByName(name))
            }
            filterByTeams={(filteredTeams) =>
              dispatch(filterByTeams(filteredTeams))
            }
            loadMoreElementsIntoInfinitePlayersGrid={(count) =>
              dispatch(loadMoreElementsIntoInfinitePlayersGrid(count))
            }
            addPlayerMyTeam={(player) => {
              this.addPlayerIntoLocalStorage(player, teamId);
              dispatch(addPlayerMyTeam(player));
            }}
            competitionId={competitionId}
            playerStats={playerStats}
            fetchPlayerStats={(competition, playerId) =>
              dispatch(fetchPlayerStats(competition, playerId))
            }
            closePlayerStats={() =>
              dispatch(closePlayerStats())
            }
            updateSelectedPlayerIndex={(index, position) =>
              dispatch(updateSelectedPlayerIndex(index, position))
            }
            selectedPlayerIndex={selectedPlayerIndex}
            selectedPlayerPosition={selectedPlayerPosition}
          />
        </div>
        <SaveTeamPopup
          isOpen={this.props.isSaveTeamPopupShown}
          myTeam={myTeam}
          roomId={room.room_id}
          teamId={teamId}
          room={room}
          user={user}
          currentLocale={currentLocale}
          onClose={this.props.closeSaveTeamPopup}
          onSave={(teamPlayers, teamName, isAddToUserTemplate) => {
            if (isAddToUserTemplate) {
              dispatch(authModule.actions.addTemplate(teamPlayers, teamName, competitionId));
            }
            dispatch(roomModule.actions.sendBetRequest(teamPlayers, teamName, room.room_id))
            .then(() => {
              this.props.closeSaveTeamPopup();
              localStorage.removeItem('players');
              dispatch(navigate(`/rooms/${room.room_id}`));
            });
          }}
          onUpdate={(teamPlayers, teamName) => {
            dispatch(roomModule.actions.sendUpdateBetRequest(teamPlayers, teamName, room.room_id, teamId))
            .then((res) => {
              if (!res.error) {
                this.props.closeSaveTeamPopup();
                localStorage.removeItem('players');
                dispatch(navigate(`/rooms/${room.room_id}`));
              }
            });
          }}
          payAndPlay={(teamPlayers, teamName, cashValue, isAddToUserTemplate) => {
            if (isAddToUserTemplate) {
              dispatch(authModule.actions.addTemplate(teamPlayers, teamName, competitionId));
            }
            const token = getCookie('access_token');
            dispatch(paymentModule.actions.addDeposit(cashValue, token))
              .then((response) => {
                if (!response.error && (response.data.user.money - room.fee) >= 0) {
                  dispatch(roomModule.actions.sendBetRequest(teamPlayers, teamName, room.room_id))
                    .then((res) => {
                      if (!res.error) {
                        this.props.closeSaveTeamPopup();
                        localStorage.removeItem('players');
                        dispatch(navigate(`/rooms/${room.room_id}`));
                      }
                    });
                }
              });
          }}
          onLogin={(email, password) => {
            dispatch(authModule.actions.loginUser(email, password));
          }}
          onRegistration={(email, password, code, name) => {
            dispatch(authModule.actions.registerUser(email, password, code, name));
          }}
        />
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    myTeam: myteamModule.selectors.getMyTeam,
    room: roomModule.selectors.getRoomData,
    userbids: roomModule.selectors.getRoomUserbids,
    user: authModule.selectors.getUser,
    stats: playersModule.selectors.getPlayersStats,
    collectTeamSort: myteamModule.selectors.getCollectTeamSort,
    collectTeamFilter: myteamModule.selectors.getCollectTeamFilter,
    playerStats: myteamModule.selectors.getCollectTeamStatePlayerStats,
    playersCountInInfiniteGrid: myteamModule.selectors.getPlayersCountInInfiniteGrid,
    selectedPlayerIndex: myteamModule.selectors.getSelectedPlayerIndex,
    selectedPlayerPosition: myteamModule.selectors.getSelectedPlayerPosition,
    currentLocale: intlModule.selectors.getLocale,

    // use own selectors
    players: filterPlayersSelector,
    allPlayers: getPlayersByTeamsSelector,
    teams: filterRoomTeamsSelector
  })
)(withStyles(s)(TeamBuilder));
