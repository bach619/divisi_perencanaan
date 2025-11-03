"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLayoutColumns,
  IconClockHour4,
  IconLoader,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useProposals } from "@/components/proposal-context"
import { Input } from "@/components/ui/input"

export const schema = z.object({
  id: z.number(),
  namaProposal: z.string(),
  kategori: z.string(),
  status: z.string(),
  jumlahAnggaran: z.number(),
  tanggalDibuat: z.string(),
  executiveSummary: z.string().optional(),
})

function DataTableRow({ row }: { row: Row<any> }) {
  return (
    <TableRow 
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

function getColumns(pageType: 'validasi' | 'default'): ColumnDef<z.infer<typeof schema>>[] {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        return pageIndex * pageSize + row.index + 1
      },
    },
    {
      accessorKey: "namaProposal",
      header: "Nama Proposal",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} pageType={pageType} />;
      },
      enableHiding: false,
    },
    {
      accessorKey: "tanggalDibuat",
      header: "Tanggal Dibuat",
      cell: ({ row }) => {
        const date = new Date(row.getValue("tanggalDibuat"))
        const formatted = new Intl.DateTimeFormat("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "kategori",
      header: "Kategori",
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("kategori")}</div>
      },
    },
    {
      accessorKey: "jumlahAnggaran",
      header: () => <div className="text-right">Jumlah Anggaran</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("jumlahAnggaran"))
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount)
  
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        if (status === "Disetujui") {
          return <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"><IconCircleCheckFilled />{status}</Badge>
        }
        if (status === "Proses") {
          return <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"><IconLoader className="animate-spin" />{status}</Badge>
        }
        if (status === "Menunggu Validasi") {
          return <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"><IconClockHour4 />{status}</Badge>
        }
        return (
          <Badge variant="destructive">
            <IconCircleXFilled />{status}
          </Badge>
        )
      },
    },
  ]
}

type DataTableProps = {
  data?: z.infer<typeof schema>[];
  pageType?: 'validasi' | 'default';
}

export function DataTable({ data: filteredData, pageType = 'default' }: DataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { proposals } = useProposals()

  // If pageType is 'validasi', filter proposals to only show 'Menunggu Validasi'
  const data = React.useMemo(() => {
    const sourceData = filteredData || proposals;
    if (pageType === 'validasi') {
      return sourceData.filter(p => p.status === "Menunggu Validasi");
    }
    return sourceData;
  }, [filteredData, proposals, pageType]);

  const columns = React.useMemo(() => getColumns(pageType), [pageType]);


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const handleTabChange = (value: string) => {
    if (value === "all") {
      table.setColumnFilters([]);
    } else {
      table.setColumnFilters([{ id: 'status', value }]);
    }
    table.setPagination({ pageIndex: 0, pageSize: 10 });
  };

  if (pageType === 'validasi') {
    return <ValidationTable table={table as any} columns={columns} />;
  }

  return (
    <Tabs
      defaultValue="all"
      className="w-full flex-col justify-start"
    >
      <div className="flex items-end justify-between border-b">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden border-b-0 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all" onClick={() => handleTabChange('all')}>Semua</TabsTrigger>
          <TabsTrigger value="Menunggu Validasi" onClick={() => handleTabChange('Menunggu Validasi')}>Menunggu Validasi</TabsTrigger>
          <TabsTrigger value="Proses" onClick={() => handleTabChange('Proses')}>Proses</TabsTrigger>
          <TabsTrigger value="Disetujui" onClick={() => handleTabChange('Disetujui')}>Disetujui</TabsTrigger>
          <TabsTrigger value="Ditolak" onClick={() => handleTabChange('Ditolak')}>Ditolak</TabsTrigger>
        </TabsList>
        <Select defaultValue="all" onValueChange={handleTabChange}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Menunggu Validasi">Menunggu Validasi</SelectItem>
            <SelectItem value="Proses">Proses</SelectItem>
            <SelectItem value="Disetujui">Disetujui</SelectItem>
            <SelectItem value="Ditolak">Ditolak</SelectItem>
          </SelectContent>
        </Select>
        <div className="mb-2 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value={columnFilters.find(f => f.id === 'status')?.value as string || "all"}
        className="relative flex flex-col gap-4 overflow-auto p-4 lg:p-6"
      >
        <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DataTableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function ValidationTable({ table, columns }: { table: any, columns: ColumnDef<any>[] }) {
  return (
    <div className="relative flex flex-col gap-4 overflow-auto p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Antrean Validasi Proposal</h2>
          <p className="text-muted-foreground">Daftar proposal yang menunggu tindakan Anda.</p>
        </div>
        <Input
          placeholder="Cari proposal..."
          value={(table.getColumn("namaProposal")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("namaProposal")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <DataTableRow key={row.id} row={row} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada proposal yang menunggu validasi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
function TableCellViewer({ item, pageType }: { item: z.infer<typeof schema>, pageType: 'validasi' | 'default' }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        {/* Tombol link ini akan memicu Drawer untuk membuka detail proposal */}
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.namaProposal}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.namaProposal}</DrawerTitle>
          <DrawerDescription>
            Detail proposal dan status pengajuan.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="namaProposal">Nama Proposal</Label>
              <Input id="namaProposal" defaultValue={item.namaProposal} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="kategori">Kategori</Label>
              <Input id="kategori" defaultValue={item.kategori} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="jumlahAnggaran">Jumlah Anggaran</Label>
              <Input id="jumlahAnggaran" type="number" defaultValue={item.jumlahAnggaran} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="tanggalDibuat">Tanggal Dibuat</Label>
              <Input id="tanggalDibuat" defaultValue={item.tanggalDibuat} readOnly />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proses">Proses</SelectItem>
                    <SelectItem value="Disetujui">Disetujui</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          {pageType === 'validasi' ? (
            <div className="flex justify-end gap-2">
              <Button variant="destructive">Tolak Proposal</Button>
              <Button variant="outline">Minta Revisi</Button>
              <Button>Setujui & Teruskan</Button>
            </div>
          ) : (
            <>
              <Button>Simpan Perubahan</Button>
              <DrawerClose asChild>
                <Button variant="outline">Tutup</Button>
              </DrawerClose>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
