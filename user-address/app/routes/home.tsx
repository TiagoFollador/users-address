import type { Route } from "./+types/home";
import Dashboard from "../../src/pages/Dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Address Dashboard" },
    { name: "description", content: "Dashboard para gerenciar contatos e endereços" },
  ];
}

export default function Home() {
  return <Dashboard />;
}
