import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getAppointmentsByUser } from "../services/appointmentService";
import CompleteInfo from "@/components/patient/CompleteInfo";
import { Calendar, Hash, User, X } from "lucide-react";
import Link from "next/link";
import ReserveForm from "@/components/reserve/ReserveForm";

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

  if (user!.user_metadata?.is_admin) {
    return redirect("/protected/admin/");
  }
  if (
    !userData?.name ||
    !userData?.lastName ||
    !userData?.email ||
    !userData?.location
  ) {
    return <CompleteInfo />;
  }

  if (appointmentData.length === 0) {
    return <ReserveForm uid={user?.id} />;
  }

  // Assuming we're showing the first appointment (modify as needed)
  const appointment = appointmentData[0];

  // Format the date for display
  const formattedDate = new Date(
    appointment.appointment_date,
  ).toLocaleDateString("es-VE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col   items-center">
      <div className="px-4">
        <h1 className=" text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pb-3 pt-5">
          Tu cita está reservada
        </h1>
        <div className="flex flex-col gap-2  ">
          <div className="flex items-center gap-4  min-h-[72px] py-2">
            <div className=" flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-12">
              <Calendar size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <p className=" text-base font-medium leading-normal line-clamp-1">
                Tipo de cita
              </p>
              <p className="text-[#60768a] text-sm font-normal leading-normal line-clamp-2">
                {appointment.appointment_type.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 min-h-[72px] py-2">
            <div className=" flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-12">
              <Calendar size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <p className=" text-base font-medium leading-normal line-clamp-1">
                Fecha
              </p>
              <p className="text-[#60768a] text-sm font-normal leading-normal line-clamp-2">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4  min-h-[72px] py-2">
            <div className=" flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-12">
              <User size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <p className=" text-base font-medium leading-normal line-clamp-1">
                Patient Type
              </p>
              <p className="text-[#60768a] text-sm font-normal leading-normal line-clamp-2">
                {userData.type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
