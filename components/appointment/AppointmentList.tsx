"use client";
import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { getUserInfoById } from "@/app/actions";

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
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null,
  );

  useEffect(() => {
    if (appointmentList) {
      const formattedData = appointmentList.map((appt) => ({
        title: `${appt.appointment_type} - ${appt?.patient?.name}`,
        start: new Date(appt.appointment_date + "T00:00:00"),
        extendedProps: {
          patientDocId: appt?.patient?.docId,
          userType: appt?.patient?.type,
          patientId: appt?.patient?.id,
        },
      }));
      setAppointmentData(formattedData);
    }
  }, []);

  return (
    <>
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
          <div
            onClick={() =>
              setSelectedAppointment(eventInfo.event.extendedProps)
            }
          >
            <strong>{eventInfo.event.title.toLocaleUpperCase()}</strong>
            <p>ID: {eventInfo.event.extendedProps.patientDocId}</p>
          </div>
        )}
      />
      {selectedAppointment && (
        <UserInfoModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </>
  );
}

interface UserInfoModalProps {
  appointment: any | null;
  onClose: () => void;
}

const UserInfoModal = ({ appointment, onClose }: UserInfoModalProps) => {
  if (!appointment) return null;
  const [userData, setUserData] = useState<any | null>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserInfoById(appointment.patientId);
      debugger;
      if (data) setUserData(data.user);
    };

    fetchData();
  }, [appointment.patientDocId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Patient Information</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Tipo:</span> {appointment?.userType}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {userData?.phone || "N/A"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppointmentList;
