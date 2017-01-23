/* eslint-disable no-shadow */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './LanguageSwitcher.css';
import IconSVG from 'components/IconSVG';
import Link from 'components/Link';
import intlModule from 'modules/intl';
import runtimeModule from 'modules/runtime';

class LanguageSwitcher extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    availableLocales: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };
  }

  mouseOver() {
    this.setState({ hover: true });
  }

  mouseLeave() {
    this.setState({ hover: false });
  }

  isSelected(locale) {
    const { currentLocale } = this.props;
    return locale === currentLocale;
  }

  render() {
    const { dispatch, currentLocale, availableLocales } = this.props;

    return (
      <div
        className={cx(s.locales, { [s.localesIsShown]: this.state.hover })}
        onMouseLeave={() => this.mouseLeave()}
      >
        <div
          className={s.localeIsActive}
          onMouseOver={() => this.mouseOver()}
          onClick={() => this.setState({ hover: true })}
        >
          <span>{currentLocale ? currentLocale.substring(0, 2) : null}</span>
          <IconSVG size="12" icon="smart-arrow-down" />
        </div>
        <div className={s.list}>
          {availableLocales.map(locale => (
            !this.isSelected(locale) ? (
              <Link
                to={`?lang=${locale}`}
                key={locale}
                className={s.locale}
                onClick={(e) => {
                  dispatch(intlModule.actions.setLocale({locale}));
                  e.preventDefault();
                  this.setState({ hover: false });
                }}
              >
                <span>{locale.substring(0, 2)}</span>
                <IconSVG size="12" icon="smart-arrow-right" />
              </Link>
            ) : null
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    availableLocales: runtimeModule.selectors.getRuntimeAvailableLocales,
    currentLocale: intlModule.selectors.getLocale,
  })
)(withStyles(s)(LanguageSwitcher));
