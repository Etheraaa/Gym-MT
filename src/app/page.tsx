import React from "react";
import { MoveQuestApp } from "@/features/movequest/components/MoveQuestApp";
import { mockBootstrap } from "@/features/movequest/mock-flow";

export default function HomePage() {
  const isTest = process.env.NODE_ENV === "test";

  return (
    <MoveQuestApp
      initialData={mockBootstrap}
      bootstrapPath={isTest ? null : "/api/bootstrap"}
      checkInPath={isTest ? null : "/api/check-in"}
    />
  );
}
