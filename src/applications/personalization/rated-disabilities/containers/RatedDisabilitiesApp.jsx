import React from 'react';
import { connect } from 'react-redux';

import backendServices from 'platform/user/profile/constants/backendServices';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import RatedDisabilityView from '../components/RatedDisabilityView';

class RatedDisabilitiesApp extends React.Component {
  render() {
    const { ratedDisabilities } = this.props.ratedDisabilities;
    return (
      <>
        <div className="medium-screen:vads-u-padding-left--1p5 large-screen:vads-u-padding-left--6">
          <Breadcrumbs>
            {[
              <a href="/" aria-label="back to VA Home page" key="1">
                Home
              </a>,
              <a
                href="/disability"
                aria-label="Back to the Disability Benefits page"
                key="2"
              >
                Disability Benefits
              </a>,
              <a
                href="/disability/view-disability-rating"
                aria-label="back to the view your VA disability rating page"
                key="3"
              >
                View your VA disability rating
              </a>,
              <a href="/disability/view-disability-rating/rating" key="4">
                Your VA disability rating
              </a>,
            ]}
          </Breadcrumbs>
        </div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.user}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}
        >
          <DowntimeNotification
            appTitle="Rated Disabilities"
            dependencies={[externalServices.evss]}
          >
            <RatedDisabilityView
              fetchRatedDisabilities={this.props.fetchRatedDisabilities}
              ratedDisabilities={ratedDisabilities}
              user={this.props.user}
              fetchTotalDisabilityRating={this.props.fetchTotalDisabilityRating}
              totalDisabilityRating={this.props.totalDisabilityRating}
              loading={this.props.loading}
              error={this.props.error}
            />
          </DowntimeNotification>
        </RequiredLoginView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ratedDisabilities: state.ratedDisabilities,
  loading: state.totalRating.loading,
  error: state.totalRating.error,
  totalDisabilityRating: state.totalRating.totalDisabilityRating,
});

const mapDispatchToProps = {
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatedDisabilitiesApp);
export { RatedDisabilitiesApp };
