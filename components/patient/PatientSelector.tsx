// components/PatientSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Patient } from "@/components/patient/Profile";
import { listPatients } from "@/app/services/patientService";
import usePatients from "@/hooks/usePatient";

interface PatientSelectorProps {
  onSelectPatient: (patientId: string) => void;
  selectedPatient: string | null;
}

export default function PatientSelector({
  onSelectPatient,
  selectedPatient,
}: PatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { patients, loading } = usePatients();

  const filteredPatients = patients.filter((patient: Patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient?.name?.toLowerCase().includes(searchLower) ||
      patient?.lastName?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.phone?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-2">
      <Input
        placeholder="Buscar paciente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="border rounded-md p-4 text-center">
          <p>Cargando pacientes...</p>
        </div>
      ) : (
        <div className="border rounded-md max-h-60 overflow-y-auto">
          {filteredPatients.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">
              No se encontraron pacientes
            </p>
          ) : (
            <ul className="divide-y">
              {filteredPatients.map((patient) => (
                <li key={patient.uid}>
                  <button
                    type="button"
                    onClick={() => onSelectPatient(patient.uid)}
                    className={`w-full text-left p-3                     }`}
                  >
                    <div className="font-medium">
                      {patient.name} {patient.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.docId} • {patient.phone}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedPatient && (
        <div className="p-2 bg-blue-50 rounded-md text-sm text-black">
          Paciente seleccionado:{" "}
          {patients.find((p) => p.uid === selectedPatient)?.name}{" "}
          {patients.find((p) => p.uid === selectedPatient)?.lastName}
        </div>
      )}
    </div>
  );
}
