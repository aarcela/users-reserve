"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { updatePatient } from "@/app/patientService";

export type Patient = {
    uid: string;
    name?: string;
    lastName?: string;
    docId?: number;
    email?: string;
    phone?: string;
    location?: string;
};

function Profile({
    phone = "", // Fallback to empty string if phone is undefined
    name = "",
    uid,
    lastName = "",
    docId = 0,
    email = "",
    location = "",
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
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-64 w-full">
            <h1 className="text-2xl font-medium mx-auto mb-7">Perfil</h1>
            <Label htmlFor="phone">Telefono</Label>
            <Input name="phone" defaultValue={"+" + phone} disabled />
            <form>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        name="name"
                        value={formData.name} // Always defined (even if "")
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <Input
                        name="docId"
                        value={formData.docId}
                        onChange={(e) => setFormData({ ...formData, docId: e.target.value })}
                    />
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                        name="location"
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
