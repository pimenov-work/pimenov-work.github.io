import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Modal from 'react-modal';
import IconSVG from 'components/IconSVG';
import s from './Popup.css';

class Popup extends Component {

  static propTypes = {
    children: PropTypes.element,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.any,
    cssClass: PropTypes.string
  };

  render() {
    const customStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(30, 30, 30, 0.75)',
        zIndex: 9999
      },
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        // padding: '60px 70px',
        padding: '0',
        transform: 'translate(-50%, -50%)',
        color: '#191919',
        background: '#fff',
        border: 'none',
        borderRadius: '0',
        boxSizing: 'border-box',
        boxShadow: '0 9px 100px 0 rgba(0, 0, 0, 0.5)'
      }
    };

    return (
      <Modal isOpen={this.props.isOpen} onRequestClose={this.props.onClose} style={customStyles}>
        <div className={cx(s.root, { [this.props.cssClass]: this.props.cssClass })}>
          <div className={s.closeBtn} onClick={() => this.props.onClose()}>
            <IconSVG icon="close-icon" size="16" />
          </div>
          <header className={s.header}>
            <div className={s.title}>{this.props.title}</div>
          </header>
          {this.props.children}
        </div>
      </Modal>
    );
  }
}

export default withStyles(s)(Popup);
