import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Footer from '../Footer';
import s from './ContentPage.css';

function ContentPage({ title, children }, context) {
  if (context.setTitle) {
    context.setTitle(title);
  }
  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.content}>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

ContentPage.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};
ContentPage.contextTypes = {
  setTitle: PropTypes.func.isRequired
};

export default withStyles(s)(ContentPage);
