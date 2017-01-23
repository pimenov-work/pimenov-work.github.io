import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import s from './SearchBlock.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import messages from './messages';

class SearchBlock extends Component {

  static propTypes = {
    handleSearchChange: PropTypes.func.isRequired,
    handleSearchActive: PropTypes.func,
    white: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isSearchShown: false
    };
  }

  handleInputChange(e) {
    const { handleSearchChange } = this.props;
    handleSearchChange(e.currentTarget.value);
  }

  toggleSearch() {
    const { handleSearchActive } = this.props;
    if (typeof handleSearchActive === 'function') {
      handleSearchActive(!this.state.isSearchShown);
    }
    this.setState({ isSearchShown: !this.state.isSearchShown });
    this.searchInput.focus();
  }

  closeSearch() {
    const { handleSearchChange, handleSearchActive } = this.props;
    this.searchInput.value = '';
    handleSearchChange(this.searchInput.value);
    if (typeof handleSearchActive === 'function') {
      handleSearchActive(false);
    }
    this.setState({ isSearchShown: false });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const searchBoxClass = cx(s.root, {
      [s.isActive]: this.state.isSearchShown, [s.isWhite]: this.props.white
    });

    return (
      <div className={searchBoxClass}>
        <img className={s.showBtn} src="/images/search.svg" onClick={() => this.toggleSearch()} />
        <div className={s.holder}>
          <input
            className={s.input}
            type="text"
            placeholder={formatMessage(messages.label)}
            onChange={(e) => this.handleInputChange(e)}
            ref={(ref) => this.searchInput = ref}
          />
          <span className={s.closeBtn} onClick={() => this.closeSearch()}>&times;</span>
        </div>
      </div>
    );
  }
}

export default injectIntl(withStyles(s)(SearchBlock));
