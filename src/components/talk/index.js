import React from 'react';
import moment from 'moment';
import VideoIcon from 'mdi-react/VideoIcon';
import ProjectorScreenIcon from 'mdi-react/ProjectorScreenIcon';

import styles from './styles';

const Talk = ({ talk }) => {
  const { locationLink, location, title, slides, video, date } = talk;
  const formattedDate = moment(date).format('L');

  return (
    <div className={styles.talk}>
      <div>
        <div className={styles.title}>{title}</div>

        {locationLink ? (
          <a className={styles.location} href={locationLink}>
            {location} - {formattedDate}
          </a>
        ) : (
          <div className={styles.location}>
            {location} - {formattedDate}
          </div>
        )}
      </div>
      <div className={styles.iconLinks}>
        {slides && (
          <a href={slides} target="_blank">
            <ProjectorScreenIcon className={styles.icon} />
          </a>
        )}
        {video && slides && <span className={styles.separator}> - </span>}
        {video && (
          <a href={video} target="_blank">
            <VideoIcon className={styles.icon} />
          </a>
        )}
      </div>
    </div>
  );
};

export default Talk;
