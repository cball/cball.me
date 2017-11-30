import bike from '../../images/bike-bg.png';

export default {
  myInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  name: {
    fontSize: 24
  },
  bio: {
    marginTop: '1rem',
    marginBottom: '1.4rem',
    fontSize: 14,
    lineHeight: 1.4,
    opacity: 0.8
  },
  headshot: {
    borderRadius: 4,
    height: 100,
    alignSelf: 'center'
  },
  sidebar: {
    backgroundImage: `url(${bike})`,
    backgroundPosition: 'center'
  }
};
