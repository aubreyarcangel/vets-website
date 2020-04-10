import React from 'react';
import classNames from 'classnames';
import {
  formatAppointmentDate,
  formatFacilityAddress,
} from '../utils/formatters';
import { APPOINTMENT_STATUS } from '../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from './AddToCalendar';
import VAFacilityLocation from './VAFacilityLocation';
import AppointmentDateTime from './AppointmentDateTime';
import AppointmentInstructions from './AppointmentInstructions';
import AppointmentStatus from './AppointmentStatus';
import ConfirmedCommunityCareLocation from './ConfirmedCommunityCareLocation';

export default function ConfirmedAppointmentListItem({
  appointment,
  index,
  cancelAppointment,
  showCancelButton,
  facility,
}) {
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.isPastAppointment;

  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': !isPastAppointment,
      'vads-u-border-color--green': !cancelled && !isPastAppointment,
      'vads-u-border-color--secondary-dark': cancelled && !isPastAppointment,
    },
  );

  let header;
  let location;
  if (appointment.videoType) {
    header = 'VA Video Connect';
    location = 'Video conference';
  } else if (appointment.isCommunityCare) {
    header = 'Community Care';
    location = `${appointment.address.street} ${appointment.address.city}, ${
      appointment.address.state
    } ${appointment.address.zipCode}`;
  } else {
    header = 'VA Appointment';
    location = facility ? formatFacilityAddress(facility) : null;
  }

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-status`}
      className={itemClasses}
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        {header}
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        <AppointmentDateTime
          appointmentDate={appointment.appointmentDate}
          timezone={appointment.timeZone}
          facilityId={appointment.facilityId}
        />
      </h3>
      {!isPastAppointment && (
        <AppointmentStatus status={appointment.status} index={index} />
      )}
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          {appointment.isCommunityCare && (
            <ConfirmedCommunityCareLocation appointment={appointment} />
          )}
          {!!appointment.videoType && (
            <VideoVisitSection appointment={appointment} />
          )}
          {!appointment.isCommunityCare &&
            !appointment.videoType && (
              <VAFacilityLocation
                facility={facility}
                clinicName={appointment.clinicName}
              />
            )}
        </div>
        <AppointmentInstructions instructions={appointment.instructions} />
      </div>

      {!cancelled &&
        !isPastAppointment && (
          <div className="vads-u-margin-top--2">
            <AddToCalendar
              summary={header}
              description={
                appointment.instructions
                  ? `${appointment.instructions.header}. ${
                      appointment.instructions.body
                    }`
                  : ''
              }
              location={location}
              duration={appointment.duration}
              startDateTime={appointment.appointmentDate.toDate()}
              endDateTime={appointment.appointmentDate}
            />
            {showCancelButton && (
              <button
                onClick={() => cancelAppointment(appointment)}
                aria-label="Cancel appointment"
                className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
              >
                Cancel appointment
                <span className="sr-only">
                  {' '}
                  on {formatAppointmentDate(appointment.appointmentDate)}
                </span>
              </button>
            )}
          </div>
        )}
    </li>
  );
}
