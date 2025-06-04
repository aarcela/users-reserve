// components/PatientList.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Patient } from "@/components/patient/Profile";
import usePatients from "@/hooks/usePatient";
import { useRouter } from "next/navigation";

export default function PatientList() {
  const { patients, loading, error, deletePatient } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  if (loading) {
    return (
      <div className="container w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Lista de pacientes</h1>
        <p className="text-center py-8">Cargando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Lista de pacientes</h1>
        <p className="text-center text-red-500 py-8">{error}</p>
      </div>
    );
  }

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
    <div className="container w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Lista de pacientes</h1>
        <Button
          variant="default"
          onClick={() => router.push("/protected/admin/patients/addPatient")}
        >
          Nuevo Paciente
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="search" className="sr-only">
          Buscar paciente
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Buscar pacientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="border rounded-lg py-12 text-center">
          <p>No se encontraron pacientes</p>
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 p-4 font-medium">
            <div className="col-span-4">Nombre</div>
            <div className="col-span-3">Teléfono</div>
            <div className="col-span-3">Tipo</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {/* Patient Rows */}
          {filteredPatients.map((patient: Patient) => (
            <div
              key={patient.uid}
              className="grid grid-cols-12 gap-4 p-4 items-center "
            >
              <div className="col-span-4">
                <div className="font-medium">
                  {patient.name} {patient.lastName}
                </div>
                {patient.email && (
                  <div className="text-sm text-gray-500 truncate">
                    {patient.email}
                  </div>
                )}
              </div>

              <div className="col-span-3">{patient.phone || "-"}</div>

              <div className="col-span-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    patient.userType === "Seguro"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {patient.userType || "Particular"}
                </span>
              </div>

              <div className="col-span-2 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-red-600"
                      onClick={() => deletePatient(patient.uid)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
