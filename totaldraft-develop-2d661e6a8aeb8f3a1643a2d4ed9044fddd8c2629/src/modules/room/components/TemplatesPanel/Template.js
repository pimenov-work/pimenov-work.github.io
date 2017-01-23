import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TemplatesPanel.css';
import IconSVG from 'components/IconSVG';

function Template({ template, makeABet, isUserTemplateValid, openTeamDetails, openDeleteTemplatePopup }) {
  return (
    <div className={s.team} onClick={() => makeABet(template)}>
      <div className={s.teamInfo}>
        <div className={s.teamTitle}>{template.title}</div>
        {/*
          <div className={s.teamAchievements}>
            <img src="/images/star-orange.svg" />
          </div>
        */}
        <div
          className={!isUserTemplateValid(template) ? s.alertBtn : s.teamBtn}
          onClick={(e) => {
            e.stopPropagation();
            openTeamDetails(template);
          }}>
          {!isUserTemplateValid(template) ?
            <IconSVG icon="alert-icon" size="30" cssClass={s.alertIcon} />
            :
            <IconSVG icon="info-light-icon" size="16" />
          }
        </div>
      </div>
        <div
          className={s.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            openDeleteTemplatePopup();
          }}
        >
          <IconSVG icon="delete-icon" size="24" cssClass={s.deleteIcon} />
        </div>
    </div>
  );
}

Template.propTypes = {
  template: PropTypes.object.isRequired,
  isUserTemplateValid: PropTypes.func,
  makeABet: PropTypes.func,
  openTeamDetails: PropTypes.func,
  openDeleteTemplatePopup: PropTypes.func,
};

export default withStyles(s)(Template);
