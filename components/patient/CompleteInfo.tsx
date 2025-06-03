"use client";

import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

export default function CompleteInfo() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/protected/profile")}
      className="cursor-pointer bg-accent text-lg p-3 px-5 rounded-md text-foreground flex gap-3 items-center"
    >
      <InfoIcon size="16" strokeWidth={2} />

      <h1>Por favor, haz click aquí para completa tus datos en tu perfil</h1>
    </div>
  );
}
