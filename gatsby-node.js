'use strict';

exports.createPages = ({ boundActionCreators }) => {
  const { createRedirect } = boundActionCreators;

  createRedirect({
    fromPath: `/bring-some-es6-awesome-with-esnext`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });
};
