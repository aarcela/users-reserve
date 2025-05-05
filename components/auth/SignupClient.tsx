"use client";
import { useState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleVerifyCode } from "@/app/actions";
import SendVerification from "./SendVerification";

const SignupClient: React.FC = () => {
    const [phone, setPhone] = useState<string>("");
    const [codeSent, setCodeSent] = useState(false);

    const handleSubmit = async (phone: string, codeSend: boolean) => {
        setCodeSent(codeSend);
        setPhone(phone);
    };

    const handleRegistration = async (form: FormData) => {
        form.append("phone", phone);
        await handleVerifyCode(form);
    };

    return (
        <div className="flex flex-col min-w-64 max-w-64 mx-auto">
            <h1 className="text-2xl font-medium">Registro</h1>
            <p className="text-sm text text-foreground">
                Ya tienes tu cuenta?{" "}
                <Link className="text-primary font-medium underline" href="/sign-in">
                    Ingresa al Portal de Pacientes
                </Link>
            </p>{" "}
            {!codeSent ? (
                <SendVerification onCodeSend={handleSubmit} />
            ) : (
                <form>
                    <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                        <Label htmlFor="code">Código que llega al teléfono</Label>
                        <Input name="code" required minLength={6} maxLength={6} />
                        <Label htmlFor="name">Nombre</Label>
                        <Input name="name" required minLength={3} />
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input name="lastName" required minLength={3} />
                        <Label htmlFor="docId">Cédula</Label>
                        <Input name="docId" required type="tel" minLength={6} maxLength={8} />
                        <Label htmlFor="email">Correo</Label>
                        <Input
                            name="email"
                            placeholder="you@ejemplo.com"
                            required
                            type="email"
                            minLength={3}
                        />
                        <SubmitButton
                            formAction={handleRegistration}
                            pendingText="Registrando...">
                            Registrarme
                        </SubmitButton>
                    </div>
                </form>
            )}
            {/* <SmtpMessage /> */}
        </div>
    );
};

export default SignupClient;
