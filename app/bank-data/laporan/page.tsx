'use client';

import * as React from 'react';
import { SiteHeader } from '@/components/site-header';

export default function LaporanKeuanganPage() {
  return (
    <>
      <SiteHeader title="Laporan Keuangan" />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold tracking-tight">
            Dasbor Laporan Keuangan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Halaman ini berisi ringkasan, visualisasi, dan unduhan laporan keuangan yayasan.
          </p>
        </div>
      </div>
    </>
  );
}