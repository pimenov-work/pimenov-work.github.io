import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import IconSVG from 'components/IconSVG';
import { ROOM_STATUS_NEW } from 'config';
import { getCurrencySymbol } from 'utils';
import s from './MobilePanel.css';
import messages from './messages';

function MobilePanel(props) {
  const { room, userbids, teamId, isPlayersListActive, teamBuilderEnabled,
    isTeamComplete, togglePlayerList, onNavigate, openSaveTeamPopup, resetPanels } = props;

  let playButtonLabel = room.fee ? <FormattedMessage {...messages.playCashLabel} values={{ fee: `${room.fee} ${getCurrencySymbol(room.currency)}` }} /> : <FormattedMessage {...messages.playFreeLabel} />;
  if (teamId) {
    playButtonLabel = <FormattedMessage {...messages.saveLabel} />;
  }

  return (
    <div className={cx(s.root, { [s.withTeamBuilder]: teamBuilderEnabled })}>
      {!isPlayersListActive ?
        <div
          className={s.backBtn}
          onClick={() => onNavigate(`${!teamBuilderEnabled ? '/lobby' : `/rooms/${room.room_id}`}`)}
        >
          <IconSVG icon="smart-arrow-left" size="22" />
        </div>
      : null}

      {!teamBuilderEnabled && room.status === ROOM_STATUS_NEW && userbids.length < room.bids_per_user ?
        <div
          className={s.buttonIsBlue}
          onClick={() => onNavigate(`/rooms/${room.room_id}/teams`)}
        >
          <FormattedMessage {...messages.collectLabel} />
        </div>
      : null}

      {teamBuilderEnabled ?
        <div>
          {isTeamComplete && !isPlayersListActive ?
            <div className={s.buttonIsGreen} onClick={() => openSaveTeamPopup()}>{playButtonLabel}</div>
          :
            <div
              className={s.button}
              onClick={() => {
                resetPanels();
                togglePlayerList();
              }}
            >
              {!isPlayersListActive
                ? <FormattedMessage {...messages.addPlayersLabel} />
                : <FormattedMessage {...messages.fieldLabel} />
              }
            </div>
          }
        </div>
      : null}
    </div>
  );
}

MobilePanel.propTypes = {
  room: PropTypes.object.isRequired,
  userbids: PropTypes.array,
  teamId: PropTypes.string,
  isPlayersListActive: PropTypes.bool,
  teamBuilderEnabled: PropTypes.bool,
  isTeamComplete: PropTypes.bool,
  togglePlayerList: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  openSaveTeamPopup: PropTypes.func.isRequired,
  resetPanels: PropTypes.func,
};

export default withStyles(s)(MobilePanel);
