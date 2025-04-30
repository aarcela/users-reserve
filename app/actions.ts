"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
    const phone = formData.get("phone")?.toString();
    const supabase = await createClient();
    if (!phone) {
        return encodedRedirect("error", "/sign-up", "Correo y telefono son necesarios");
    }
    const { data, error } = await supabase.auth.signInWithOtp({ phone });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    } else {
        //   return encodedRedirect("success", "/sign-up", "Código enviado!");
        return { data, error };
    }
};

export const handleVerifyCode = async (formData: FormData) => {
    console.log("VerificationForm: ", formData);
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const code = formData.get("code")?.toString();
    const name = formData.get("name")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const docId = formData.get("docId")?.toString();
    const supabase = await createClient();

    if (!code || !phone || !email) return;

    const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
    });

    if (error) {
        console.error("Error verifying OTP:", error.message);
        return;
    } else {
        const { error: updateError } = await supabase.auth.updateUser({
            data: { name, lastName, docId, email },
        });
        const { data, error: sessionError } = await supabase.auth.getUser();
        if (!data?.user?.id) return;
        addUserInfo(data.user.id, formData);
        if (updateError) {
            console.error(updateError.code + " " + updateError.message);
            return encodedRedirect("error", "/sign-up", updateError.message);
        }
    }
    return redirect("/protected");
};

export const addUserInfo = async (
    uid: string,
    formData: FormData
): Promise<{ success: boolean }> => {
    try {
        const supabase = await createClient();
        const name = formData.get("name")?.toString();
        const lastName = formData.get("lastName")?.toString();
        const docId = formData.get("docId")?.toString();
        const email = formData.get("email")?.toString();
        const location = formData;
        const { error: profileError } = await supabase
            .from("patient")
            .insert([{ id: uid, name, location, email, lastName, docId }]);
        if (profileError) throw profileError;
        return { success: true };
    } catch {
        return { success: false };
    }
};

export const signInAction = async (formData: FormData) => {
    const phone = formData.get("phone")?.toString();
    const code = formData.get("code")?.toString();
    const supabase = await createClient();

    if (!code || !phone) return;

    const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
    });

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
