import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TeamBuilder from 'modules/myteam/components/TeamBuilder';
import RoomHeader from 'modules/room/components/RoomHeader';
import RoomInfo from 'components/RoomInfo';
import TeamBuilderProgress from 'modules/myteam/components/TeamBuilderProgress';
import Schedule from 'components/Schedule';
import TournamentTable from 'components/TournamentTable/TournamentTable.js';
import IconSVG from 'components/IconSVG';
import NewsFeed from 'components/RoomPage/NewsFeed';
import { getCookie, getPropByLocale } from 'utils';
import { navigate } from 'routes/actions';
import tournamentsModule from 'modules/tournaments';
import teamsModule from 'modules/teams';
import playersModule from 'modules/players';
import roomModule from 'modules/room';
import appstateModule from 'modules/appstate';
import authModule from 'modules/auth';
import myteamModule from 'modules/myteam';
import intlModule from 'modules/intl';
import s from './RoomPage.css';
import RoomTeams from '../RoomTeams';
import RoomUsers from '../RoomUsers';
import MobilePanel from '../MobilePanel';
import MobileRoomNav from '../MobileRoomNav';
import { getRoomData, getRoomPrizes,
  filterRoomTeamsSelector, filterRoomMembersSelector,
  getAvailableBudgetSelector, getIsTeamCompleteSelector,
  getRoomUserbids } from '../../selectors';
import messages from './messages';

class RoomPage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    room: PropTypes.object.isRequired,
    user: PropTypes.object,
    teamBuilderEnabled: PropTypes.bool,
    teamId: PropTypes.string,
    bids: PropTypes.array,
    userbids: PropTypes.array,
    isTeamComplete: PropTypes.bool,
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    isNewsShown: PropTypes.bool,
    isScheduleShown: PropTypes.bool,
    isTournamentTableShown: PropTypes.bool,
    prizes: PropTypes.array,
    tournaments: PropTypes.array.isRequired,
    allTournamentTeams: PropTypes.array.isRequired,
    currentLocale: PropTypes.string.isRequired,
    availableBudget: PropTypes.number.isRequired,
    myTeam: PropTypes.object,
    collectFilter: PropTypes.object,
    mobileState: PropTypes.object,
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  static childContextTypes = {
    getPlayerAchievements: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      bids: props.bids,
      isSaveTeamPopupShown: false,
      isGuideShown: false,
      isContentActive: true,
      isAsideActive: false
    };
  }

  getChildContext() {
    return {
      getPlayerAchievements: (playerId) => this.getPlayerAchievements(playerId)
    };
  }

  componentWillMount() {
    const { dispatch, room, user, currentLocale } = this.props;

    this.context.setTitle(getPropByLocale(room.title, currentLocale));

    dispatch(tournamentsModule.actions.fetchTournaments());

    dispatch(teamsModule.actions.fetchTeams(room.tournaments)).then(teams => {
      const teamIds = [];
      if (teams.length > 0) {
        teams.forEach(t => teamIds.push(t.team_id));
        dispatch(playersModule.actions.fetchPlayersByTeams(teamIds));
      }
    });

    let matches = [];
    room.matches.forEach(m => matches.push(m.match_id));
    dispatch(roomModule.actions.fetchStatsByMatches(matches));

    if (!user) {
      this.setState({ isGuideShown: true });
    }
  }

  componentWillReceiveProps(newProps) {
    const { dispatch, user, room, teamBuilderEnabled } = this.props;
    const token = getCookie('access_token');

    if (!user && newProps.user && token) {
      dispatch(roomModule.actions.fetchUserBids(room.room_id, token));
    }

    if ((!teamBuilderEnabled && newProps.teamBuilderEnabled) || (teamBuilderEnabled && !newProps.teamBuilderEnabled)) {
      this.mobileMenuOnClick('participants');
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(roomModule.actions.filterRoomBids('')); // TODO: Fix it
  }

  getPlayerAchievements(playerId) {
    const { room } = this.props;

    const injures = room.missing.ij;
    const rc = room.missing.rc;

    const injuryIcon = injures && injures.indexOf(playerId) > -1 ? <IconSVG icon="player-injure-icon" size="12" /> : null;
    const redCardIcon = rc && rc.indexOf(playerId) > -1 ? <IconSVG icon="red-card-icon" size="14" /> : null;

    const achievements = injuryIcon || redCardIcon ? (<div>{injuryIcon}{redCardIcon}</div>) : null;

    return achievements;
  }

  resetGuide() {
    if (this.state.isGuideShown) {
      this.setState({ isGuideShown: false });
    }
  }

  openGuide() {
    const { user } = this.props;

    if (!user) {
      this.setState({ isGuideShown: true });
    }
  }

  openTournamentInfo(index) {
    const { dispatch } = this.props;

    switch (index) {
      case 'news':
        dispatch(appstateModule.actions.showNews());
        dispatch(appstateModule.actions.hideSchedule());
        dispatch(appstateModule.actions.hideTournamentTable());
        break;
      case 'schedule':
        dispatch(appstateModule.actions.showSchedule());
        dispatch(appstateModule.actions.hideNews());
        dispatch(appstateModule.actions.hideTournamentTable());
        break;
      case 'table':
        dispatch(appstateModule.actions.showTournamentTable());
        dispatch(appstateModule.actions.hideSchedule());
        dispatch(appstateModule.actions.hideNews());
        break;
      default:
        return;
    }
  }

  openRoomInfo() {
    const { dispatch, room, prizes } = this.props;
    dispatch(roomModule.actions.fetchRoomBids(room.room_id))
      .then(resp => {
        if (!resp.error) {
          dispatch(appstateModule.actions.setRoomInfoData(room, prizes, resp.data.bids));
          dispatch(appstateModule.actions.showRoomInfo());
        }
      });
  }

  mobileMenuOnClick(sectionName) {
    if (sectionName === 'participants') {
      this.setState({ isContentActive: true, isAsideActive: false });
    } else {
      this.openTournamentInfo(sectionName);
      this.setState({ isContentActive: false, isAsideActive: true });
    }
  }

  render() {
    const { dispatch, room, userbids,
      teams, isNewsShown, isScheduleShown, isTournamentTableShown,
      tournaments, teamBuilderEnabled, collectFilter,
      myTeam, isTeamComplete, allTournamentTeams, teamId,
      currentLocale, availableBudget, mobileState } = this.props;

    const roundMatches = room.matches;
    const tournament = tournaments.find(t => t.tournament_id === room.tournaments[0]);

    const newsClass = cx([s.pageList__Link], { [s.isActive]: isNewsShown });
    const scheduleClass = cx([s.pageList__Link], { [s.isActive]: isScheduleShown });
    const tournamentTableClass = cx([s.pageList__Link], { [s.isActive]: isTournamentTableShown });
    const tournamentInfoClass = cx([s.tournamentInfo], { [s.isAtTeamBuilder]: teamBuilderEnabled });

    return (
      <div className={s.root} onClick={() => this.resetGuide()}>
        <RoomHeader
          room={room}
          teamId={teamId}
          tournaments={tournaments}
          currentLocale={currentLocale}
          isCollectTeam={teamBuilderEnabled}
          isTeamComplete={isTeamComplete}
          openRoomDetails={() => this.openRoomInfo()}
          openSaveTeamPopup={() => this.setState({ isSaveTeamPopupShown: true })}
        />
        <div className={s.container}>
          <MobileRoomNav
            teamBuilderEnabled={teamBuilderEnabled}
            isContentActive={this.state.isContentActive}
            isScheduleShown={isScheduleShown}
            isTournamentTableShown={isTournamentTableShown}
            isNewsShown={isNewsShown}
            onMenuClick={(name) => this.mobileMenuOnClick(name)}
          />
          <div className={cx(s.content, { [s.contentIsHidden]: !this.state.isContentActive })}>
            {!teamBuilderEnabled ?
              <div className={s.room}>
                <RoomTeams />
                <RoomUsers />
              </div>
            :
              <TeamBuilder
                teamId={this.props.teamId}
                isSaveTeamPopupShown={this.state.isSaveTeamPopupShown}
                isPlayersListActive={mobileState.isPlayersListActive}
                closeSaveTeamPopup={() => this.setState({ isSaveTeamPopupShown: false })}
                resetGuide={() => this.resetGuide()}
                openGuide={() => this.openGuide()}
              />
            }
          </div>
          <div className={cx(s.aside, { [s.asideIsActive]: this.state.isAsideActive })}>
            {tournament ?
              <div className={tournamentInfoClass}>
                <header className={s.header}>
                  <div className={s.headerTitle}>
                    {getPropByLocale(tournament.i18n, currentLocale)}
                  </div>
                  <div className={s.pageList}>
                    <div className={scheduleClass} onClick={() => this.openTournamentInfo('schedule')} >
                      <FormattedMessage {...messages.scheduleLabel} />
                    </div>
                    <div className={tournamentTableClass} onClick={() => this.openTournamentInfo('table')}>
                      <FormattedMessage {...messages.tournamentTableLabel} />
                    </div>
                    <div className={newsClass} onClick={() => this.openTournamentInfo('news')} >
                      <FormattedMessage {...messages.newsLabel} />
                    </div>
                  </div>
                </header>
                <div className={s.pageContent}>
                  <NewsFeed
                    isActive={isNewsShown}
                    tournament={tournament}
                    onTeamBuilder={teamBuilderEnabled}
                  />
                  <Schedule
                    isActive={isScheduleShown}
                    matches={roundMatches}
                    teams={teams}
                    allTournamentTeams={allTournamentTeams}
                    room={room}
                    tournament={tournament}
                    teamBuilderEnabled={teamBuilderEnabled}
                    filter={collectFilter}
                    currentLocale={currentLocale}
                    filterByTeams={(filteredTeams) =>
                      dispatch(myteamModule.actions.filterByTeams(filteredTeams))
                    }
                  />
                  <TournamentTable
                    isActive={isTournamentTableShown}
                    matches={roundMatches}
                    teams={teams}
                    allTournamentTeams={allTournamentTeams}
                    room={room}
                    tournament={tournament}
                    teamBuilderEnabled={teamBuilderEnabled}
                    filter={collectFilter}
                    currentLocale={currentLocale}
                    filterByTeams={(filteredTeams) =>
                      dispatch(myteamModule.actions.filterByTeams(filteredTeams))
                    }
                  />
                </div>
              </div>
            : null}
          </div>
          <MobilePanel
            room={room}
            teamId={teamId}
            userbids={userbids}
            isPlayersListActive={mobileState.isPlayersListActive}
            teamBuilderEnabled={teamBuilderEnabled}
            isTeamComplete={isTeamComplete}
            togglePlayerList={() =>
              dispatch(appstateModule.actions.togglePlayerListOnMobile(!mobileState.isPlayersListActive))
            }
            openSaveTeamPopup={() => this.setState({ isSaveTeamPopupShown: true })}
            onNavigate={(pathname) => dispatch(navigate(pathname))}
            resetPanels={() => {
              this.mobileMenuOnClick('participants');
            }}
          />
        </div>
        {teamBuilderEnabled ?
          <TeamBuilderProgress
            isActive={this.state.isGuideShown}
            room={room}
            myTeam={myTeam}
            availableBudget={availableBudget}
          />
        : null}
        <RoomInfo isRoom />
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    room: getRoomData,
    prizes: getRoomPrizes,
    teams: filterRoomTeamsSelector,
    bids: filterRoomMembersSelector,
    isTeamComplete: getIsTeamCompleteSelector,
    availableBudget: getAvailableBudgetSelector,
    userbids: getRoomUserbids,
    players: playersModule.selectors.getPlayers,
    allTournamentTeams: teamsModule.selectors.getTeams,
    user: authModule.selectors.getUser,
    myTeam: myteamModule.selectors.getMyTeam,
    collectFilter: myteamModule.selectors.getCollectTeamFilter,
    isNewsShown: appstateModule.selectors.getNewsStatus,
    mobileState: appstateModule.selectors.getMobileState,
    isScheduleShown: appstateModule.selectors.getScheduleStatus,
    isTournamentTableShown: appstateModule.selectors.getTournamentTableStatus,
    tournaments: tournamentsModule.selectors.getTournaments,
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(RoomPage));
