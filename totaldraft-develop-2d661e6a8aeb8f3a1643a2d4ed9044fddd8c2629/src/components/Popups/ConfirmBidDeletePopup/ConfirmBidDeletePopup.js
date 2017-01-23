import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import s from './ConfirmBidDeletePopup.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Popup from '../Popup';
import messages from './messages';

class ConfirmBidDeletePopup extends Component {

  static propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    bid: PropTypes.object,
    note: PropTypes.string
  };

  render() {
    const { bid, isOpen, note, onClose, onSubmit } = this.props;

    const popupTitle = <FormattedMessage {...messages.title} values={{ team: bid ? `"${bid.title}"` : '' }} />

    return (
      <Popup
        isOpen={isOpen}
        onClose={ () => onClose() }
        title={popupTitle}
      >
        <div className={s.root}>
          {note ?
            <div className={s.note}>{note}</div>
          : null}
          <div className={s.formSectionButtons}>
            <div className={s.btnSubmit} onClick={ () => onSubmit(bid.bid_id) }>
              <FormattedMessage {...messages.deleteLabel} />
            </div>
            <div className={s.btn} onClick={ () => onClose() }>
              <FormattedMessage {...messages.cancelLabel} />
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

export default withStyles(s)(ConfirmBidDeletePopup);
