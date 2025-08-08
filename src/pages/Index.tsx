import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

const Index = () => {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Visual Task Vista",
    applicationCategory: "ProjectManagementApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Kanban Board | Visual Task Management</title>
        <meta name="description" content="Organize tasks with lists, priorities, and due dates. Drag-and-drop Kanban board for fast visual planning." />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="Kanban Board | Visual Task Management" />
        <meta property="og:description" content="Organize tasks with lists, priorities, and due dates." />
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
      </Helmet>
      <div className="container py-8 space-y-6">
        <Header />
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Index;
