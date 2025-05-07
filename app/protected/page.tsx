import ReserveForm from "@/components/reserve/ReserveForm";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAppointmentsByUser } from "../services/appointmentService";

export default async function ProtectedPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }
    const { data: userData } = await supabase
        .from("patient")
        .select("*")
        .eq("id", user?.id)
        .single();

    const today = new Date().toISOString().split("T")[0];
    const appointmentData = await getAppointmentsByUser(user?.id, today);
    console.log("Protected: ", appointmentData);

    return (
        <div className="flex flex-col min-w-64 max-w-64 mx-auto">
            {(!userData.name || !userData.lastName || !userData.email || !userData.location) && (
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />

                    <span>Por favor completa tus datos</span>
                </div>
            )}
            {appointmentData.length > 0 ? (
                <>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-2xl mb-4">Próxima cita</h2>
                    </div>
                    {appointmentData.map((appointment, index) => {
                        return (
                            <div key={index} className="bg-muted rounded p-5 gap-4 mb-2">
                                <h2>{appointment.appointment_date.toString()}</h2>
                                <h3>{appointment.appointment_type.toUpperCase()}</h3>
                            </div>
                        );
                    })}
                    {/* <AppointmentList appointmentList={appointmentData} /> */}
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-2xl mb-4">Reserva tu cita</h2>
                    </div>
                    <ReserveForm uid={user.id} />
                </>
            )}
        </div>
    );
}
