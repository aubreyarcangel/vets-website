import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CancelAppointmentFailedModal from '../../../components/cancel/CancelAppointmentFailedModal';

describe('VAOS <CancelAppointmentFailedModal>', () => {
  it('should render', () => {
    const appointment = {};
    const facility = {
      name: 'Facility name',
      phone: {
        main: '234-244-4444',
      },
      address: { physical: {} },
    };
    const tree = mount(
      <CancelAppointmentFailedModal
        facility={facility}
        appointment={appointment}
      />,
    );

    expect(tree.find('Modal').props().status).to.equal('error');
    expect(tree.text()).to.contain(
      'Something went wrong when we tried to cancel this appointment',
    );
    expect(tree.text()).to.contain('Facility name');
    expect(tree.find('dl').text()).to.contain('234-244-4444');

    tree.unmount();
  });

  it('should close modal', () => {
    const appointment = {
      providerPhone: '1234567890',
    };
    const facility = {
      name: 'Facility name',
      phone: {
        main: '234-244-4444',
      },
      address: { physical: {} },
    };
    const onClose = sinon.spy();
    const tree = mount(
      <CancelAppointmentFailedModal
        facility={facility}
        appointment={appointment}
        onClose={onClose}
      />,
    );

    tree
      .find('button')
      .props()
      .onClick({ preventDefault: f => f });

    expect(onClose.called).to.be.true;

    tree.unmount();
  });
});
