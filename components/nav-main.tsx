"use client"
import * as React from "react"
import { usePathname } from "next/navigation"

import {
  IconCirclePlusFilled,
  IconFilePlus,
  IconFileUpload,
  IconUpload,
  IconMail,
  type Icon,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileInput } from "@/components/ui/file-input"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProposals } from "@/components/proposal-context"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()
  const { addProposal } = useProposals()
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const budget = formData.get("budget") as string
    const category = formData.get("category") as string

    if (title && budget && category) {
      addProposal({
        namaProposal: title,
        jumlahAnggaran: parseInt(budget, 10),
        kategori: category,
        status: "Proses",
        tanggalDibuat: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      })
      // Reset form or show success message
      event.currentTarget.reset()
      setOpen(false) // Close the drawer
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <Drawer>
            <SidebarMenuItem className="group/menu-item flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Buat Pengajuan"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  >
                    <IconCirclePlusFilled />
                    <span>Buat Pengajuan</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DrawerTrigger asChild>
                    <DropdownMenuItem>
                      <IconFilePlus /> Proposal Baru
                    </DropdownMenuItem>
                  </DrawerTrigger>
                  <DropdownMenuItem>
                    <IconFileUpload /> Impor dari File
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconMail />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
            <DrawerContent className="mx-auto max-w-2xl" onOpenAutoFocus={(e) => e.preventDefault()}>
              <form onSubmit={handleSubmit}>
                <DrawerHeader>
                  <DrawerTitle>Ajukan Proposal Anggaran</DrawerTitle>
                  <DrawerDescription>
                    Isi form berikut untuk mengajukan proposal baru.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 p-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Judul Proposal</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Contoh: Proposal pengadaan alat..."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Deskripsi Proposal</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Jelaskan detail proposal di sini..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori Proposal</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rutin">Rutin</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="attachment">Lampiran Dokumen Proposal</Label>
                    <FileInput id="file-upload" name="attachment" multiple />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Jumlah Anggaran</Label>
                    <Input id="budget" name="budget" type="number" placeholder="Contoh: 5000000" required />
                  </div>
                </div>
                <DrawerFooter>
                  <Button type="submit">Kirim Pengajuan</Button>
                  <DrawerClose asChild>
                    <Button type="button" variant="outline">Batal</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <a href={item.url} className="flex w-full">
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname.startsWith(item.url)}
                  asChild
                >
                  <span>{item.icon && <item.icon />}<span>{item.title}</span></span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
