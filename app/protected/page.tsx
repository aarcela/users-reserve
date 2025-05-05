import ReserveForm from "@/components/reserve/ReserveForm";
import { SubmitButton } from "@/components/submit-button";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getAppointmentsByUser } from "../services/appointmentService";
import AppointmentList from "@/components/appointment/AppointmentList";

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
    console.log("User: ", user);

    return (
        <div className="flex flex-col min-w-64 max-w-64 mx-auto">
            {(!userData.name || !userData.lastName || !userData.email || !userData.location) && (
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} />

                    <span>Por favor completa tus datos</span>
                </div>
            )}
            {appointmentData.length ? (
                <>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-2xl mb-4">Próxima cita</h2>
                        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
                            {JSON.stringify(user, null, 2)}
                            {userData.uid}
                        </pre>
                    </div>
                    <AppointmentList appointmentList={appointmentData} />
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
