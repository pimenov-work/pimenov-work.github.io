import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from 'components/Link';
import tournamentsModule from 'modules/tournaments';
import lobbyModule from 'modules/lobby';
import intlModule from 'modules/intl';
import { getCurrencySymbol, getPropByLocale } from 'utils';
import { statsApiUrl } from 'config';
import s from './TournamentSelector.css';

class TournamentSelector extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    tournaments: PropTypes.array,
    rooms: PropTypes.array.isRequired,
    currentLocale: PropTypes.string.isRequired
  };

  getTournamentLogo(tournamentId) {
    const { tournaments } = this.props;
    const tourWithLogo = tournaments.find(tour => tour.tournament_id === tournamentId);
    return tourWithLogo ? tourWithLogo.logo : null;
  }

  render() {
    const { rooms, currentLocale } = this.props;

    return (
      <div className={s.tournamentList}>
        {rooms.map(room => {
          let title = getPropByLocale(room.title, currentLocale);
          return (
            <Link
              data-gtm="room"
              className={s.tournament}
              key={room.room_id}
              to={`/rooms/${room.room_id}`}
            >
              {this.getTournamentLogo(room.tournaments[0]) ?
                <div
                  className={s.tournamentLogo}
                  style={{ backgroundImage: `url('${statsApiUrl}${this.getTournamentLogo(room.tournaments[0])}')` }}
                ></div> : null
              }
              {title ? title : room.room_id}
              <div>{room.prize} {getCurrencySymbol(room.currency)}</div>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default withStyles(s)(connect(
  createStructuredSelector({
    tournaments: tournamentsModule.selectors.getTournaments,
    rooms: lobbyModule.selectors.getRooms,
    currentLocale: intlModule.selectors.getLocale
  })
)(TournamentSelector));
