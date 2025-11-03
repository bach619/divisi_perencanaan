import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Page() {
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
                  Ajukan Proposal Anggaran
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Lengkapi formulir di bawah ini untuk mengajukan proposal anggaran baru
                </p>
              </div>

              <Card className="max-w-5xl">
                <CardHeader>
                  <CardTitle>Informasi Proposal</CardTitle>
                  <CardDescription>
                    Isi detail proposal anggaran yang akan diajukan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Judul Proposal <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="Contoh: Pengadaan Komputer Kantor"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Kategori <span className="text-destructive">*</span>
                      </Label>
                      <Select name="category" required>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Pilih kategori proposal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rutin">Rutin</SelectItem>
                          <SelectItem value="Project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Pilih kategori yang sesuai untuk proposal Anda.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Deskripsi <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Jelaskan tujuan dan detail proposal anggaran..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">
                        Jumlah Anggaran (Rp) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="0"
                        min="0"
                        step="1000"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Masukkan jumlah dalam Rupiah
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attachment">
                        Lampiran Dokumen
                      </Label>
                      <Input
                        id="attachment"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                      />
                      <p className="text-sm text-muted-foreground">
                        Format: PDF, DOC, DOCX, XLS, XLSX (Maks. 10MB)
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" size="lg">
                        Kirim Proposal
                      </Button>
                      <Button type="button" variant="outline" size="lg">
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}