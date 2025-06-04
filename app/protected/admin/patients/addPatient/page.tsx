// components/NewPatientForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  checkPatientExists,
  createPatientWithPhone,
} from "@/app/services/patientService";
import { toast } from "react-toastify";

export default function NewPatientForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    docId: "",
    phoneSuffix: "",
    phoneNumber: "",
    email: "",
    location: "",
    patient_type: "Particular",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name) newErrors.first_name = "Nombre es requerido";
    if (!formData.last_name) newErrors.last_name = "Apellido es requerido";
    if (!formData.docId) newErrors.docId = "Cédula es requerida";
    if (!formData.phoneNumber) newErrors.phone = "Teléfono es requerido";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    setIsSubmitting(false);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const exists = await checkPatientExists(formData.docId);
      if (exists) {
        setErrors({ docId: "Esta cédula ya está registrada" });
        return;
      }

      // Create new patient with phone auth
      await createPatientWithPhone({
        name: formData.first_name,
        lastName: formData.last_name,
        docId: +formData.docId,
        phone: `58${formData.phoneSuffix}${formData.phoneNumber}`,
        email: formData.email,
        location: formData.location,
        userType: formData.patient_type,
      });

      toast.success(
        "Paciente registrado exitosamente. Se envió un OTP para verificar el teléfono.",
      );

      router.push("/protected/admin/patients");
    } catch (error: any) {
      toast.error(error.message || "Error al registrar paciente");
      console.error("Error creating patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-medium mb-6">Registro de Paciente</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="patient_type">Tipo de Paciente</Label>
          <select
            id="patient_type"
            name="patient_type"
            value={formData.patient_type}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
          >
            <option value="Particular">Particular</option>
            <option value="Seguro">Seguro</option>
          </select>
        </div>

        <div>
          <Label htmlFor="first_name">Nombre*</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1"
            maxLength={50}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name">Apellido*</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1"
            maxLength={50}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="docId">Cédula*</Label>
          <Input
            id="docId"
            name="docId"
            value={formData.docId}
            onChange={handleChange}
            className="mt-1"
            maxLength={8}
            type="number"
          />
          {errors.docId && (
            <p className="text-sm text-red-500 mt-1">{errors.docId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Teléfono*</Label>
          <div className="flex flex-row gap-2">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              name="phoneSuffix"
              id="phoneSuffix"
              required
              onChange={handleChange}
              value={formData.phoneSuffix}
            >
              <option value="414">0414</option>
              <option value="424">0424</option>
              <option value="412">0412</option>
              <option value="422">0422</option>
              <option value="416">0416</option>
              <option value="426">0426</option>
            </select>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="1234567"
              onChange={handleChange}
              required
              value={formData.phoneNumber}
              maxLength={7}
              minLength={7}
              type="number"
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Dirección (opcional)</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1"
            maxLength={100}
          />
        </div>

        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-4">* Campos obligatorios</p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Paciente"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
