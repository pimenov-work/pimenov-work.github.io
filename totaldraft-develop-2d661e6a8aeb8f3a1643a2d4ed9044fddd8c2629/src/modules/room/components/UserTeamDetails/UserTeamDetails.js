import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import s from './UserTeamDetails.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { positionsMap } from '../../../myteam/constants';
import IconSVG from 'components/IconSVG';
import { statsApiUrl } from 'config';
import { getPlayerShortName, sortPlayers, getPropByLocale } from 'utils';
import messages from './messages';

class UserTeamDetails extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    team: PropTypes.object,
    room: PropTypes.object,
    roomStats: PropTypes.object
  };

  static contextTypes = {
    getPlayerAchievements: PropTypes.func.isRequired
  };

  getTeamName(teamId) {
    const { currentLocale, teams } = this.props;
    const team = teams.find(t => t.team_id === teamId);
    return team ? getPropByLocale(team.i18n, currentLocale) : '';
  }

  getPlayerById(id) {
    return this.props.players.find(p => p.id === id);
  }

  getPlayerPoints(id) {
    const player = this.props.roomStats.players.find(p => p.player_id === id);
    return player ? player.score : '0';
  }

  getPlayersElements(squad) {
    const { players, currentLocale } = this.props;
    const elements = [];
    const sorted = sortPlayers(squad, players);

    sorted.forEach(p => {
      const player = this.getPlayerById(p);
      const teamName = player ? this.getTeamName(player.team_id) : '';
      const team = player ? this.getTeam(player.team_id) : {};
      const teamUniform = team ? statsApiUrl + team.uniform : '';

      if (player) {
        elements.push(
          <div className={s.player} key={p} onClick={() => this.props.openPlayerStats(p)}>
            <div className={s.playerPosition}>{positionsMap[player.pos]}</div>
            <div className={s.playerName}>
              <img className={s.playerUniformImg} src={teamUniform} role="presentation" />
              <div className={s.playerNameLabel}>
                {getPlayerShortName(getPropByLocale(player.i18n, currentLocale))}
              </div>
              <div className={s.playerAchievements}>
                {this.context.getPlayerAchievements(p)}
              </div>
            </div>
            <div className={s.playerClub}>
              {teamName}
            </div>
            <div className={s.playerScore}>{this.getPlayerPoints(player.id)}</div>
            {/* <div className={s.playerControls}></div> */}
          </div>
        );
      } else {
        elements.push(
          <div className={s.player} key={p}>
            <div className={s.playerPosition}>-</div>
            <div className={s.playerName}>
              <div className={s.invalidPlayerNameLabel}>
                <FormattedMessage {...messages.playerRevoked} />
              </div>
            </div>
            <div className={s.playerClub}>-</div>
            <div className={s.playerScore}>-</div>
            {/* <div className={s.playerControls}></div> */}
          </div>
        );
      }
    });

    return elements;
  }

  getTeam(id) {
    const { teams } = this.props;
    return teams.find(t => t.team_id === id);
  }

  render() {
    const { isActive, team } = this.props;
    const playersMainElements = team ? this.getPlayersElements(team.main) : null;
    const playersReserveElements = team ? this.getPlayersElements(team.reserve) : null;

    return (
      <section className={cx(s.root, { [s.isActive]: isActive })}>
        <header className={s.header}>
          <div className={s.headerSection}>
            <div className={s.headerTitle}>
              <div className={s.headerClose} onClick={this.props.onClose}>
                <IconSVG icon="smart-arrow-left" size="22" cssClass={s.dismissBtn} />
              </div>
              <div className={s.headerTeamName}>{team ? team.title : null}</div>
              {team && team.place ?
                <div className={s.headerTeamPlace}>
                <FormattedMessage {...messages.placeLabel} />
                  {`: ${team.place}`}
                </div>
               : null}
              {team && team.score ?
                <div className={s.headerTeamScore}>
                  <FormattedMessage {...messages.pointsLabel} />
                  {`: ${team.score}`}
                </div>
              : null}
            </div>
          </div>
          <div className={s.subheader}><FormattedMessage {...messages.mainTeamLabel} /></div>
          <div className={s.tableHeader}>
            <div className={s.tableHeaderPosition}><FormattedMessage {...messages.tableHeaderPos} /></div>
            <div className={s.tableHeaderName}><FormattedMessage {...messages.tableHeaderPlayer} /></div>
            <div className={s.tableHeaderClub}><FormattedMessage {...messages.tableHeaderClub} /></div>
            <div className={s.tableHeaderScore}><FormattedMessage {...messages.tableHeaderPoints} /></div>
            {/* <div className={s.tableHeaderControls}></div> */}
          </div>
        </header>
        <div className={s.players}>
          {playersMainElements}
          <div className={s.playersTitle}><FormattedMessage {...messages.reserveTeamLabel} /></div>
          {playersReserveElements}
        </div>
      </section>
    );
  }
}

export default withStyles(s)(UserTeamDetails);
