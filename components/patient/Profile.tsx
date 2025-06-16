"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { updatePatient } from "@/app/services/patientService";
import { toast } from "react-toastify";
import { addUserInfo } from "@/app/actions";
import { useRouter } from "next/navigation";

export type Patient = {
  uid: string;
  name?: string;
  lastName?: string;
  docId?: number;
  email?: string;
  phone?: string;
  location?: string;
  userType?: string;
};

function Profile({
  phone = "", // Fallback to empty string if phone is undefined
  name = "",
  uid,
  lastName = "",
  docId = 0,
  email = "",
  location = "",
  userType = "",
}: Patient) {
  const [formData, setFormData] = useState({
    name: name || "",
    lastName: lastName || "",
    docId: docId || "",
    email: email || "",
    location: location || "",
    userType: userType || "",
  });

  const router = useRouter();
  const handleEdit = async (form: FormData) => {
    const { success, data } = await updatePatient(form, uid); // Destructure API response
    if (success && data) {
      setFormData({
        name: data.name,
        lastName: data.lastName,
        docId: data.docId,
        email: data.email,
        location: data.location,
        userType: data.userType,
      });
      toast.success("Información editada correctamente");
    } else {
      toast.error("Intente nuevamente");
    }
  };

  const handleCreate = async (form: FormData) => {
    const { success } = await addUserInfo(uid, form); // Destructure API response
    if (success) {
      toast.success("Usuario creado correctamente");
      router.push("/protected");
    } else {
      toast.error("Intente nuevamente");
    }
  };

  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium mx-auto mb-7">Perfil</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="phone">Telefono</Label>
        <Input id="phone" name="phone" defaultValue={"+" + phone} disabled />

        {/* <Input
          id="userType"
          name="userType"
          defaultValue={userType}
          disabled={userType !== ""}
        /> */}
      </div>
      <form>
        <Label htmlFor="userType">Tipo de paciente</Label>
        <select
          id="userType"
          name="userType"
          defaultValue={userType}
          disabled={userType !== ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="Particular">Particular</option>
          <option value="Seguro">Seguro</option>
        </select>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="name">Nombre</Label>
          <Input
            name="name"
            id="name"
            maxLength={20}
            value={formData.name} // Always defined (even if "")
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            name="lastName"
            id="lastName"
            maxLength={20}
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <Label htmlFor="docId">Cédula</Label>
          <Input
            maxLength={8}
            name="docId"
            id="docId"
            value={formData.docId}
            onChange={(e) =>
              setFormData({ ...formData, docId: e.target.value })
            }
          />
          <Label htmlFor="email">Correo</Label>
          <Input
            type="email"
            name="email"
            id="email"
            maxLength={100}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Label htmlFor="location">Dirección</Label>
          <Input
            name="location"
            id="location"
            value={formData.location}
            maxLength={100}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          {name || lastName || docId || email || location ? (
            <SubmitButton
              formAction={handleEdit}
              pendingText="Editando..."
              disabled={!uid}
            >
              Editar
            </SubmitButton>
          ) : (
            <SubmitButton formAction={handleCreate} pendingText="Creando...">
              Crear
            </SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;
