'use strict';

// Use this file for redirects instead of Netlify's _redirects.
// This keeps the configuration the same regardless of host.
exports.createPages = ({ boundActionCreators }) => {
  const { createRedirect } = boundActionCreators;

  createRedirect({
    fromPath: `/bring-some-es6-awesome-with-esnext`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });

  createRedirect({
    fromPath: `/organize-your-ember-app-with-pods`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });

  createRedirect({
    fromPath: `/i18n-in-practice`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });

  createRedirect({
    fromPath: `/not-using-i18n-you-probably-should-be`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });

  createRedirect({
    fromPath: `/understanding-loading-substates-in-ember`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });

  createRedirect({
    fromPath: `/non-restful-api-calls-with-ember-data`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });

  createRedirect({
    fromPath: `/help-i-have-no-tests`,
    toPath: `/archive/old-ember-post/`,
    isPermanent: true,
    redirectInBrowser: true
  });
};
