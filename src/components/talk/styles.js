import { css } from 'emotion';

export default {
  talk: css`
    margin-bottom: 2rem;
    line-height: 1.3;
  `,
  title: css`
    font-size: 24px;
  `,
  location: css`
    display: block;
    font-size: 15px;
    color: #aaa;
    text-decoration: none;
  `,
  iconLinks: css`
    margin-top: 0.5rem;
    display: flex;
    align-items: middle;
    color: #39393a;
    opacity: 0.7;
  `,
  icon: css`
    fill: #39393a;
    transition: fill 0.5s ease;

    &:hover {
      fill: red;
    }
  `,
  separator: css`
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  `
};
