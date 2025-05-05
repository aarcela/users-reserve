import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
      <div className="flex flex-col gap-16 items-center">
          <h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
              Portal de Pacientes Dr. Saddy Silva
          </h1>
          <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
  );
}
