"use server";
import { createClient } from "@/utils/supabase/server";
interface Appointment {
    patient_id: string;
    appointment_type: string;
    appointment_date: Date;
    count: number;
    patient: any;
}

export const getAppointments = async (): Promise<Appointment[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("appointment")
        .select("*, patient:patient(*)")
        .order("appointment_date", { ascending: true });

    if (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }

    return data as Appointment[];
};

export const getAppointmentsByUser = async (
    uid: string,
    limitDate?: string
): Promise<Appointment[]> => {
    const supabase = await createClient();
    let query = supabase
        .from("appointment")
        .select("*, patient:patient(*)")
        .eq("patient_id", uid);

    if (limitDate) {
        query = query.gte("appointment_date", limitDate);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
    return data as Appointment[];
};

const checkAvailability = async (selectedDate: string) => {
    const supabase = await createClient();
    const { count } = await supabase
        .from("appointments")
        .select("*", { count: "exact" })
        .eq("appointment_date", selectedDate);

    return (count ?? 0) < 15;
};

export const reserveAppointment = async (
    patient_id: string,
    appointment_date: string,
    appointment_type: string
): Promise<boolean> => {
    if (!(await checkAvailability(appointment_date))) {
        return false;
    }

    const supabase = await createClient();

    const { error } = await supabase.from("appointment").insert({
        patient_id: patient_id,
        appointment_type,
        appointment_date,
    });

    if (error) {
        console.error("Error reserving appointment:", error);
        return false;
    } else {
        return true;
    }
};
