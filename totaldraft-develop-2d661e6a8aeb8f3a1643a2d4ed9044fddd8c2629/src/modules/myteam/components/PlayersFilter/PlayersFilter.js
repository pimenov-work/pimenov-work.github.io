import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { positionsMapFullTitle, positionsMap } from '../../constants';
import s from './PlayersFilter.css';

class PlayersFilter extends Component {

  static propTypes = {
    filterByPosition: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired
  };

  filterByPosition(postion) {
    this.props.filterByPosition(postion);
  }

  createPosFilter(posObject) {
    const filterItems = [];
    let index = 0;

    for (let key in posObject) {
      if (posObject.hasOwnProperty(key)) {
        filterItems.push(
          <span
            key={index++}
            className={(this.props.filter.position === key) ? s.itemIsActive : s.item}
            onClick={() => this.filterByPosition(key)}
          >{posObject[key]}</span>
        );
      }
    }

    return filterItems;
  }

  render() {
    const fullPosFilter = this.createPosFilter(positionsMapFullTitle);
    const shortPosFilter = this.createPosFilter(positionsMap);

    return (
      <div className={s.root}>
        <div className={s.fullPositions}>{fullPosFilter}</div>
        <div className={s.shortPositions}>{shortPosFilter}</div>
      </div>
    );
  }
}

export default withStyles(s)(PlayersFilter);
