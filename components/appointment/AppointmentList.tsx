"use client";
import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

interface Props {
  appointmentList: {
    appointment_date: Date;
    count: number;
    appointment_type: string;
    patient: any;
    [key: string]: any;
  }[];
}

function AppointmentList({ appointmentList, ...props }: Props) {
  const [appointmentData, setAppointmentData] = useState<any>([]);

  useEffect(() => {
    if (appointmentList) {
      const formattedData = appointmentList.map((appt) => ({
        title: `${appt.appointment_type} - ${appt.patient.name}`,
        start: new Date(appt.appointment_date),
        extendedProps: { patientDocId: appt.patient.docId },
      }));
      setAppointmentData(formattedData);
    }
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
      initialView="dayGridMonth"
      weekends={false}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,listWeek",
      }}
      events={appointmentData}
      allDaySlot={false}
      slotDuration="24:00:00"
      contentHeight="auto"
      eventContent={(eventInfo) => (
        <div>
          <strong>{eventInfo.event.title.toLocaleUpperCase()}</strong>
          <p>ID: {eventInfo.event.extendedProps.patientDocId}</p>
        </div>
      )}
    />
  );
}

export default AppointmentList;
