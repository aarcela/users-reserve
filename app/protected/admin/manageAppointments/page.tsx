// app/appointments/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { reserveAppointment } from "@/app/services/appointmentService";
import PatientSelector from "@/components/patient/PatientSelector";
import ReserveForm from "@/components/reserve/ReserveForm";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("Consulta");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient || !date || !time) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    try {
      setIsSubmitting(true);

      const appointmentDate = `${date}T${time}:00`;
      const success = await reserveAppointment(
        selectedPatient,
        appointmentDate,
        appointmentType,
      );

      if (success) {
        toast.success("Cita reservada exitosamente");
        router.push("/appointments");
      } else {
        toast.error("La fecha seleccionada no está disponible");
      }
    } catch (error) {
      toast.error("Error al reservar la cita");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the min date
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Nueva Cita</h1>

      <div className="flex flex-row w-full gap-4">
        <div className="w-1/2">
          <Label htmlFor="patient">Paciente</Label>
          <PatientSelector
            onSelectPatient={setSelectedPatient}
            selectedPatient={selectedPatient}
          />
        </div>

        {selectedPatient && <ReserveForm uid={selectedPatient} />}

        {/* <div className="flex flex-col w-1/2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <Label htmlFor="type">Tipo de Cita</Label>
            <select
              id="type"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              required
            >
              <option value="Consulta">Consulta</option>
              <option value="Control">Control</option>
              <option value="Urgencia">Urgencia</option>
              <option value="Examen">Examen</option>
            </select>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/appointments")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedPatient || !date || !time}
            >
              {isSubmitting ? "Reservando..." : "Reservar Cita"}
            </Button>
          </div> */}
      </div>
    </div>
  );
}
