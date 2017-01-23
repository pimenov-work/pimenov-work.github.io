import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TemplateDeletePopup.css';
import Popup from '../Popup';
import messages from './messages';

class TemplateDeletePopup extends Component {

  static propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    template: PropTypes.object,
    note: PropTypes.string
  };

  render() {
    const { template, isOpen, note, onClose, onSubmit } = this.props;
    const popupTitle = <FormattedMessage {...messages.title} values={{ name: template ? `"${template.title}"` : '' }} />;

    return (
      <Popup
        isOpen={isOpen}
        onClose={() => onClose()}
        title={popupTitle}
      >
        <div className={s.root}>
          {note ?
            <div className={s.note}>{note}</div>
          : null}
          <div className={s.formSectionButtons}>
            <div className={s.btnSubmit} onClick={() => onSubmit(template)}>
              <FormattedMessage {...messages.deleteLabel} />
            </div>
            <div className={s.btn} onClick={() => onClose()}>
              <FormattedMessage {...messages.cancelLabel} />
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

export default withStyles(s)(TemplateDeletePopup);
