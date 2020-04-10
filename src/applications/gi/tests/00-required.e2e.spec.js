const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const institutionProfile = require('./e2e/institution-profile.json');

module.exports = E2eHelpers.createE2eTest(client => {
  const institutionAttributes = institutionProfile.data.attributes;

  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Landing Page
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');
  GiHelpers.searchForInstitution(client);

  // Search Page
  GiHelpers.expectLocation(
    client,
    `/search?category=school&name=${institutionAttributes.name.replace(
      /\s/g,
      '+',
    )}`,
  );
  GiHelpers.selectFirstSearchResult(client);

  // Profile Page
  GiHelpers.expectLocation(
    client,
    `/profile/${institutionAttributes.facility_code}`,
  );
  client.waitForElementVisible('.profile-page', Timeouts.normal);
  // .axeCheck('.main'); // commented out until 7727 is fixed
  // Main sections are expanded on page load

  // Estimate your benefits
  GiHelpers.expandCollapseAccordion(client, 'Estimate your benefits');
  GiHelpers.editEligibilityDetails(client);

  // Veteran programs
  GiHelpers.expandCollapseAccordion(client, 'Veteran programs');

  // School locations
  GiHelpers.expandCollapseAccordion(client, 'School locations');

  // Cautionary information
  GiHelpers.expandCollapseAccordion(client, 'Cautionary information');

  // Contact details
  GiHelpers.expandCollapseAccordion(client, 'Contact details');

  // Additional information
  GiHelpers.expandCollapseAccordion(client, 'Additional information');

  client.end();
});
