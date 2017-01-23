import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { MY_TEAM_SIZE } from '../../constants';
import s from './TeamBuilderProgress.css';
import messages from './messages';

class TeamBuilderProgress extends Component {

  static propTypes = {
    room: PropTypes.object.isRequired,
    myTeam: PropTypes.object.isRequired,
    availableBudget: PropTypes.number,
    isActive: PropTypes.bool
  };

  render() {
    const { isActive, room } = this.props;

    const style = {
      width: (this.props.myTeam.players.length / MY_TEAM_SIZE * 100) + '%',
      background: (this.props.availableBudget >= 0) ? '#0069ea' : '#ed1b17'
    };

    let bugetOnTeam = room && room.plr_price_limit ? (Math.round(room.plr_price_limit / 1000000)) : null;
    // bugetOnTeam = bugetOnTeam === 1 ? bugetOnTeam + ' миллион на команду' : bugetOnTeam === 2 || bugetOnTeam === 3 || bugetOnTeam === 4 ?
    // bugetOnTeam + ' миллиона на команду' : bugetOnTeam + ' миллионов на команду';

    return (
      <div className={cx(s.root, { [s.isActive]: isActive })}>
        <div className={s.progress}>
          <div style={style} className={s.complection}></div>
        </div>
        <div className={s.guide}>
          <div className={s.guideItem}>
            <img src="/images/team.svg" role="presentation" />
            <div className={s.guideItemText}>
              <FormattedMessage
                {...messages.collectTeamLabel}
                values={{
                  total: <strong><FormattedMessage {...messages.collectTeamLabelNumPlayers} /></strong>
                }}
              />
            </div>
          </div>
          <div className={s.guideItem}>
            <img src="/images/coins.svg" role="presentation" />
            <div className={s.guideItemText}>
              <FormattedMessage
                {...messages.limitBudgetLabel}
                values={{ budget: <strong><FormattedMessage {...messages.limitBudgetLabelNum} values={{ budget: bugetOnTeam }} /></strong> }}
              />
            </div>
          </div>
          <div className={s.guideItem}>
            <img src="/images/t-shirts.svg" role="presentation" />
            <div className={s.guideItemText}>
              <FormattedMessage
                {...messages.limitPlayersLabel}
                values={{ num: <strong><FormattedMessage {...messages.limitPlayersLabelNum} values={{ num: room && room.plr_per_team ? room.plr_per_team : 3 }} /></strong> }}
              />
            </div>
          </div>
          {room && room.fee > 0 ?
            <div className={s.guideItem}>
              <img src="/images/wallet.svg" role="presentation" />
              <div className={s.guideItemText}>
                <FormattedMessage {...messages.feeLabel} /> <br />
                {`${room && room.fee} ₽`}
              </div>
            </div>
          : null }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TeamBuilderProgress);
