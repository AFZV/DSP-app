import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function NoDisponible() {
  return (
    <div className="flex flex-col justify-center items-center h-40">
      NoDisponible
      <Button>
        <Link href="/catalog">IR AL CATALOGO</Link>
      </Button>
    </div>
  );
}
