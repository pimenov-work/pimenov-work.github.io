import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import s from './ScoringTable.css';
import messages from './messages';

function ScoringTable() {
  return (
    <table className={s.scoring}>
      <thead>
        <tr>
          <td className={s.subheader}><FormattedMessage {...messages.userActions} /></td>
          <td><FormattedMessage {...messages.goalkeeper} /></td>
          <td><FormattedMessage {...messages.defender} /></td>
          <td><FormattedMessage {...messages.midfielder} /></td>
          <td><FormattedMessage {...messages.forward} /></td>
        </tr>
      </thead>
      <tbody>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.minutesLess60} /></td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.minutesMore60} /></td>
          <td>2</td>
          <td>2</td>
          <td>2</td>
          <td>2</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.assist} /></td>
          <td>3</td>
          <td>3</td>
          <td>3</td>
          <td>3</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.scoredGoal} /></td>
          <td>6</td>
          <td>6</td>
          <td>5</td>
          <td>4</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.yellowCard} /></td>
          <td>-1</td>
          <td>-1</td>
          <td>-1</td>
          <td>-1</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.redCard} /></td>
          <td>-3</td>
          <td>-3</td>
          <td>-3</td>
          <td>-3</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.allowedGoal} /></td>
          <td>-1</td>
          <td>-1</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.ownGoal} /></td>
          <td>-3</td>
          <td>-3</td>
          <td>-4</td>
          <td>-5</td>
        </tr>
        <tr>
          <td colSpan="5" className={s.subheader}>
            <FormattedMessage {...messages.teamRating} />
          </td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.cleanSheet} /></td>
          <td>4</td>
          <td>4</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.every3saves} /></td>
          <td>1</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.ballPossession} /></td>
          <td>0</td>
          <td>0</td>
          <td>1</td>
          <td>0</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.target5shots} /></td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>1</td>
        </tr>
        <tr className={s.onHover}>
          <td><FormattedMessage {...messages.scored2goals} /></td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>1</td>
        </tr>
      </tbody>
    </table>
  );
}

export default withStyles(s)(ScoringTable);
