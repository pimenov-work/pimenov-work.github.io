import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedRelative, FormattedMessage } from 'react-intl';
import cx from 'classnames';
import createHistory from 'core/createHistory';
import IconSVG from 'components/IconSVG';
import { getCurrencySymbol, getPropByLocale } from 'utils';
import { statsApiUrl, ROOM_STATUS_FREEZE } from 'config';
import s from './RoomHeader.css';
import messages from './messages';

function RoomHeader({ room, tournaments, teamId, currentLocale, isCollectTeam, isTeamComplete, toggleSchedule, openRoomDetails, openSaveTeamPopup }) {
  const tournament = tournaments.find(t => t.tournament_id === room.tournaments[0]);
  const headerBackground = tournament ? { backgroundImage: `url(${statsApiUrl}${tournament.header})` } : {};
  const tournamentLogo = tournament ? { backgroundImage: `url(${statsApiUrl}${tournament.logo})` } : {};
  let cost = room && room.fee ? <FormattedMessage {...messages.playCashLabel} values={{ fee: `${room.fee} ${getCurrencySymbol(room.currency)}` }} /> : <FormattedMessage {...messages.playFreeLabel} />;
  if (teamId) {
    cost = <FormattedMessage {...messages.saveLabel} />;
  }

  const history = createHistory();

  return (
    <section className={s.root} style={headerBackground}>
      <div className={s.info}>
        {tournament ?
          <div className={s.tournamentLogo} style={tournamentLogo}></div>
        : null}
        <div className={s.infoBlock}>
          <div className={s.infoTitle}>
            <div className={s.infoTitleText}>
              {room ? getPropByLocale(room.title, currentLocale) : room.room_id}
            </div>
            <div onClick={openRoomDetails}>
              <IconSVG size="22" icon="info-icon" cssClass={s.infoTitleIcon} />
            </div>
          </div>
          <div className={s.infoContent}>
            {room && room.status === ROOM_STATUS_FREEZE ?
              <div className={s.liveLabel}>LIVE</div>
            :
              <div className={s.infoLabel}>
                <IconSVG size="14" icon="clock-icon" cssClass={s.infoLabelIcon} />
                {room && room.freeze ? <FormattedRelative value={new Date(room.freeze)} /> : null}
              </div>
            }
            <div className={s.infoLabel}>
              <IconSVG size="14" icon="fee-icon" cssClass={s.infoLabelIcon} />
              <span>{room && room.fee ? `${room.fee} ${getCurrencySymbol(room.currency)}` : <FormattedMessage {...messages.freeRoomStatus} />}</span>
            </div>
            <div className={cx(s.infoLabel, s.infoLabelPrize)}>
              <IconSVG size="14" icon="gift-icon" cssClass={s.infoLabelIcon} />
              <span>{room ? `${room.prize} ${getCurrencySymbol(room.currency)}` : '-'}</span>
            </div>
            <div className={cx(s.infoLabel, s.infoLabelUsers)}>
              <IconSVG size="14" icon="user2-icon" cssClass={s.infoLabelIcon} />
              {room ?
                <span>
                  {room.users_limit ? `${room.users} / ${room.users_limit}` : room.users}
                </span>
              : null}
            </div>
            {/* <div className={s.infoLabelActive} onClick={toggleSchedule}>
              <IconSVG size="14" icon="calendar-icon" cssClass={s.infoLabelIcon} />
              <span>Расписание</span>
            </div> */}
          </div>
        </div>
      </div>
      <div className={s.controls}>
        {isCollectTeam ?
          <div
            className={isTeamComplete ? s.playBtn : s.playBtnIsDisabled}
            onClick={() => openSaveTeamPopup()}
          >{cost}</div>
        : null}
        <div className={s.backLink} onClick={() => history.goBack()}>
          <FormattedMessage {...messages.backLabel} />
        </div>
      </div>
    </section>
  );
}

RoomHeader.propTypes = {
  room: PropTypes.object,
  teamId: PropTypes.string,
  tournaments: PropTypes.array,
  currentLocale: PropTypes.string.isRequired,
  isCollectTeam: PropTypes.bool,
  isTeamComplete: PropTypes.bool,
  toggleSchedule: PropTypes.func,
  openRoomDetails: PropTypes.func,
  openSaveTeamPopup: PropTypes.func
};

export default withStyles(s)(RoomHeader);
