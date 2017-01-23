import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import union from 'lodash/union';
import without from 'lodash/without';
import s from './TournamentTable.css';
import { statsApiUrl } from '../../config';
import { getPropByLocale } from '../../utils';
import messages from './messages';

class TournamentTable extends Component {

  static propTypes = {
    isActive: PropTypes.bool,
    teams: PropTypes.array.isRequired,
    filterByTeams: PropTypes.func,
    filter: PropTypes.object,
    teamBuilderEnabled: PropTypes.bool,
    allTournamentTeams: PropTypes.array,
    currentLocale: PropTypes.string.isRequired,
  };

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
          <img src={statsApiUrl + team.logo} role="presentation" />
          <div className={s.tableColumnClubTitle}>
            {getPropByLocale(team.i18n, currentLocale)}
          </div>
        </div>
        <div className={s.tableColumnPoints}>{team.points}</div>
        <div className={s.tableColumnGames}>{parseInt(team.wins + team.draws + team.loses, 10)}</div>
        <div className={s.tableColumnStats}>{`${team.wins} / ${team.draws} / ${team.loses}`}</div>
      </div>
    );
  }

  render() {
    const { allTournamentTeams, isActive } = this.props;

    return (
      <div className={cx(s.root, { [s.isActive]: isActive })} >
        <div className={s.table}>
          <div className={s.tableHeader}>
            <div className={s.tableColumnPosition}></div>
            <div className={s.tableColumnClub}><FormattedMessage {...messages.teamLabel} /></div>
            <div className={s.tableColumnPoints}><FormattedMessage {...messages.pointsLabel} /></div>
            <div className={s.tableColumnGames}><FormattedMessage {...messages.gamesLabel} /></div>
            <div className={s.tableColumnStats}><FormattedMessage {...messages.resultsLabel} /></div>
          </div>
          {allTournamentTeams.map((team, i) => this.returnTeam(team, i))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TournamentTable);
