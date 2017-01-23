import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { FormattedRelative, defineMessages, FormattedMessage } from 'react-intl';
import s from './RoomInfoPanel.css';
import { getCurrencySymbol, getRoomType, convertToMillion, getPropByLocale } from '../../utils';
import { ROOM_STATUS_NEW, statsApiUrl } from '../../config';
import Scoring from '../Scoring';
import IconSVG from '../IconSVG';
import Link from '../Link';
import messages from './messages';

function RoomInfoPanel({ room, tournaments, bids, prizes, user, currentLocale, panelState, tabs, isActive, isRoom, toggleTabs, closePanel }) {
  const rulesTabClass = cx(s.filterItem, { [s.filterItemIsActive]: panelState.isRulesTabShown });
  const prizeTabClass = cx(s.filterItem, { [s.filterItemIsActive]: panelState.isPrizeTabShown });
  const membersTabClass = cx(s.filterItem, { [s.filterItemIsActive]: panelState.isMembersTabShown });
  const scoreTabClass = cx(s.filterItem, { [s.filterItemIsActive]: panelState.isScoreTabShown });

  const topPlaces = [];
  const otherPlaces = [];

  const tournament = room ? tournaments.find(t => t.tournament_id === room.tournaments[0]) : undefined;
  const rulesHeaderBack = tournament ? { backgroundImage: `url('${statsApiUrl}${decodeURIComponent(tournament.header)}')` } : { backgroundImage: `url('/images/football-field.jpg'})` };

  return (
    <section className={cx(s.root, { [s.panelIsActive]: isActive })}>
      <header className={s.header}>
        <div className={s.filter}>
          <div className={rulesTabClass} onClick={() => toggleTabs(tabs.Rules)}>
            <IconSVG size="30" icon="rules-icon" cssClass={s.iconRules} />
            <FormattedMessage {...messages.rules} />
          </div>
          <div className={prizeTabClass} onClick={() => toggleTabs(tabs.Prize)}>
            <IconSVG size="30" icon="prize-icon" cssClass={s.iconPrize} />
            <FormattedMessage {...messages.prizes} />
          </div>
          <div className={membersTabClass} onClick={() => toggleTabs(tabs.Members)}>
            <IconSVG size="30" icon="users-icon" cssClass={s.iconUsers} />
            <FormattedMessage {...messages.participants} />
          </div>
          <div className={scoreTabClass} onClick={() => toggleTabs(tabs.Score)}>
            <IconSVG size="30" icon="score-icon" cssClass={s.iconScore} />
            <FormattedMessage {...messages.scoring} />
          </div>
        </div>
        {!isRoom ?
          <Link className={s.startBtn} to={room ? `/rooms/${room.room_id}` : '/'}><FormattedMessage {...messages.buttonLabel} /></Link>
        : null}
        <div className={s.closeBtn} onClick={() => closePanel()}>&times;</div>
      </header>
      <div className={s.content}>

        {panelState.isRulesTabShown ?
          <section className={s.rules}>
            <header className={s.rulesHeader} style={rulesHeaderBack}>
              <div className={s.rulesTitle}>
                {room ? getPropByLocale(room.title, currentLocale) : '-'}
              </div>
              <div className={s.rulesInfo}>
                <div className={s.rulesInfoItem}>
                  <div className={s.rulesInfoLabel}><FormattedMessage {...messages.rulesPrize} /></div>
                  <div className={s.rulesInfoText}>{room && room.prize ? `${room.prize} ${getCurrencySymbol(room.currency)}` : '-'}</div>
                </div>
                <div className={s.rulesInfoItem}>
                  <div className={s.rulesInfoLabel}><FormattedMessage {...messages.rulesFee} /></div>
                  <div className={s.rulesInfoText}>
                    {room && room.fee ? `${room.fee} ${getCurrencySymbol(room.currency)}` : <FormattedMessage {...messages.rulesFree} />}
                  </div>
                </div>
                <div className={s.rulesInfoItem}>
                  <div className={s.rulesInfoLabel}><FormattedMessage {...messages.rulesStart} /></div>
                  <div className={s.rulesInfoText}>
                    <div className={s.rulesInfoStart}>
                      {room && room.freeze ? <FormattedRelative value={new Date(room.freeze)} /> : ''}
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className={s.rulesContent}>
              <article>
                <ol>
                  <li><FormattedMessage {...messages.ruleOne} /></li>
                  <li>
                    <FormattedMessage
                      {...messages.ruleTwo}
                      values={{
                        num: room && room.plr_per_team ? room.plr_per_team : '-'
                      }}
                    />
                  </li>
                  <li>
                    <FormattedMessage
                      {...messages.ruleThree}
                      values={{
                        budget: room ? convertToMillion(room.plr_price_limit) : ''
                      }}
                    />
                  </li>
                  <li><FormattedMessage {...messages.ruleFour} /> {room ? getRoomType(room.type) : ''}</li>
                  <li>
                    {room ?
                      (room.prize_fixed ?
                        <FormattedMessage
                          {...messages.ruleFiveGuarantee}
                          values={{
                            prize: `${room.prize} ${getCurrencySymbol(room.currency)}`
                          }}
                        />
                        :
                        <FormattedMessage
                          {...messages.ruleFiveFloat}
                          values={{
                            prize: `${room.prize} ${getCurrencySymbol(room.currency)}`
                          }}
                        />
                      ) : null
                    }
                  </li>
                  <li>
                    {room && room.fee ?
                      <FormattedMessage
                        {...messages.ruleSixFee}
                        values={{
                          fee: `${room.fee} ${getCurrencySymbol(room.currency)}`
                        }}
                      />
                      :
                      <FormattedMessage {...messages.ruleSixFree} />
                    }
                  </li>
                  {room && room.bids_per_user ?
                    <li>
                      <FormattedMessage
                        {...messages.ruleSeven}
                        values={{
                          num: room.bids_per_user
                        }}
                      />
                    </li>
                  : null}
                </ol>
              </article>
            </div>
          </section>
        : null}

        {panelState.isPrizeTabShown ?
          <div className={s.prizes}>
            <div className={s.tabHeader}>
              <div className={s.tabHeaderTitle}><FormattedMessage {...messages.prizesTitle} /></div>
              <div className={s.tabHeaderSubtitle}><FormattedMessage {...messages.prizesSubTitle} /></div>
            </div>
            <div className={s.prizesTable}>
              {prizes && prizes.length > 0 ?
                <div className={s.prizesItems}>
                  {prizes.map((prize, index) => {
                    if (index < 3) {
                      topPlaces.push(
                        <div className={s.prizesTopItem} key={index}>
                          <div className={s.prizesTopItemTitle}>{`${index + 1} `} <FormattedMessage {...messages.prizesPlaceLabel} /></div>
                          <div className={s.prizesTopItemPrize}>
                            <div className={s.prizesTopItemPrizeDecor}>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                            {`${Math.round(prize)} ${room ? getCurrencySymbol(room.currency) : '₽'}`}
                            <div className={s.prizesTopItemPrizeDecor}>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      otherPlaces.push(
                        <div className={s.prizeItem} key={index}>
                          <div className={s.prizePlace}>{`${index + 1} `}<FormattedMessage {...messages.prizesPlaceLabel} /></div>
                          <div className={s.prizeCash}>{`${Math.round(prize)} ${room ? getCurrencySymbol(room.currency) : '₽'}`}</div>
                        </div>
                      );
                    }
                  })}
                  <div className={cx(s.prizesTop, { [s.prizesTopNoDecor]: prizes && prizes.length > 2 })}>
                    {topPlaces}
                  </div>
                  {otherPlaces}
                </div>
              : null}
              <div className={s.prizesBackground}></div>
            </div>
          </div>
        : null}

        {panelState.isScoreTabShown ?
          <div>
            <div className={s.tabHeader}>
              <div className={s.tabHeaderTitle}><FormattedMessage {...messages.scoringTitle} /></div>
              <div className={s.tabHeaderSubtitle}><FormattedMessage {...messages.scoringSubTitle} /></div>
            </div>
            <Scoring />
            <div className={s.rulesContent}>
              <article>
                <FormattedMessage {...messages.scoringText} />
              </article>
            </div>
          </div>
        : null}

        {panelState.isMembersTabShown && bids ?
          <div className={cx(s.members, { [s.isFutureRoom]: room && room.status === ROOM_STATUS_NEW })}>
            <div className={s.tabHeader}>
              <div className={s.tabHeaderTitle}>
                {room ? getPropByLocale(room.title, currentLocale) : room.room_id }
              </div>
              <div className={s.membersHeader}>
                <div className={s.memberPlace}>
                  {room && room.status === ROOM_STATUS_NEW ? '#' : <FormattedMessage {...messages.participantsPlace} />}
                </div>
                <div className={s.memberTeam}><FormattedMessage {...messages.participantsTeam} /></div>
                <div className={s.memberName}><FormattedMessage {...messages.participantsName} /></div>
                <div className={s.memberPoints}><FormattedMessage {...messages.participantsPoints} /></div>
              </div>
            </div>
            <div className={s.memberList}>
              <div className={s.memberItems}>
                {bids.length > 0 ?
                  bids.map((bid, index) =>
                    <div className={cx(s.member, { [s.memberIsColored]: user && bid.user_id === user.user_id })} key={bid.bid_id}>
                      <div className={s.memberPlace}>
                        {room && room.status === ROOM_STATUS_NEW ? `${index + 1}` : `${bid.place}`}
                      </div>
                      <div className={s.memberTeam}>{bid.title}</div>
                      <div className={s.memberName}>{bid.user}</div>
                      <div className={s.memberPoints}>{bid.score}</div>
                    </div>
                  )
                  :
                  <div className={s.memberEmptyMsg}><FormattedMessage {...messages.participantsEmpty} /></div>
                }
              </div>
              <div className={s.memberBackground}></div>
            </div>
          </div>
        : null}
      </div>
    </section>
  );
}

RoomInfoPanel.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isRoom: PropTypes.bool,
  room: PropTypes.object,
  bids: PropTypes.array,
  tournaments: PropTypes.array,
  prizes: PropTypes.array,
  user: PropTypes.object,
  panelState: PropTypes.object,
  toggleTabs: PropTypes.func,
  closePanel: PropTypes.func,
  tabs: PropTypes.object,
  currentLocale: PropTypes.string,
};

export default withStyles(s)(RoomInfoPanel);
