"use client";
import { useSearchParams } from "next/navigation";

export default function FacebookSuccess() {
  const params = useSearchParams();
  const imported = params.get("imported");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Facebook Friends Imported!</h1>
      <p>{imported} friends imported into your account ✅</p>
    </div>
  );
}
