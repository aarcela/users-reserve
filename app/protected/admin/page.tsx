import { getAppointments } from "@/app/services/appointmentService";
import AppointmentList from "@/components/appointment/AppointmentList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  const data = await getAppointments();

  console.log("Appointnment: ", data);

  return (
    <>
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/protected/admin/manageAppointments">
              Agendar nueva cita
            </Link>
          </Button>
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/protected/admin/patients">Lista de Pacientes</Link>
          </Button>
        </div>
        <h3 className="font-bold text-2xl mb-4">Calendario de citas</h3>
        <AppointmentList appointmentList={data} />
      </div>
    </>
  );
}
