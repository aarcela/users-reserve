"use server";
import { Patient } from "@/components/patient/Profile";
import { createAdminClient, createClient } from "@/utils/supabase/server";

export async function createPatientWithPhone(
  patientData: Omit<Patient, "uid" | "created_at"> & {
    phone: string; // Now required
  },
): Promise<Patient> {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  // First create auth user using phone
  const { data: userData, error: userError } =
    await adminClient.auth.admin.createUser({
      phone: patientData.phone,
      user_metadata: {
        name: patientData.name,
        lastName: patientData.lastName,
        userType: "patient",
      },
    });

  if (userError) {
    console.error("Error creating auth user:", userError);
    throw userError;
  }

  // Then create patient record
  const name = patientData?.name?.toString();
  const lastName = patientData?.lastName?.toString();
  const docId = patientData?.docId?.toString();
  const email = patientData?.email?.toString();
  const location = patientData?.location?.toString();
  const type = patientData?.userType?.toString();

  console.log("auth create: ", userData);
  console.log("patient create: ", patientData);

  const { data, error } = await supabase
    .from("patient")
    .insert([
      {
        id: userData?.user.id,
        name,
        location,
        email,
        lastName,
        docId,
        type: type,
      },
    ])
    .select()
    .single();
  if (error) {
    console.error("Error creating patient:", error);
    throw error;
  }

  return data as Patient;
}

export async function verifyPatientPhone(phone: string) {
  const supabase = await createClient();

  // This will trigger the OTP flow
  const { error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });

  if (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

export async function listPatients(): Promise<Patient[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patient")
    .select("*")
    .order("lastName", { ascending: true });

  if (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }

  return data as Patient[];
}

export async function updatePatient(
  formData: FormData,
  uid: string,
): Promise<{ success: boolean; data: any }> {
  const email = formData.get("email")?.toString();
  const name = formData.get("name")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const docId = formData.get("docId")?.toString();
  const location = formData.get("location")?.toString();
  const userType = formData.get("userType")?.toString();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("patient")
      .update({
        name: name,
        email: email,
        lastName: lastName,
        docId: +!docId,
        location: location,
        type: userType,
      })
      .eq("id", uid)
      .select();
    console.log("Data: ", data);

    if (!error) {
      return { success: true, data };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    console.log("Error updating Patient: ", error);
    return { success: false, data: null };
  }
}

export async function updatePatientService(
  id: string,
  updates: Partial<Patient>,
): Promise<Patient> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patient")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating patient:", error);
    throw error;
  }

  return data as Patient;
}

export async function deletePatientService(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("patient").delete().eq("id", id);

  if (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
}

export async function checkPatientExists(docId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patient")
    .select("docId")
    .eq("docId", +docId)
    .single();

  console.log("Checking patient exists for docId:", docId);

  if (error && !error.details.includes("The result contains 0 rows")) {
    console.error("Error checking patient:", error);
    throw error;
  }

  return !!data;
}
