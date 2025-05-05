"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { Patient } from "../patient/Profile";
import { reserveAppointment } from "@/app/services/appointmentService";

function ReserveForm({ uid }: Patient) {
    const [formData, setFormData] = useState({
        appointmentDate: "",
        appointmentType: "",
    });

    const handleReserve = async (formData: FormData) => {
        const appointment_date = formData.get("appointmentDate")?.toString() || "";
        const appointment_type = formData.get("appointmentType")?.toString() || "";
        const patient_id = uid;

        const data = await reserveAppointment(patient_id, appointment_date, appointment_type);
        console.log(data);
    };
    return (
        <form className="flex flex-col min-w-64 max-w-64 mx-auto">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="appointmentDate">Fecha</Label>
                <Input
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                        setFormData({ ...formData, appointmentDate: e.target.value })
                    }
                />
                <Label htmlFor="appointmentType">Tipo de cita</Label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    name="appointmentType"
                    required>
                    <option value="regular">Regular</option>
                    <option value="plasma">Plasma</option>
                    <option value="post">Post-operatorio</option>
                </select>
                <SubmitButton formAction={handleReserve} pendingText="Reservando...">
                    Reservar
                </SubmitButton>
            </div>
        </form>
    );
}

export default ReserveForm;
