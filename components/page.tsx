'use client';

import * as React from 'react';
import { SiteHeader } from '@/components/site-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

function SettingsPageContent() {
  return (
    <>
      <SiteHeader title="Pengaturan" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl">
              <h1 className="text-3xl font-bold tracking-tight">
                Pengaturan Akun & Aplikasi
              </h1>
              <p className="mt-2 text-muted-foreground">
                Kelola preferensi akun dan pengaturan aplikasi Anda.
              </p>
            </div>

            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Profil Pengguna</CardTitle>
                <CardDescription>
                  Perbarui informasi profil Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input id="fullName" placeholder="Masukkan nama lengkap Anda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input id="email" type="email" placeholder="email@contoh.com" disabled />
                    <p className="text-sm text-muted-foreground">
                      Email tidak dapat diubah.
                    </p>
                  </div>
                  <Button type="submit">Simpan Perubahan</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Preferensi</CardTitle>
                <CardDescription>
                  Atur tema dan bahasa aplikasi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Pilih tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Terang</SelectItem>
                      <SelectItem value="dark">Gelap</SelectItem>
                      <SelectItem value="system">Sistem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button">Simpan Preferensi</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return <SettingsPageContent />;
}