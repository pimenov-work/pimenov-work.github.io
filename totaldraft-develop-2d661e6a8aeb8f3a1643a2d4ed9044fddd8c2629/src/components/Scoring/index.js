import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Scoring.css';
import ScoringTable from '../ScoringTable';

function Scoring() {
  return (
    <section className={s.root}>
      <div className={s.content}>
        <ScoringTable />
      </div>
    </section>
  );
}

export default withStyles(s)(Scoring);
