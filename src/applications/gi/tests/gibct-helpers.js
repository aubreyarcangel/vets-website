const Timeouts = require('../../../platform/testing/e2e/timeouts');
const autocomplete = require('./e2e/autocomplete.json');
const institutionProfile = require('./e2e/institution-profile.json');
const searchResults = require('./e2e/search-results.json');
const calculatorConstants = require('./e2e/calculator-constants.json');
const mock = require('../../../platform/testing/e2e/mock-helpers');

const institutionAttributes = institutionProfile.data.attributes;

// Expects navigation lands at a path containing the given `urlSubstring`.
const expectLocation = (client, urlSubstring) => {
  client.assert.urlContains(urlSubstring);
};

// Create API routes
const initApplicationMock = () => {
  mock(null, {
    path: '/v0/gi/institutions/search',
    verb: 'get',
    value: searchResults,
  });

  mock(null, {
    path: `/v0/gi/institutions/${institutionAttributes.facility_code}`,
    verb: 'get',
    value: institutionProfile,
  });

  mock(null, {
    path: '/v0/gi/calculator_constants',
    verb: 'get',
    value: calculatorConstants,
  });

  mock(null, {
    path: '/v0/gi/institutions/autocomplete',
    verb: 'get',
    value: autocomplete,
  });

  mock(null, {
    path: '/v0/feature_toggles',
    verb: 'get',
    value: {
      data: {
        features: [],
      },
    },
  });

  mock(null, {
    path: '/v0/maintenance_windows',
    verb: 'get',
    value: {},
  });
};

const searchForInstitution = client => {
  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', institutionAttributes.name)
    .click('#search-button');
};

const selectFirstSearchResult = client => {
  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main')
    .waitForElementVisible('.search-result a', Timeouts.normal)
    .click('.search-result a');
};

const expandCollapseAccordion = (client, id) =>
  client
    .waitForElementVisible(id, Timeouts.normal)
    .click(`${id} button`)
    .click(`${id} button`);

const expandCollapseMainSections = (client, name) => {
  const id = `#${name.toLowerCase().replace(/\s/g, '-')}`;
  expandCollapseAccordion(client, id);
};

const displayLearnMoreModal = client => {
  client
    .waitForElementVisible('.learn-more-button', Timeouts.normal)
    .click('.learn-more-button')
    .axeCheck('.va-modal')
    .click('.va-modal-close');
};

const editEligibilityDetails = client => {
  client
    .waitForElementVisible('.eligibility-details', Timeouts.normal)
    .click('.eligibility-details button')
    .axeCheck('.eligibility-details');
};

const hideCalculatorFields = client => {
  expandCollapseAccordion(client, '.calculator-inputs');
};

module.exports = {
  expectLocation,
  initApplicationMock,
  searchForInstitution,
  selectFirstSearchResult,
  expandCollapseAccordion,
  expandCollapseMainSections,
  displayLearnMoreModal,
  editEligibilityDetails,
  hideCalculatorFields,
};
