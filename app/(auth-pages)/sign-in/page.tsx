import { signInAction } from "@/app/actions";
import SendVerification from "@/components/auth/SendVerification";
import SigninClient from "@/components/auth/SigninClient";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default async function Login() {
    return <SigninClient />;
}
