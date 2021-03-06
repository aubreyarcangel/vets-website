/**
 * Checks if the count of focusable elements is correct. Focusable elements are those
 * in the normal tab order (native focusable elements or those with tabIndex 0).
 * The count logic will break on tabindexes > 0 because we do not want to override the
 * browser's base tab order.
 *
 * This solution is inspired by two blog posts:
 * https://zellwk.com/blog/keyboard-focusable-elements/
 * https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.assert.hasFocusableCount("body", 10, "Your custom message");
 *  };
 * ```
 *
 * @method hasFocusableCount
 * @param {string} selector The selector (CSS / Xpath) used to locate the element
 * @param {number} count The number of focusable elements in the selector
 * @param {string} [message] Optional log message displayed in output. Defaults to this.message.
 * @api assertions
 */
exports.assertion = function hasFocusableCount(
  selector,
  count,
  message = `Page contains ${count} focusable elements.`,
) {
  this.message = message;
  this.expected = parseInt(count, 10);
  this.pass = value => value === this.expected;
  this.value = result => parseInt(result.value.length, 10);
  this.command = callback =>
    this.api.execute(
      sel => {
        const target = document.querySelector(sel);
        const allItems = target.querySelectorAll(
          'a[href], button, details, input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="radio"], input[type="checkbox"], select, textarea, [tabindex="0"], [tabindex="-1"]',
        );
        const focusableItems = Array.from(allItems).filter(
          el => !el.hasAttribute('disabled'),
        );

        return focusableItems;
      },
      [selector],
      callback,
    );
};
