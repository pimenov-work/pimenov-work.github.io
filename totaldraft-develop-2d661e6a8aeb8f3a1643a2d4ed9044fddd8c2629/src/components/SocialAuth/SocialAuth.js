import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './SocialAuth.css';
import appstateModule from '../../modules/appstate';
import authModule from '../../modules/auth';
import { lobbyApiUrl } from '../../config';
import { getURLParameterByName, APIErrorMatcher } from '../../utils';
import { redirect } from '../../routes/actions';
import messages from './messages';

class SocialAuth extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    refCode: PropTypes.string,
    isDarkColored: PropTypes.bool,
    isRedirectDisabled: PropTypes.bool
  };

  componentDidMount() {
    const { dispatch, isRedirectDisabled } = this.props;
    const { AuthVisibilityFilters } = appstateModule.constants;

    window.receiveSocialToken = response => {
      if (response && !response.error) {
        const { token } = response.data;

        dispatch(authModule.actions.fetchUserData(token))
          .then(res => {
            if (!res.error) {
              const { user } = res.data;

              if (!user.data.r && !isRedirectDisabled) {
                return dispatch(redirect('/rules-confirmation'));
              }

              dispatch(appstateModule.actions.hideLoginScreen());
              dispatch(appstateModule.actions.setAuthVisibilityFilter(AuthVisibilityFilters.SHOW_LOGIN));
            }
          }
        );
      } else {
        const errMsg = APIErrorMatcher(response.data.error);
        dispatch(appstateModule.actions.showGlobalNotification(errMsg, true));
      }
    };
  }

  socialLogin(service) {
    const code = this.props.refCode;
    let refcode = (typeof window === 'object') ? getURLParameterByName('refcode', window.location.href) : null;
    if (code && (refcode !== code)) {
      refcode = code;
    }
    const codeParam = refcode ? `?refcode=${refcode}` : '';
    const url = `${lobbyApiUrl}/oauth/${service}/login${codeParam}`;
    const w = 600;
    const h = 350;
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, 'Socials Auth', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`);
  }

  render() {
    return (
      <section className={cx(s.social, { [s.isDarkColored]: this.props.isDarkColored })}>
        <div className={s.subtitle}>
          <FormattedMessage {...messages.title} />
        </div>
        <div className={s.socialButtons}>
          <div className={s.socialButton} onClick={() => this.socialLogin('vk')}>
            <span className={s.socialIcon} dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M7.828 12.526h.957s.288-.032.436-.19c.137-.147.133-.42.133-.42s-.02-1.284.576-1.473c.587-.187 1.34 1.24 2.14 1.788.604.416 1.063.326 1.063.326l2.137-.03s1.117-.07.587-.948c-.043-.072-.308-.65-1.588-1.838-1.34-1.244-1.162-1.043.452-3.194.983-1.31 1.376-2.11 1.253-2.452-.117-.326-.84-.24-.84-.24l-2.406.015s-.18-.025-.31.054c-.13.077-.213.258-.213.258s-.38 1.013-.89 1.876c-1.07 1.82-1.5 1.915-1.674 1.802-.407-.264-.305-1.058-.305-1.622 0-1.763.267-2.498-.52-2.688-.263-.063-.455-.105-1.124-.112-.86-.01-1.585.003-1.996.204-.274.134-.485.433-.357.45.16.02.52.097.71.357.248.335.24 1.088.24 1.088s.14 2.075-.33 2.333c-.326.177-.77-.184-1.726-1.834-.49-.845-.858-1.78-.858-1.78s-.072-.174-.2-.268c-.153-.113-.368-.15-.368-.15L.52 3.855s-.342.01-.468.16c-.112.132-.01.406-.01.406s1.79 4.187 3.818 6.298c1.858 1.935 3.968 1.808 3.968 1.808z" fill="#292929"/></svg>' }}></span>
          </div>
          <div className={s.socialButton} onClick={() => this.socialLogin('fb')}>
            <span className={s.socialIcon} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 155.139 155.139" xml:space="preserve" enable-background="new 0 0 155.139 155.139"><path id="f_1_" d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-0.006V1.08C115.325 0.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761H89.584z" fill="#292929"/></svg>' }}></span>
          </div>
        </div>
        <div className={s.socialText}>
          <FormattedMessage {...messages.text} />
        </div>
      </section>
    );
  }
}

export default connect()(withStyles(s)(SocialAuth));
