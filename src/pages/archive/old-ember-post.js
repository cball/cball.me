import React from 'react';

const OldEmberPost = () => {
  const cachedUrl = `http://webcache.googleusercontent.com/search?q=cache:${
    document.referrer
  }`;

  return (
    <div>
      <h1>That page has been archived.</h1>
      <p>
        Ember has gone through a lot of changes in recent years, and I don't
        want to confuse newcomers by having outdated content.
      </p>
      <p>
        If you still really want to read it, try Google's{' '}
        <a href={cachedUrl}>cached version</a>
      </p>
    </div>
  );
};

export default OldEmberPost;
