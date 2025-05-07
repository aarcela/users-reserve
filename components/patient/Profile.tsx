"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { updatePatient } from "@/app/services/patientService";
import { toast } from "react-toastify";

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
    });

    const handleEdit = async (form: FormData) => {
        const { success, data } = await updatePatient(form, uid); // Destructure API response
        if (success && data) {
            setFormData({
                name: data.name,
                lastName: data.lastName,
                docId: data.docId,
                email: data.email,
                location: data.location,
            });
            toast.success("Información editada correctamente");
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
                <Label htmlFor="userType">Tipo</Label>
                <Input id="userType" name="userType" defaultValue={userType} disabled />
            </div>
            <form>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        name="name"
                        id="name"
                        value={formData.name} // Always defined (even if "")
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <Label htmlFor="docId">Cédula</Label>
                    <Input
                        name="docId"
                        id="docId"
                        value={formData.docId}
                        onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                    />
                    <Label htmlFor="email">Correo</Label>
                    <Input
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Label htmlFor="location">Dirección</Label>
                    <Input
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    <SubmitButton formAction={handleEdit} pendingText="Editando...">
                        Editar
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default Profile;
