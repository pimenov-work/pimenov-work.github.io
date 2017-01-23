import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from './Header';
import authModule from 'modules/auth';
import appstateModule from 'modules/appstate';
import mygamesModule from 'modules/mygames';

class HeaderHOC extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    initInfo: PropTypes.object,
    isHidden: PropTypes.bool.isRequired,
    initAppState: PropTypes.object,
    mygames: PropTypes.object,
    prizes: PropTypes.array,
    pathname: PropTypes.string,
    isMobileMenuHidden: PropTypes.bool
  };

  render() {
    const { user, isHidden, initAppState, dispatch, mygames,
      prizes, pathname, isMobileMenuHidden } = this.props;

    return (
      <Header
        user={user}
        isHidden={isHidden}
        initAppState={initAppState}
        mygames={mygames}
        prizes={prizes}
        path={pathname}
        isMobileMenuHidden={isMobileMenuHidden}
        showLoginScreen={() => dispatch(appstateModule.actions.showLoginScreen())}
        logout={() => dispatch(authModule.actions.logoutAndRedirect())}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    user: authModule.selectors.getUser,
    prizes: authModule.selectors.getUserPrizes,
    isHidden: appstateModule.selectors.getLoginVisibleStatus,
    initInfo: appstateModule.selectors.getInitInfo,
    initAppState: appstateModule.selectors.getInitInfo,
    mygames: mygamesModule.selectors.getAllState,
  })
)(HeaderHOC);
