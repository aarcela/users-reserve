"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { Patient } from "../patient/Profile";
import { reserveAppointment } from "@/app/services/appointmentService";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

function ReserveForm({ uid }: Patient) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  //  const [formData, setFormData] = useState({
  //      appointmentType: "regular",
  //  });
  const router = useRouter();

  const handleReserve = async (formData: FormData) => {
    const appointment_type = formData.get("appointmentType")?.toString() || "";
    const patient_id = uid;

    if (!selectedDate) return;

    const appointment_date = selectedDate.toISOString().split("T")[0];
    //   debugger;
    const data = await reserveAppointment(
      patient_id,
      appointment_date,
      appointment_type,
    );
    if (!data) toast.warn("El día está lleno, elige otra fecha");
    else {
      toast.success("Se agendó correctamente");
      router.push("/protected");
    }
    console.log(data);
  };
  return (
    <>
      <h1 className=" text-[22px] font-bold  tracking-[-0.015em] text-center pb-3 pt-5">
        Reserva tu cita, selecciona el día y el tipo
      </h1>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="appointmentDate">Fecha</Label>

          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            filterDate={(date: Date) => {
              const allowedDays = [1, 2, 4];
              return allowedDays.includes(date.getDay());
            }}
            placeholderText="Selecciona una fecha (Lun, Mar, Jue)"
            dateFormat="yyyy-MM-dd"
            className="p-2 border rounded w-full"
            id="appointmentDate"
            name="appointmentDate"
          />
          {/* <Input
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                        setFormData({ ...formData, appointmentDate: e.target.value })
                    }
                /> */}
          <Label htmlFor="appointmentType">Tipo de cita</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            name="appointmentType"
            required
          >
            <option value="regular">Regular</option>
            <option value="plasma">Plasma</option>
            <option value="post">Post-operatorio</option>
          </select>
          <SubmitButton formAction={handleReserve} pendingText="Reservando...">
            Reservar
          </SubmitButton>
        </div>
      </form>
    </>
  );
}

export default ReserveForm;
