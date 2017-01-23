import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigate } from '../../routes/actions';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends Component {

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    children: PropTypes.node,
    onClick: PropTypes.func,

    // actions
    navigate: PropTypes.func,
  };

  static contextTypes = {
    createHref: PropTypes.func.isRequired,
  };

  handleClick = (event) => {
    let allowTransition = true;

    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      allowTransition = false;
    }

    event.preventDefault();

    if (allowTransition) {
      if (this.props.to) {
        this.props.navigate(this.props.to);
      } else {
        this.props.navigate({
          pathname: event.currentTarget.pathname,
          search: event.currentTarget.search,
        });
      }
    }
  };

  render() {
    const {
      to,
      navigate, // eslint-disable-line no-unused-vars, no-shadow
      children,
      ...props,
    } = this.props;
    return (
      <a href={this.context.createHref(to)} {...props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }

}

const mapState = null;

const mapDispatch = {
  navigate,
};

export default connect(mapState, mapDispatch)(Link);
