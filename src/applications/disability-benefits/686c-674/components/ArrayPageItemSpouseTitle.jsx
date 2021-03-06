import React from 'react';

export function SpouseTitle({ formData }) {
  return (
    <div>
      <h4 className="vads-u-border-color--link-default vads-u-border-bottom--2px vads-u-margin-top--0 vads-u-padding-bottom--0p5">
        {formData.formerSpouseName.first} {formData.formerSpouseName.last}
      </h4>
    </div>
  );
}
