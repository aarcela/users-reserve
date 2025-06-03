import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Portal de Pacientes Dr. Saddy Silva
      </h1>
      <div className="flex flex-col gap-2 items-center w-full">
        <h2>Gestiona tus citas de forma rápida</h2>
        <Button asChild size="sm" className="w-1/5">
          <Link href="/protected">Agendar cita</Link>
        </Button>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
