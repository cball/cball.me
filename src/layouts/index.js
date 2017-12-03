import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Sidebar from '../components/sidebar';

import './index.css';

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Chris Ball - Speaker, Maker, Entreprenuer."
      // meta={[
      //   { name: 'description', content: '' },
      //   { name: 'keywords', content: 'sample, something' }
      // ]}
    />
    <div className="container">
      <Sidebar />
      <main>
        <div className="body-wrapper">{children()}</div>
      </main>
    </div>
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;
