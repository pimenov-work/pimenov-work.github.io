import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TeamDropdown.css';
import cx from 'classnames';
import union from 'lodash/union';
import without from 'lodash/without';
import { statsApiUrl } from 'config';
import { getPropByLocale } from 'utils';
import messages from './messages';

class TeamDropdown extends Component {

  static propTypes = {
    filter: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    filterByTeams: PropTypes.func.isRequired,
    teams: PropTypes.array.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownIsActive: false
    };
  }

  getTeam(id) {
    const { teams } = this.props;
    return teams.find(t => t.team_id === id);
  }

  getTeamName(teamId) {
    const { currentLocale, teams } = this.props;
    const team = teams.find(t => t.team_id === teamId);

    return team ? getPropByLocale(team.i18n, currentLocale) : '';
  }

  getTeamsFilterState() {
    const selectedTeamsLength = this.props.filter.teams.length;
    let filterState;
    if (selectedTeamsLength === 0) {
      filterState = <FormattedMessage {...messages.allTeamsLabel} />;
    } else {
      filterState = (selectedTeamsLength === 1) ? this.getTeamName(this.props.filter.teams[0])
        :
        <FormattedMessage {...messages.filterTeamsLabel} values={{ num: selectedTeamsLength }} />
    }
    return filterState;
  }

  getMatches() {
    const { room, filter, teams, currentLocale } = this.props;
    const currentFilterTeams = filter.teams;
    if (teams.length === 0) return false;

    return room.matches.map((match, i) => {
      const team1 = this.getTeam(match.team1);
      const team2 = this.getTeam(match.team2);

      return (
        <div className={s.matchesContainer} key={i}>
          <div
            className={cx(s.team, { [s.isActive]: currentFilterTeams.indexOf(team1.team_id) !== -1 })}
            onClick={() => this.filterByTeams(team1.team_id)}
            key={team1.team_id}
          >
            <img className={s.teamLogo} src={`${statsApiUrl}${team1.logo}`} />
            <div className={s.teamName}>
              {getPropByLocale(team1.i18n, currentLocale)}
            </div>
          </div>
          <span className={s.delimer}>:</span>
          <div
            className={cx(s.team, { [s.isActive]: currentFilterTeams.indexOf(team2.team_id) !== -1 })}
            key={team2.team_id}
            onClick={() => this.filterByTeams(team2.team_id)}
          >
            <img className={s.teamLogo} src={`${statsApiUrl}${team2.logo}`} />
            <div className={s.teamName}>
              {getPropByLocale(team2.i18n, currentLocale)}
            </div>
          </div>
        </div>
      );
    });
  }

  filterByTeams(teamId) {
    let newFilterByTeams;
    const currentFilterTeams = this.props.filter.teams;

    if (currentFilterTeams.indexOf(teamId) === -1) {
      newFilterByTeams = union(currentFilterTeams, [teamId]);
    } else {
      newFilterByTeams = without(currentFilterTeams, teamId);
    }
    this.props.filterByTeams(newFilterByTeams);
  }

  resetFilter() {
    this.props.filterByTeams([]);
  }

  render() {
    const { filter } = this.props;
    const teamsFilterState = this.getTeamsFilterState();
    const currentFilterTeams = filter.teams;

    return (
      <div
        className={cx(s.root, { [s.dropdownIsActive]: this.state.dropdownIsActive })}
        onMouseLeave={() => this.setState({ dropdownIsActive: false })}
      >
        <span className={s.dropdownTitle} onClick={() => this.setState({ dropdownIsActive: true })}>
          {teamsFilterState}
        </span>
        <div className={s.dropdown}>
          <div
            className={cx(s.teamReset, { [s.isActive]: currentFilterTeams.length === 0 })}
            onClick={() => this.resetFilter()}
          ><FormattedMessage {...messages.allTeamsLabel} /></div>
            {this.getMatches()}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TeamDropdown);
