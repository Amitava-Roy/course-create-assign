"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/admin/assign");
    } else {
      router.push("/login");
    }
  }, [router]);
  return (
    <div className="bg-">
      <p className="text-blue-600">Hello World1</p>
    </div>
  );
}
