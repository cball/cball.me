import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';

const IndexPage = () => (
  <div>
    <div className="card padding">
      <Title>TALKS</Title>
    </div>
    <div className="card padding">
      <h3>Upcoming</h3>
      <p>(none yet!)</p>
      {/* <Link to="/page-2/">Go to page 2</Link> */}
      <h3>2017</h3>
      <ul>
        <li>
          <div>
            <a href="https://infinite.red/ChainReactConf/2017">Chain React</a> -
            From Idea to App Store: A Guide to Shipping React Native Apps
          </div>
          <div>
            <a href="">Video</a>
            -
            <a
              href="https://speakerdeck.com/cball/from-idea-to-app-store-a-guide-to-shipping-react-native-apps"
              target="_blank"
            >
              Slides
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="https://twitter.com/reactnativebos">React Native Boston</a>{' '}
            - From Idea to "Hey It Works": Building an app with React Native
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/from-idea-to-hey-it-works-building-an-app-with-react-native"
              target="_blank"
            >
              Slides
            </a>
          </div>
        </li>
      </ul>

      <h3>2016</h3>
      <ul>
        <li>
          <div>
            <span>Boston Frontend - Betting on React Native</span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/betting-on-react-native"
              target="_blank"
            >
              Slides
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="">Boston Ember</a> -{' '}
            <span>ember addon deep dive: modifying the build process</span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/ember-addon-deep-dive-modifying-the-build-process"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="">EmberConf</a> -{' '}
            <span>Cross-Pollinating Communities: We all Win</span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/cross-pollinating-communities-we-all-win"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="">Ember Bangalore</a> -{' '}
            <span>Living in a Component World</span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/living-in-a-component-world"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
      </ul>

      <h3>2015</h3>
      <ul>
        <li>
          <div>
            <a href="">Windy City Rails</a> -{' '}
            <span>
              Mind the Front-end Gap: Navigating the Path from Rails to Ember
            </span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/mind-the-front-end-gap-navigating-the-path-from-rails-to-ember"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="">Ember NYC</a> -{' '}
            <span>The Words are Mightier Than the Code.</span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/the-words-are-mightier-than-the-code"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
      </ul>

      <h3>2014</h3>
      <ul>
        <li>
          <div>
            <a href="">Ember.js Philly</a> -{' '}
            <span>
              Embracing Ember Conventions: Loading and Error Substates
            </span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/embracing-ember-conventions-loading-and-error-substates"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
        <li>
          <div>
            <a href="">Boston Ember</a> - <span>Real World Fixtures</span>
          </div>
          <div>
            <a
              href="https://speakerdeck.com/cball/real-world-fixtures"
              target="_blank"
            >
              slides
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
);

const Content = styled.div`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;
const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 0;
  // text-align: center;
`;

export default IndexPage;
