'use client';

import * as React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProposals } from '@/components/proposal-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconLoader,
  } from "@tabler/icons-react"

const dummySummaries: { [key: number]: string } = {
    1: "Proyek ini bertujuan untuk meningkatkan efisiensi operasional kantor pusat dengan menyediakan perangkat komputer modern. Diharapkan dapat meningkatkan produktivitas staf dan mempercepat alur kerja digital.",
    5: "Pengembangan sistem informasi terintegrasi untuk yayasan. Proyek ini akan mencakup modul untuk manajemen anggota, keuangan, dan pelaporan, yang bertujuan untuk sentralisasi data dan kemudahan akses.",
    6: "Proyek ini berfokus pada penyediaan akses air bersih bagi masyarakat desa melalui pembangunan sumur bor dan sistem distribusi. Tujuannya adalah meningkatkan kesehatan dan kualitas hidup warga.",
};

const getStatusBadge = (status: string) => {
    if (status === "Disetujui") {
      return (
        <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
          <IconCircleCheckFilled className="mr-1" size={14} />
          {status}
        </Badge>
      )
    }
    if (status === "Proses") {
      return (
        <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
          <IconLoader className="mr-1 animate-spin" size={14} />
          {status}
        </Badge>
      )
    }
    return (
      <Badge variant="destructive">
        <IconCircleXFilled className="mr-1" size={14} />
        {status}
      </Badge>
    )
};

export default function ProjectsPage() {
  const { proposals } = useProposals();
  const projectProposals = proposals.filter(p => p.kategori === 'Project');

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
              <div className="max-w-5xl">
                <h1 className="text-3xl font-bold tracking-tight">
                  Daftar Project
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Berikut adalah daftar semua proposal yang dikategorikan sebagai project.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 @2xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {projectProposals.map((proposal) => (
                  <Card key={proposal.id}>
                    <CardHeader>
                      <CardTitle>{proposal.namaProposal}</CardTitle>
                      <CardDescription>
                        {new Intl.DateTimeFormat("id-ID", { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(proposal.tanggalDibuat))}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            <p className='font-semibold text-foreground mb-1'>Executive Summary (AI Generated)</p>
                            {proposal.executiveSummary || dummySummaries[proposal.id] || "Ringkasan eksekutif untuk proyek ini akan segera dibuat."}
                        </div>
                        <div>{getStatusBadge(proposal.status)}</div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm">Lihat Detail</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}