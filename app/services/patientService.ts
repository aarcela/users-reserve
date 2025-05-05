"use server";
import { createClient } from "@/utils/supabase/server";

type Patient = {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

export async function updatePatient(
    formData: FormData,
    uid: string
): Promise<{ success: boolean; data: any }> {
    const email = formData.get("email")?.toString();
    const name = formData.get("name")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const docId = formData.get("docId")?.toString();
    const location = formData.get("location")?.toString();

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("patient")
        .update({
            name: name,
            email: email,
            lastName: lastName,
            docId: docId,
            location: location,
        })
        .eq("id", uid)
        .select();

    if (!error) {
        return { success: true, data };
    } else {
        return { success: false, data: null };
    }
}
