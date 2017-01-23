import React, { Component, PropTypes } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import union from 'lodash/union';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import s from './Schedule.css';
import { statsApiUrl } from '../../config';
import { getPropByLocale } from '../../utils';
import messages from './messages';

class Schedule extends Component {

  static propTypes = {
    isActive: PropTypes.bool,
    matches: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    room: PropTypes.object,
    filterByTeams: PropTypes.func,
    filter: PropTypes.object,
    tournament: PropTypes.object,
    teamBuilderEnabled: PropTypes.bool,
    allTournamentTeams: PropTypes.array,
    currentLocale: PropTypes.string.isRequired,
  };

  getTeam(teamId) {
    const { teams } = this.props;
    const team = teams.find(t => t.team_id === teamId);
    return team;
  }

  getTeamPlace(teamId) {
    const { teams } = this.props;
    const team = teams.find(t => t.team_id === teamId);
    return team ? team.place : 0;
  }

  getTeamName(teamId) {
    const { currentLocale, teams } = this.props;
    const team = teams.find(t => t.team_id === teamId);
    return team ? getPropByLocale(team.i18n, currentLocale) : '';
  }

  getMatchDaysDates(matches) {
    let timesStart = matches.map(m => m['time_start']);
    timesStart = sortBy(timesStart, date => new Date(date).getTime());
    timesStart = timesStart.map(date => this.formatDateToDDMMYYYYPattern(date));
    return uniq(timesStart);
  }

  formatDateToDDMMYYYYPattern(date) {
    return [new Date(date).getDate(), new Date(date).getMonth(), new Date(date).getFullYear()].join('/');
  }

  filterByTeam(teamId) {
    const { filter, filterByTeams, teamBuilderEnabled } = this.props;
    let result;

    if (teamBuilderEnabled) {
      const currentFilterTeams = filter.teams;
      if (currentFilterTeams.indexOf(teamId) === -1) {
        result = union(currentFilterTeams, [teamId]);
      } else {
        result = without(currentFilterTeams, teamId);
      }
      filterByTeams(result);
    }
  }

  resetFilter() {
    const { filterByTeams } = this.props;
    filterByTeams([]);
  }

  returnTeam(team, i) {
    const { filter, teamBuilderEnabled, teams, currentLocale } = this.props;

    const isTeamActive = teams.find(t => t.team_id === team.team_id);

    return (
      <div className={cx(s.tableRow, { [s.tableRowIsDisabled]: teamBuilderEnabled && !isTeamActive })} key={team.team_id}>
        <div className={s.tableColumnPosition}>{i + 1}</div>
        <div
          className={cx(s.tableColumnClub, { [s.tableColumnClubIsSelected]: teamBuilderEnabled && filter.teams.indexOf(team.team_id) !== -1 }, { [s.unclickable]: !teamBuilderEnabled })}
          onClick={() => this.filterByTeam(team.team_id)}
        >
          <img src={ statsApiUrl + team.logo } />
          <div className={s.tableColumnClubTitle}>
            {getPropByLocale(team.i18n, currentLocale)}
          </div>
        </div>
        <div className={s.tableColumnGames}>{parseInt(team.wins + team.draws + team.loses, 10)}</div>
        <div className={s.tableColumnStats}>{`${team.wins} / ${team.draws} / ${team.loses}`}</div>
        <div className={s.tableColumnPoints}>{team.points}</div>
      </div>
    );
  }

  getTeamsFilterState() {
    const selectedTeamsLength = this.props.filter.teams.length;
    let filterState;
    if (selectedTeamsLength === 0) {
      filterState = <FormattedMessage {...messages.allTeamsLabel} />;
    } else {
      filterState = (selectedTeamsLength === 1) ?
        <FormattedMessage {...messages.filterOneTeamLabel} values={{ team: this.getTeamName(this.props.filter.teams[0]) }}  />
        :
        <FormattedMessage {...messages.filterTeamsLabel} values={{ num: selectedTeamsLength }} />
    }
    return filterState;
  }

  render() {
    const { matches, filter, teamBuilderEnabled } = this.props;
    const matchDays = [];
    const matchDaysDates = this.getMatchDaysDates(matches);

    const teamsFilterState = this.getTeamsFilterState();

    matchDaysDates.forEach(matchDay => {
      const matchList = [];

      let matchesForCurrentDay = matches.filter(match => this.formatDateToDDMMYYYYPattern(match.time_start) === matchDay);
      matchesForCurrentDay = sortBy(matchesForCurrentDay, m => new Date(m.time_start).getTime());

      matchesForCurrentDay.forEach(match => {
        const homeTeam = this.getTeamName(match.team1);
        const awayTeam = this.getTeamName(match.team2);

        const homeTeamLogo = this.getTeam(match.team1) ? statsApiUrl + this.getTeam(match.team1).logo : '';
        const awayTeamLogo = this.getTeam(match.team2) ? statsApiUrl + this.getTeam(match.team2).logo : '';

        const homeTeamCls = cx(s.matchTeam, s.matchTeamHome, { [s.matchTeamIsSelected]: teamBuilderEnabled && filter.teams.indexOf(match.team1) !== -1 }, { [s.unclickable]: !teamBuilderEnabled });
        const awayTeamCls = cx(s.matchTeam, s.matchTeamAway, { [s.matchTeamIsSelected]: teamBuilderEnabled && filter.teams.indexOf(match.team2) !== -1 }, { [s.unclickable]: !teamBuilderEnabled });

        const matchDate = new Date(match.time_start);

        matchList.push(
          <div className={s.match} key={match.match_id}>
            <div className={homeTeamCls} onClick={() => this.filterByTeam(match.team1)}>
              <div>
                {homeTeam}
                <div className={s.place}>
                  {this.getTeamPlace(match.team1)} <FormattedMessage {...messages.placeLabel} />
                </div>
              </div>
              <img src={homeTeamLogo} role="presentation" />
            </div>
            <div className={s.matchScore}>
              <div className={s.matchScore1}>
                {match.team1_score === null && match.team2_score === null ? `${matchDate.getHours()}` : `${match.team1_score}`}
              </div>
              <div className={s.matchScoreDots}>:</div>
              <div className={s.matchScore2}>
                {match.team1_score === null && match.team2_score === null ? `${(matchDate.getMinutes() < 10 ? '0' : '') + matchDate.getMinutes()}` : `${match.team2_score}`}
              </div>
            </div>
            <div className={awayTeamCls} onClick={() => this.filterByTeam(match.team2)}>
              <img src={awayTeamLogo} role="presentation" />
              <div>
                {awayTeam}
                <div className={s.place}>{this.getTeamPlace(match.team2)} <FormattedMessage {...messages.placeLabel} /></div>
              </div>
            </div>
          </div>
        );
      });

      const day = matchDay.split('/')[0];
      const ISODate = new Date(matchDay.split('/')[2], matchDay.split('/')[1], matchDay.split('/')[0]).toISOString();

      matchDays.push(
        <div className={s.day} key={day}>
          <div className={s.dayTitle}>
            <FormattedDate
              value={ISODate}
              month="long"
              day="numeric"
            />
          </div>
          {matchList}
        </div>
      );
    });

    return (
      <div
        className={cx(s.root, {
          [s.isActive]: this.props.isActive,
          [s.isTeamBuilderEnabled]: teamBuilderEnabled
        })}
      >
        <div className={s.filter}>
          <div className={s.filterState}>
            {teamsFilterState}
          </div>
          {filter && filter.teams.length > 0 ?
            <div className={s.filterReset} onClick={() => this.resetFilter()}>
              <FormattedMessage {...messages.filterReset} />
            </div>
          : null}
        </div>
        <div className={s.timeline}>
          <div className={s.tour}>
            {matchDays}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Schedule);
