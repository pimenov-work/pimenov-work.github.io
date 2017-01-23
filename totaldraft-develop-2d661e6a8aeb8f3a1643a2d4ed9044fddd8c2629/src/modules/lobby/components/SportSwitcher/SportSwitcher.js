import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import IconSVG from 'components/IconSVG'; // eslint-disable-line import/no-unresolved
import s from './SportSwitcher.css';
import messages from './messages';

class SportSwitcher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isHovering: false
    };
  }

  handlePanelMouseOver() {
    // this.setState({ isHovering: true });
  }

  handlePanelMouseLeave() {
    // this.setState({ isHovering: false });
  }

  handleCountryMouseOver() {
    // this.setState({ isActive: true });
  }

  handleSwitcherMouseLeave() {
    // this.setState({ isActive: false });
  }

  render() {
    return (
      <section
        className={s.root}
        onMouseLeave={() => this.handleSwitcherMouseLeave()}
      >
        <div
          className={cx(s.list, { [s.listIsActive]: this.state.isActive })}
          onMouseOver={() => this.handlePanelMouseOver()}
          onMouseLeave={() => this.handlePanelMouseLeave()}
        >
          <div className={s.listItem}>
            <img className={s.countryIcon} src="/images/eng-flag.svg" role="presentation" />
            Англия
          </div>
          <div className={s.listItem}>
            <img className={s.countryIcon} src="/images/fra-flag.svg" role="presentation" />
            Франция
          </div>
          <div className={s.listItem}>
            <img className={s.countryIcon} src="/images/spa-flag.svg" role="presentation" />
            Испания
          </div>
          <div className={s.listItem}>
            <img className={s.countryIcon} src="/images/ger-flag.svg" role="presentation" />
            Германия
          </div>
          <div className={s.listItem}>
            <img className={s.countryIcon} src="/images/ita-flag.svg" role="presentation" />
            Италия
          </div>
          <div className={s.delimiter}></div>
          <div className={s.listItem}>
            <IconSVG size="30" icon="football-icon" />
            UEFA
          </div>
          <div className={s.listItem}>
            <IconSVG size="30" icon="football-icon" />
            World Cup
          </div>
        </div>
        <div className={s.categories}>
          <div className={s.categoryIsActive}>
            <IconSVG size="30" icon="football-icon" />
            <FormattedMessage {...messages.football} />
          </div>
          {/*
          <div
            className={s.categoryIsActive}
            onMouseOver={ () => this.handleCountryMouseOver() }
          >
            <img className={s.countryIcon} src="/images/rus-flag.svg" />
            Футбол
          </div>
          <div className={s.categoryIsDisabled} onMouseOver={ () => this.handleSportMouseOver() }>
            <IconSVG size="30" icon="basketball-icon" />
            баскетбол
          </div>
          <div className={s.categoryIsDisabled} onMouseOver={ () => this.handleSportMouseOver() }>
            <IconSVG size="30" icon="hockey-icon" />
            хоккей
          </div>
          */}
        </div>
      </section>
    );
  }
}

export default withStyles(s)(SportSwitcher);
