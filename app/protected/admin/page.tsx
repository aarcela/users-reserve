import { getAppointments } from "@/app/services/appointmentService";
import AppointmentList from "@/components/appointment/AppointmentList";

export default async function AdminPage() {
  const data = await getAppointments();

  console.log("Appointnment: ", data);

  return (
    <>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Calendario de citas</h2>
        <AppointmentList appointmentList={data} />
      </div>
    </>
  );
}
