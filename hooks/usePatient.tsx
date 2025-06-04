// hooks/usePatients.ts
"use client";

import {
  deletePatientService,
  listPatients,
  updatePatientService,
} from "@/app/services/patientService";
import { Patient } from "@/components/patient/Profile";
import { useState, useEffect, useCallback } from "react";

export default function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await listPatients();
      // Ensure each patient has a uid property
      const patientsWithUid = data.map((patient: any, idx: number) => ({
        uid: patient.uid ?? patient.id ?? String(idx),
        ...patient,
      }));
      setPatients(patientsWithUid);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err instanceof Error ? err.message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // If you have other service functions for CRUD operations:

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      setLoading(true);
      // Assuming you have an updatePatient service function
      const updatedPatient = await updatePatientService(id, updates);
      setPatients((prev) =>
        prev.map((patient) => (patient.uid === id ? updatedPatient : patient)),
      );
      return updatedPatient;
    } catch (err) {
      console.error("Error updating patient:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      setLoading(true);
      // Assuming you have a deletePatient service function
      await deletePatientService(id);
      setPatients((prev) => prev.filter((patient) => patient.uid !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    patients,
    loading,
    error,
    refresh: fetchPatients,
    updatePatient,
    deletePatient,
  };
}
