import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import { focusElement } from 'platform/utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import HCAEnrollmentStatus from './HCAEnrollmentStatus';
import HCASubwayMap from '../components/HCASubwayMap';
import { isLoading, isUserLOA1, isLoggedOut, isUserLOA3 } from '../selectors';

const VerificationRequiredAlert = () => (
  <AlertBox
    content={
      <div>
        <h4 className="usa-alert-heading">
          Please verify your identity before applying for VA health care
        </h4>
        <p>
          We’re sorry for the inconvenience, but we need you to verify your
          identity before you apply for VA health care. This process should take
          about 5 to 10 minutes. As soon as you’re finished, you can continue
          your application.
        </p>
        <p>
          <strong>
            If you need more information or help with verifying your identity on
            VA.gov:
          </strong>
        </p>
        <ul>
          <li>
            <a href="/sign-in-faq/#verifying-your-identity">
              Read our identity verification FAQs
            </a>
          </li>
        </ul>
        <p>
          Or call us at 1-877-222-VETS (
          <a href="tel:+18772228387">1-877-222-8387</a>
          ). If you have hearing loss, call TTY: 1-800-877-8339. We’re here
          Monday through Friday, 8:00 a.m. to 8:00 p.m. (ET)
        </p>
        <a className="usa-button-primary va-button-primary" href="/verify">
          Verify your identity
        </a>
      </div>
    }
    isVisible
    status="continue"
  />
);

const LoggedOutContent = ({ route }) => (
  <>
    <SaveInProgressIntro
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      downtime={route.formConfig.downtime}
      pageList={route.pageList}
      startText="Start the Health Care Application"
    />
    <HCASubwayMap />
    <SaveInProgressIntro
      buttonOnly
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      startText="Start the Health Care Application"
      downtime={route.formConfig.downtime}
    />
    <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
      <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018" />
    </div>
  </>
);

class IntroductionPageGated extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const {
      showMainLoader,
      showVerificationRequiredAlert,
      showLOA3Content,
      showLoggedOutContent,
      route,
    } = this.props;
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for health care benefits" />
        <p>Equal to VA Form 10-10EZ (Application for Health Benefits).</p>
        {showMainLoader && <LoadingIndicator />}
        {showVerificationRequiredAlert && <VerificationRequiredAlert />}
        {showLoggedOutContent && <LoggedOutContent route={route} />}
        {showLOA3Content && <HCAEnrollmentStatus route={route} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showMainLoader: isLoading(state),
  showVerificationRequiredAlert: isUserLOA1(state),
  showLoggedOutContent: isLoggedOut(state),
  showLOA3Content: isUserLOA3(state),
});

export default connect(mapStateToProps)(IntroductionPageGated);

export { IntroductionPageGated };
