import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from 'components/Link';
import s from './Footer.css';
import messages from './messages';

class Footer extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired
  }

  render() {
    const { intl } = this.props;
    const { formatMessage } = intl;

    return (
      <footer className={s.footer}>
        <div className={s.credentials}>
          <span className={s.copyright}>{`© ${new Date().getFullYear()} TotalDraft`}</span>
          <img src="/images/vbyvisa_wht.png" alt="Verified by VISA" />
          <img src="/images/ms_accpt_103_png.png" alt="Maestro" />
          <img src="/images/mc_accpt_103_png.png" alt="MasterCard" />
        </div>
        <div>
          <Link to="/terms-and-conditions">{formatMessage(messages.terms)}</Link>
          <Link to="/privacy-policy">{formatMessage(messages.privacy)}</Link>
          <Link to="/contacts">{formatMessage(messages.contacts)}</Link>
        </div>
      </footer>
    );
  }
}

export default injectIntl(withStyles(s)(Footer));
