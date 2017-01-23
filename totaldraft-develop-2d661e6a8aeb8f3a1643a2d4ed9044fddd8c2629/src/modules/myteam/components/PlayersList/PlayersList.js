import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import s from './PlayersList.css';
import ReactDOM from 'react-dom';
import Infinite from 'react-infinite';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import intlModule from 'modules/intl';
import Player from '../Player';
import { getFullPageHeight } from 'core/DOMUtils';
import { COLLECT_TEAM_POSITION_COLUMN, COLLECT_TEAM_PLAYER_NAME_COLUMN,
  COLLECT_TEAM_CLUB_COLUMN, COLLECT_TEAM_POINTS_COLUMN,
  COLLECT_TEAM_PRICE_COLUMN, SORT_DIRECTION_ASC, SORT_DIRECTION_DESC,
  INFINITE_PLAYERS_LIST_LOAD_VALUE } from '../../constants';
import messages from './messages';

class PlayersList extends Component {

  static propTypes = {
    players: PropTypes.array.isRequired,
    myTeam: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    applySort: PropTypes.func.isRequired,
    sort: PropTypes.object.isRequired,
    playersCountInInfiniteGrid: PropTypes.number.isRequired,
    loadMoreElementsIntoInfinitePlayersGrid: PropTypes.func.isRequired,
    addPlayerMyTeam: PropTypes.func.isRequired,
    openPlayerInfo: PropTypes.func.isRequired,
    competitionId: PropTypes.number.isRequired,
    fetchPlayerStats: PropTypes.func.isRequired,
    addPlayerIntoMyTeam: PropTypes.func.isRequired,
    resetGuide: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      infiniteGridHeight: 350
    };

    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentDidMount() {
    this.setInfiniteGridHeight();

    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  setInfiniteGridHeight() {
    const pageHeight = getFullPageHeight();
    const rowEl = ReactDOM.findDOMNode(this._infiniteGrid);

    this.setState({ infiniteGridHeight: pageHeight - parseInt(rowEl.getBoundingClientRect().top, 10) - 10 });
  }

  getAvailablePlayers() {
    const myTeamPlayerIds = [];
    const myTeamPlayers = this.props.myTeam.players;
    const allPlayers = this.props.players;

    myTeamPlayers.forEach(p => myTeamPlayerIds.push(p.id));

    return allPlayers.filter(player => myTeamPlayerIds.indexOf(player.id) === -1);
  }

  getHeaderElementsCls() {
    const sortDirection = (this.props.sort.sortDirection === SORT_DIRECTION_ASC) ? s.sortAsc : s.sortDesc;
    const sortColumn = this.props.sort.sortColumn;
    return {
      posCls: cx(s.headerItemPosition, (sortColumn === COLLECT_TEAM_POSITION_COLUMN) ? sortDirection : null),
      nameCls: cx(s.headerItemPlayer, (sortColumn === COLLECT_TEAM_PLAYER_NAME_COLUMN) ? sortDirection : null),
      clubCls: cx(s.headerItemClub, (sortColumn === COLLECT_TEAM_CLUB_COLUMN) ? sortDirection : null),
      pointsCls: cx(s.headerItemCounts, (sortColumn === COLLECT_TEAM_POINTS_COLUMN) ? sortDirection : null),
      priceCls: cx(s.headerItemPrice, (sortColumn === COLLECT_TEAM_PRICE_COLUMN) ? sortDirection : null)
    };
  }

  handleWindowResize() {
    this.setInfiniteGridHeight();
  }

  applySortForColumn(column) {
    const direction = (column !== this.props.sort.sortColumn || this.props.sort.sortDirection === SORT_DIRECTION_DESC)
      ? SORT_DIRECTION_ASC : SORT_DIRECTION_DESC;
    this.props.applySort(direction, column);
  }

  handleInfiniteLoad() {
    setTimeout(() => {
      this.props.loadMoreElementsIntoInfinitePlayersGrid(this.props.playersCountInInfiniteGrid + INFINITE_PLAYERS_LIST_LOAD_VALUE);
    }, 100);
  }

  buildPlayersElements(startIndex, end) {
    const playersElements = [];
    const allPlayers = this.getAvailablePlayers();
    const endIndex = (end <= allPlayers.length) ? end : allPlayers.length;

    for (let i = startIndex; i < endIndex; i++) {
      playersElements.push(
        <Player
          room={this.props.room}
          key={allPlayers[i].id}
          player={allPlayers[i]}
          stats={this.props.stats}
          addPlayerIntoMyTeam={this.props.addPlayerIntoMyTeam}
          teams={this.props.teams}
          myTeam={this.props.myTeam}
          currentLocale={this.props.currentLocale}
          addPlayerMyTeam={this.props.addPlayerMyTeam}
          openPlayerInfo={this.props.openPlayerInfo}
          competitionId={this.props.competitionId}
          fetchPlayerStats={this.props.fetchPlayerStats}
          resetGuide={this.props.resetGuide}
        />
      );
    }
    return playersElements;
  }

  render() {
    const playersElements = this.buildPlayersElements(0, this.props.playersCountInInfiniteGrid);
    const headerCls = this.getHeaderElementsCls();

    return (
      <section className={s.root}>
        <header className={s.header}>
          <div className={s.headerItemControls}></div>
          <div className={headerCls.posCls} onClick={() => this.applySortForColumn(COLLECT_TEAM_POSITION_COLUMN)}>
            <FormattedMessage {...messages.tablePos} />
          </div>
          <div className={headerCls.nameCls} onClick={() => this.applySortForColumn(COLLECT_TEAM_PLAYER_NAME_COLUMN)}>
            <FormattedMessage {...messages.tablePlayer} />
          </div>
          <div className={headerCls.clubCls} onClick={() => this.applySortForColumn(COLLECT_TEAM_CLUB_COLUMN)}>
            <FormattedMessage {...messages.tableClub} />
          </div>
          <div className={headerCls.pointsCls} onClick={() => this.applySortForColumn(COLLECT_TEAM_POINTS_COLUMN)}>
            <FormattedMessage {...messages.tablePoints} />
          </div>
          <div className={headerCls.priceCls} onClick={() => this.applySortForColumn(COLLECT_TEAM_PRICE_COLUMN)}>
            <FormattedMessage {...messages.tablePrice} />
          </div>
        </header>
        <div className={s.players} ref={(c) => this._infiniteGrid = c}>
          <Infinite
            elementHeight={50}
            containerHeight={this.state.infiniteGridHeight}
            infiniteLoadBeginEdgeOffset={50}
            onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
          >
            {playersElements}
          </Infinite>
        </div>
      </section>
    );
  }
}

export default connect(
  createStructuredSelector({
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(PlayersList));
