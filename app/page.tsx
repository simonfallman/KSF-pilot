import { RequirementsWorkspace } from "@/components/requirements-workspace";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold tracking-tight">KravBot</h1>
          <p className="text-sm text-muted-foreground">
            Beskriv ert system — AI:n identifierar tillämpliga KSF-krav och genererar systemspecifika testfall
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RequirementsWorkspace />
      </div>
    </main>
  );
}
