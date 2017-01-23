import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import Link from 'components/Link';
import Footer from 'components/Footer';
import tournamentsModule from 'modules/tournaments';
import lobbyModule from 'modules/lobby';
// import TournamentSelector from './TournamentSelector';
import s from './Home.css';
import messages from './messages';

class Home extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    tournaments: PropTypes.array,
    rooms: PropTypes.array
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 1
    };
  }

  componentWillMount() {
    const { dispatch, intl } = this.props;
    const { formatMessage } = intl;

    this.context.setTitle(formatMessage(messages.pageTitle));
    // dispatch(tournamentsModule.actions.fetchTournaments());
  }

  setSlide(slide) {
    this.setState({ activeSlide: slide });
  }

  render() {
    const { intl } = this.props;
    const { formatMessage } = intl;

    const mainTitleText = formatMessage(messages.homeTitle);

    const introSlideCSS = cx(s.firstStep, { [s.firstStep_isActive]: this.state.activeSlide === 1 });
    const collectTeamSlideCSS = cx(s.secondStep, { [s.secondStep_isActive]: this.state.activeSlide === 2 }, { [s.secondStep_isViewed]: this.state.activeSlide > 2 });
    const watchGameSlideCSS = cx(s.watchGame, { [s.watchGame_isActive]: this.state.activeSlide === 3 }, { [s.watchGame_isViewed]: this.state.activeSlide > 3 });
    const processingResultsSlideCSS = cx(s.processResults, { [s.processResults_isActive]: this.state.activeSlide === 4 }, { [s.processResults_isViewed]: this.state.activeSlide > 4 });
    const highlightsCSS = cx(s.highlights, { [s.highlights_isActive]: this.state.activeSlide === 5 }, { [s.highlights_isViewed]: this.state.activeSlide > 5 });
    const prizeSlideCSS = cx(s.prizeSlide, { [s.prizeSlide_isActive]: this.state.activeSlide === 6 }, { [s.prizeSlide_isViewed]: this.state.activeSlide > 6 });
    const chooseTournamentCSS = cx(s.chooseTournament, { [s.chooseTournament_isActive]: this.state.activeSlide === 7 }, { [s.chooseTournament_isViewed]: this.state.activeSlide > 7 });

    return (
      <div className={s.root}>

        <section className={introSlideCSS}>

          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.content}>
              <div className={s.title}>
                {mainTitleText.split('\n').map((phrase, index) =>
                  <span key={index}>
                    {phrase}
                    <br />
                  </span>
                )}
              </div>
              <div className={s.description}>
                <FormattedMessage {...messages.homeSubtitle} />
              </div>
              <div className={s.action}>
                {/* <div className={s.button} onClick={() => this.setSlide(2)}>
                  <FormattedMessage {...messages.howItWorks} />
                </div> */}
                <Link className={s.button} to="/lobby">
                  <FormattedMessage {...messages.lobbyLink} />
                </Link>
              </div>
            </div>
            <Footer />
          </div>
        </section>

        <section className={collectTeamSlideCSS}>
          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.close} onClick={() => this.setSlide(1)}>&times;</div>
            <p className={s.overview}>
              <FormattedMessage {...messages.howItWorks1} />
            </p>
            <div className={s.action}>
              <div className={s.button} onClick={() => this.setSlide(3)}>
                <FormattedMessage {...messages.nextLabel} />
              </div>
            </div>
          </div>
        </section>

        <section className={watchGameSlideCSS}>
          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.close} onClick={() => this.setSlide(1)}>&times;</div>
            <p className={s.overview}>
              <FormattedMessage {...messages.howItWorks2} />
            </p>
            <div className={s.playerStatsImg}>
              {/* <img src="/images/player-stats.jpg" /> */}
            </div>
            <div className={s.action}>
              <div className={s.button} onClick={() => this.setSlide(4)}>
                <FormattedMessage {...messages.nextLabel} />
              </div>
            </div>
          </div>
        </section>

        <section className={processingResultsSlideCSS}>
          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.close} onClick={() => this.setSlide(1)}>&times;</div>
            <p className={s.overview}>
              <FormattedMessage {...messages.howItWorks3} />
            </p>
            <div className={s.processResultsImg}>
              {/* <img src="/images/team-stats.jpg" /> */}
            </div>
            <div className={s.action}>
              <div className={s.button} onClick={() => this.setSlide(6)}>
                <FormattedMessage {...messages.nextLabel} />
              </div>
            </div>
          </div>
        </section>

        <section className={prizeSlideCSS}>
          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.close} onClick={() => this.setSlide(1)}>&times;</div>
            <p className={s.overview}>
              <FormattedMessage {...messages.howItWorks4} />
            </p>
            <div className={s.playerStatsImg}>
              {/* <img src="/images/player-stats.jpg" /> */}
            </div>
            <div className={s.action}>
              <div className={s.button} onClick={() => this.setSlide(7)}>
                <FormattedMessage {...messages.playLabel} />
              </div>
            </div>
          </div>
        </section>

        <section className={highlightsCSS}>
          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.content}>
              <div className={s.title}>
                <FormattedMessage {...messages.startTitle} />
              </div>
              <div className={s.stepsToWin}>
                <div className={s.highlight}>
                  <div className={s.highlight__caption}>
                    <FormattedMessage {...messages.startFeatureTitle1} />
                  </div>
                  <div className={s.highlight__statement}>
                    <FormattedMessage {...messages.startFeatureText1} />
                  </div>
                </div>
                <div className={s.highlight}>
                  <div className={s.highlight__caption}>
                    <FormattedMessage {...messages.startFeatureTitle2} />
                  </div>
                  <div className={s.highlight__statement}>
                    <FormattedMessage {...messages.startFeatureText2} />
                  </div>
                </div>
              </div>
              <div className={s.action}>
                <div className={s.button} onClick={() => this.setSlide(7)}>
                  <FormattedMessage {...messages.playLabel} />
                </div>
              </div>
            </div>

            {/* <Footer /> */}

          </div>
        </section>

        <section className={chooseTournamentCSS}>
          <div className={s.background}></div>
          <div className={s.overlay}></div>
          <div className={s.container}>
            <div className={s.close} onClick={() => this.setSlide(1)}>&times;</div>
            <div className={s.content}>
              <div className={s.title}>
                <FormattedMessage {...messages.leagueTitle} />
              </div>
              <div className={s.description}>
                <FormattedMessage {...messages.leagueText} />
              </div>
              {/* <TournamentSelector /> */}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default injectIntl(connect(
  createStructuredSelector({
    tournaments: tournamentsModule.selectors.getTournaments,
    rooms: lobbyModule.selectors.getRooms
  })
)(withStyles(s)(Home)));
