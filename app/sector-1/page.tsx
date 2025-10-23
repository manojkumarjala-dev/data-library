import DashboardEmbed from '../components/DashboardEmbed';
import LastUpdated from '../components/LastUpdated';


export default function Sector1Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Top row: Title + Last updated */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Sector 1</h1>
        <LastUpdated sector="sector-1" />
      </div>

      {/* KPIs section will go here later */}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <DashboardEmbed
          url="https://public.tableau.com/views/ShopifyOverviewRAWNutritionConcept/ShopifyOverview?:embed=y&:display_count=yes&:toolbar=no"
          title="Sector 1 Demo"
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Sources</h2>
        <p className="text-sm text-gray-600">
          See full list on the{' '}
          <a href="/sources" className="text-blue-600 underline">
            Sources
          </a>{' '}
          page.
        </p>
      </section>
    </main>
  );
}
