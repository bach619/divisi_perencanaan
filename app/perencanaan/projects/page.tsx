'use client';

import * as React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from '@/components/data-table';
import { useProposals } from '@/components/proposal-context';

function ProjectsPageContent() {
  const { proposals } = useProposals();
  // Filter proposals to only show those with category "Project"
  const projectProposals = proposals.filter(p => p.kategori === 'Project');

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DataTable data={projectProposals} />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Projects" />
        <ProjectsPageContent />
      </SidebarInset>
    </SidebarProvider>
  );
}