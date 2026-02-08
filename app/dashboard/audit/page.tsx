"use client";
import { useEffect, useState } from "react";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/audit", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setLogs);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Audit Logs</h1>

      <ul>
        {logs.map((log: any) => (
          <li key={log.id} className="border-b py-2">
            {log.action} — {new Date(log.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
