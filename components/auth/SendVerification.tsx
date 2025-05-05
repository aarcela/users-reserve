"use client";
import React from "react";
import { SubmitButton } from "../submit-button";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { signUpAction } from "@/app/actions";

type Props = {
    onCodeSend: (phone: string, codeSend: boolean) => void;
};

function SendVerification({ onCodeSend }: Props) {
    const handleSubmit = async (form: FormData) => {
        if (form.get("phoneNumber")?.toString()) {
            const phone = `58${form.get("phoneSuffix")}${form.get("phoneNumber")}`;
            form.append("phone", phone);
            const { error } = await signUpAction(form);
            !error && onCodeSend(phone, true);
        }
    };

    return (
        <form className="flex flex-col min-w-64 max-w-64 mx-auto">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="phoneNumber">Telefono</Label>
                <div className="flex flex-row gap-2">
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        name="phoneSuffix"
                        required>
                        <option value="414">0414</option>
                        <option value="424">0424</option>
                        <option value="412">0412</option>
                        <option value="416">0416</option>
                        <option value="426">0426</option>
                    </select>
                    <Input
                        name="phoneNumber"
                        placeholder="1234567"
                        required
                        maxLength={7}
                        minLength={7}
                    />
                </div>
                <SubmitButton formAction={handleSubmit} pendingText="Enviando...">
                    Continuar
                </SubmitButton>
            </div>
        </form>
    );
}

export default SendVerification;
