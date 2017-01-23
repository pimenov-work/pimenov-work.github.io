import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Checkbox.css';

class Checkbox extends Component {

  static propTypes = {
    isChecked: PropTypes.bool.isRequired,
    label: PropTypes.string,
    id: PropTypes.string,
    cssClass: PropTypes.string,
    isDarkColored: PropTypes.bool,
    toggleCheckbox: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.isChecked
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ isChecked: props.isChecked });
  }

  toggle() {
    this.setState({ isChecked: !this.state.isChecked });
    this.props.toggleCheckbox(!this.state.isChecked);
  }

  render() {
    const { label, id, cssClass } = this.props;
    const checkboxClass = cx([s.root, cssClass], {
      [s.isChecked]: this.state.isChecked,
      [s.isLightColored]: !this.props.isDarkColored
    });

    return (
      <div className={checkboxClass} id={id || ''}>
        <div
          className={s.check}
          onClick={() => this.toggle()}
        ></div>
        <label className={s.label}>
          {this.props.children ? this.props.children : label}
        </label>
      </div>
    );
  }
}

export default withStyles(s)(Checkbox);
