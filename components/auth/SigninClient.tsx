"use client";
import Link from "next/link";
import React, { useState } from "react";
import SendVerification from "./SendVerification";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { signInAction } from "@/app/actions";

function SigninClient() {
  const [codeSent, setCodeSent] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = (phone: string, codeSend: boolean) => {
    setCodeSent(codeSend);
    setPhone(phone);
  };

  const handleSignin = async (form: FormData) => {
    form.append("phone", phone);
    try {
      const signInRedirect = await signInAction(form);
      if (signInRedirect?.error) {
        setError("Código incorrecto. Por favor, inténtalo de nuevo.");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      console.log(error);
      setError("Por favor, inténtalo de nuevo.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">Ingresar al Portal</h1>
      <p className="text-sm text-foreground">
        No tienes cuenta?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Regístrate
        </Link>
      </p>

      {!codeSent ? (
        <SendVerification onCodeSend={handleSubmit} />
      ) : (
        <form className="flex flex-col min-w-64 max-w-64 mx-auto">
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="code">Código (SMS enviado al teléfono)</Label>
            <Input name="code" required minLength={6} maxLength={6} />
            <h3>{error}</h3>
            <SubmitButton formAction={handleSignin} pendingText="Ingresando...">
              Ingresar
            </SubmitButton>
          </div>
        </form>
      )}

      {/* <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="phone">Telefono</Label>
              <Input name="phone" placeholder="you@example.com" required />

              <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link className="text-xs text-foreground underline" href="/forgot-password">
                      Forgot Password?
                  </Link>
              </div>
              <Input type="password" name="password" placeholder="Your password" required />
              <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                  Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />
          </div> */}
    </div>
  );
}

export default SigninClient;
