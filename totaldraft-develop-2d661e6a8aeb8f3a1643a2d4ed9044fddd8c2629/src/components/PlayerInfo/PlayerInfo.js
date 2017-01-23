import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import { positionsMapFullTitle } from '../../modules/myteam/constants';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import compact from 'lodash/compact';
import find from 'lodash/find';
import { statsApiUrl } from 'config';
import { convertToMillion, getPropByLocale } from 'utils';
import intlModule from 'modules/intl';
import s from './PlayerInfo.css';
import IconSVG from '../IconSVG';
import PlayerStatsGraph from '../PlayerStatsGraph';
import messages from './messages';

class PlayerInfo extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    playerStats: PropTypes.object,
    stats: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    allPlayers: PropTypes.array.isRequired,
    closePlayerStats: PropTypes.func.isRequired,
    addPlayerIntoMyTeam: PropTypes.func,
    removePlayerMyTeam: PropTypes.func,
    isReadOnly: PropTypes.bool,
    isCompareMode: PropTypes.bool,
    currentLocale: PropTypes.string.isRequired,
  };

  getTeam(id) {
    const team = find(this.props.teams, t => t.team_id === id);
    return team ? team : null;
  }

  getPlayer(id) {
    const player = find(this.props.allPlayers, p => p.id === id);
    return player ? player : null;
  }

  closeInfo() {
    this.props.closePlayerStats();
  }

  addPlayerToTeam(player) {
    this.props.addPlayerIntoMyTeam(player);
    this.closeInfo();
  }

  removePlayerMyTeam(player) {
    this.props.removePlayerMyTeam(player);
    this.closeInfo();
  }

  isPlayerGotRedCard(playerId) {
    const { room } = this.props;
    const rc = room ? room.missing.rc : undefined;

    return rc && rc.indexOf(playerId) > -1;
  }

  render() {
    const { playerStats, currentLocale } = this.props;
    const player = playerStats && playerStats.aggr ? this.getPlayer(playerStats.aggr.player_id) : null;
    if (!player) {
      return null;
    }
    const team = this.getTeam(player.team_id);
    const teamName = team ? getPropByLocale(team.i18n, currentLocale) : '';
    const teamUniform = team && playerStats ? statsApiUrl + team.uniform : '';
    const teamLogo = team && playerStats ? statsApiUrl + team.logo : '';
    const roundsStats = playerStats ? playerStats.stats : null;

    const playerStatsTableData = compact(roundsStats);

    const rootClass = cx(s.root, {
      [s.isActive]: this.props.isActive,
      [s.isReadOnly]: this.props.isReadOnly || this.isPlayerGotRedCard(player.id), // || (playerStats && playerStats.aggr && playerStats.aggr.cards_red),
      [s.isCompareMode]: this.props.isCompareMode
    });

    return (
      <section className={rootClass}>
        <header className={s.header}>
          {!this.props.isReadOnly && !this.props.isCompareMode ?
            <div className={s.addBtn} onClick={() => this.addPlayerToTeam(player)}>
              <IconSVG size="14" icon="arrow-left" />
              {convertToMillion(player.price)}
            </div>
          : null}
          {!this.props.isReadOnly && this.props.isCompareMode ?
            <div className={s.removeBtn} onClick={() => this.removePlayerMyTeam(player)}>
              {convertToMillion(player.price)}
              <IconSVG size="14" icon="arrow-right" />
            </div>
          : null}
          <span className={s.closeBtn} onClick={() => this.props.closePlayerStats()}>&times;</span>
        </header>
        <section className={s.description}>
          <div className={s.avatar}>
            <div className={s.playerNumber}>{ player.number }</div>
            <img className={s.playerUniformImg} src={ teamUniform } />
          </div>
          <div>
            <div className={s.name}>
              {getPropByLocale(player.i18n, currentLocale)}
            </div>
            <div className={s.club}>
              <img className={s.clubLogo} src={ teamLogo } />
              <div className={s.playerInfo}>
                <div className={s.position}>
                  {player && player.pos ? positionsMapFullTitle[player.pos] : null}
                </div>
                <div className={s.clubName}>
                  {teamName}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={s.stats}>
          <div className={s.overallSection}>
            <div className={s.label}>
              <FormattedMessage {...messages.avgLabel} />:
            </div>
            <div className={s.value}>
              {player && player.avg ? player.avg.toPrecision(2) : '-'}
              <PlayerStatsGraph
                player={player}
                cssClass={s.playerStats}
                dX={8}
                dY={1.5}
              />
            </div>
          </div>
          <div className={s.statsSection}>
            <div className={s.statsItem}>
              <div className={s.statsItemKey}>
                <FormattedMessage {...messages.statMinutes} />:
              </div>
              <div className={s.statsItemValue}>
                {playerStats && playerStats.aggr.minutes !== null ? playerStats.aggr.minutes : '-'}
              </div>
            </div>
            <div className={s.statsItem}>
              <div className={s.statsItemKey}><FormattedMessage {...messages.statAssist} />:</div>
              <div className={s.statsItemValue}>{playerStats && playerStats.aggr.assists !== null ? playerStats.aggr.assists : '-'}</div>
            </div>
            <div className={s.statsItem}>
              <div className={s.statsItemKey}><FormattedMessage {...messages.statGoals} />:</div>
              <div className={s.statsItemValue}>
                {playerStats && playerStats.aggr.goals_scored !== null ? playerStats.aggr.goals_scored : '-'}
              </div>
            </div>
          </div>
          <div className={s.statsSection}>
            <div className={s.statsItem}>
              <div className={s.statsItemKey}><FormattedMessage {...messages.statAllowedGoals} />:</div>
              <div className={s.statsItemValue}>{playerStats && playerStats.aggr.goals_conceded !== null ? playerStats.aggr.goals_conceded : '-'}</div>
            </div>
            <div className={s.statsItem}>
              <div className={s.statsItemKey}><FormattedMessage {...messages.statCards} />:</div>
              <div className={s.statsItemValue}>
                {playerStats && playerStats.aggr && playerStats.aggr.cards_yellow ?
                  <div className={s.yellowCard}>
                    <div className={s.cardShape}></div> {playerStats.aggr.cards_yellow}
                  </div>
                  : null
                }
                {playerStats && playerStats.aggr && playerStats.aggr.cards_red ?
                  <div className={s.redCard}>
                    <div className={s.cardShape}></div> {playerStats.aggr.cards_red}
                  </div>
                  : null
                }
                {playerStats && playerStats.aggr && !playerStats.aggr.cards_red && !playerStats.aggr.cards_yellow
                  ? '-'
                  : null
                }
              </div>
            </div>
            <div className={s.statsItem}>
              <div className={s.statsItemKey}><FormattedMessage {...messages.statAutogoals} />:</div>
              <div className={s.statsItemValue}>{playerStats && playerStats.aggr.goals_own !== null ? playerStats.aggr.goals_own : '-'}</div>
            </div>
          </div>
        </section>
        {playerStatsTableData ?
          <section className={s.statsTable}>
            <header className={s.statsTableHeader}>
              <div className={s.statsTableTour}><FormattedMessage {...messages.tableTour} /></div>
              <div className={s.statsTableTime}><FormattedMessage {...messages.tableMinutes} />.</div>
              <div className={s.statsTableInfo}><FormattedMessage {...messages.tableAssists} /></div>
              <div className={s.statsTableGoals}><FormattedMessage {...messages.tableGoals} /></div>
              <div className={s.statsTableCards}><FormattedMessage {...messages.tableCards} /></div>
              <div className={s.statsTablePoints}><FormattedMessage {...messages.tablePoints} /></div>
            </header>
            <div className={s.statsTableContent}>
              {playerStatsTableData.map((p, i) => {
                return (
                  <div className={s.statsTableRow} key={i}>
                    <div className={s.statsTableTour}>{decodeURIComponent(p.round)}</div>
                    <div className={s.statsTableTime}>{p.minutes}</div>
                    <div className={s.statsTableInfo}>{p.assists}</div>
                    <div className={s.statsTableGoals}>{p.goals_scored}</div>
                    <div className={s.statsTableCards}>
                      {p.cards_yellow ?
                        <div className={s.yellowCard}>
                          <div className={s.cardShape}></div> {p.cards_yellow}
                        </div>
                      : null}
                      {p.cards_red ?
                        <div className={s.redCard}>
                          <div className={s.cardShape}></div> {p.cards_red}
                        </div>
                      : null}
                      {!p.cards_red && !p.cards_yellow ? '-' : null}
                    </div>
                    <div className={s.statsTablePoints}>{p.score}</div>
                  </div>
                );
              })}
          </div>
        </section>
        : null}
      </section>
    );
  }
}

export default connect(
  createStructuredSelector({
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(PlayerInfo));
