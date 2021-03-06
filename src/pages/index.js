import React from 'react';
import Link from 'gatsby-link';
import Talk from '../components/talk';
import talks from '../../data/talks';
import partition from 'lodash.partition';
import groupBy from 'lodash.groupby';

import styles from '../styles/index';

// sort and group talks
const today = new Date();
const sortedTalks = talks.sort((a, b) => b.date - a.date);
const [upcomingTalks, pastTalks] = partition(sortedTalks, t => t.date > today);
const groupedPastTalks = groupBy(pastTalks, t => t.date.year());
const years = Object.keys(groupedPastTalks).sort((a, b) => b - a);

const IndexPage = () => (
  <div>
    <div className="card padding">
      <div className={styles.title}>Conference and Meetup Talks</div>
    </div>
    <div className="card padding">
      <div className="talk-section-wrapper" style={{ marginBottom: '1.5rem' }}>
        <h3 className="talk-section">Upcoming</h3>
        {upcomingTalks.length === 0 && (
          <ul className="year-block">
            <li>(none scheduled yet!)</li>
          </ul>
        )}
        {upcomingTalks.reverse().map(t => <Talk talk={t} />)}
      </div>

      <div className="talk-section-wrapper">
        {years.map((year, index) => {
          const talks = groupedPastTalks[year];

          return (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <h3 className="talk-section">{year}</h3>
              <ul className="year-block">
                {talks.map((t, i) => (
                  <li key={i}>
                    <Talk talk={t} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default IndexPage;
