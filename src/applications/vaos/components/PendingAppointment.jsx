import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

const timeText = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

function formatDate(date) {
  const parsedDate = moment(date, 'MM/DD/YYYY');

  if (!parsedDate.isValid()) {
    return '';
  }

  return parsedDate.format('MMMM D, YYYY');
}

export default function PendingAppointment({ appointment }) {
  const isCommunityCare = !!appointment.ccAppointmentRequest;

  return (
    <li className="vads-u-border-left--5px vads-u-border-color--gold vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        {appointment.appointmentType}
      </h2>
      <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
          <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
            Preferred appointment dates:
          </h3>
          <ul className="usa-unstyled-list">
            <li className="vads-u-margin-bottom--1">
              {formatDate(appointment.optionDate1)}{' '}
              {timeText[appointment.optionTime1]}
            </li>
            <li className="vads-u-margin-bottom--1">
              {formatDate(appointment.optionDate2)}{' '}
              {timeText[appointment.optionTime2]}
            </li>
            <li>
              {formatDate(appointment.optionDate3)}{' '}
              {timeText[appointment.optionTime3]}
            </li>
          </ul>
        </div>
        {!isCommunityCare && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
            <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
              Where:
            </h3>
            {appointment.friendlyLocationName || appointment.facility.name}
            <br />
            {appointment.facility.city}, {appointment.facility.state}
          </div>
        )}
        {isCommunityCare && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--1p5">
            <h3 className="vads-u-margin--0 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-family--sans">
              Preferred location:
            </h3>
            {appointment.ccAppointmentRequest.preferredCity},{' '}
            {appointment.ccAppointmentRequest.preferredState}
          </div>
        )}
      </div>
      <Link
        className="vads-u-font-weight--bold vads-u-text-decoration--none"
        to={`appointments/pending/${appointment.appointmentRequestId}`}
      >
        View details <i className="fas fa-angle-right" />
      </Link>
    </li>
  );
}