import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { sortRoomsSelector, getSortColumn, getSortDirection } from '../../selectors';
import { SORT_DIRECTION_ASC, SORT_DIRECTION_DESC } from '../../constants';
import { applySort } from '../../actions';
import auth from 'modules/auth';
import intlModule from 'modules/intl';
import RoomList from './RoomList';

class Rooms extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string,
    sortedRooms: PropTypes.array,
    user: PropTypes.object,
    currentLocale: PropTypes.string.isRequired
  };

  applySortForColumn(column) {
    const { dispatch, sortColumn, sortDirection } = this.props;
    const direction = (column !== sortColumn || sortDirection === SORT_DIRECTION_DESC) ?
      SORT_DIRECTION_ASC : SORT_DIRECTION_DESC;
    dispatch(applySort(direction, column));
  }

  render() {
    const { sortedRooms, sortColumn, sortDirection, user, currentLocale } = this.props;

    return (
      <RoomList
        user={user}
        sortedRooms={sortedRooms}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        currentLocale={currentLocale}
        applySortForColumn={column => this.applySortForColumn(column)}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    sortedRooms: sortRoomsSelector,
    sortColumn: getSortColumn,
    sortDirection: getSortDirection,
    user: auth.selectors.getUser,
    currentLocale: intlModule.selectors.getLocale,
  })
)(Rooms);
