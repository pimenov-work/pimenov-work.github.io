import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import s from './App.css';
import Header from '../Header';
import Login from '../Login';
import NotificationPanel from '../NotificationPanel';
import appstate from '../../modules/appstate';
import auth from '../../modules/auth';

class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      createHref: PropTypes.func.isRequired,
      store: PropTypes.object.isRequired,
      insertCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func,
    }).isRequired,
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
    appStatus: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    clientIp: PropTypes.string,
    isHidden: PropTypes.bool,
    isMobileMenuHidden: PropTypes.bool
  };

  static childContextTypes = {
    pathname: PropTypes.string.isRequired,
    createHref: PropTypes.func.isRequired,
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      pathname: context.pathname,
      createHref: context.createHref,
      insertCss: context.insertCss || emptyFunction,
      setTitle: context.setTitle || emptyFunction,
      setMeta: context.setMeta || emptyFunction,
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);

    const { dispatch, clientIp } = this.props;
    if (!clientIp) {
      dispatch(auth.actions.getClientIP());
    }
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    const { error } = this.props;
    if (error && error.status !== 404) {
      return this.props.children;
    }

    const { pathname } = this.props.context;
    const { appStatus, isHidden } = this.props;

    return (
      <div className={s.root}>
        <Header pathname={pathname} isMobileMenuHidden={this.props.isMobileMenuHidden} />
        <Login pathname={pathname} />
        <div className={cx(s.container, { [s.isHidden]: isHidden, [s.isMobileMenuHidden]: this.props.isMobileMenuHidden })}>
          {this.props.children}
        </div>
        <NotificationPanel appStatus={appStatus} />
      </div>
    );
  }

}

export default connect(
  createStructuredSelector({
    isHidden: appstate.selectors.getLoginVisibleStatus,
    clientIp: auth.selectors.getClientIp,
    appStatus: appstate.selectors.getAppStatus
  })
)(App);
