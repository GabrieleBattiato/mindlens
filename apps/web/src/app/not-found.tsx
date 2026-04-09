import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <span className="gradient-text text-7xl font-bold">404</span>
      <p className="text-sm text-zinc-400">Pagina no encontrada</p>
      <Button
        variant="outline"
        className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
        render={<Link href="/" />}
      >
        Volver al inicio
      </Button>
    </div>
  );
}
