'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import {
  IconHome,
  IconFileText,
  IconBriefcase,
  IconWallet,
  IconTargetArrow,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconHelpCircle,
  IconSearch,
  IconFileImport,
  IconReport,
  IconCash,
  IconFileCheck,
  IconFileAnalytics,
  IconSatellite,
  IconCertificate,
  IconBuildingStore,
  IconBaseline,
  IconRulerMeasure,
  IconDatabase,
  IconUsersGroup,
  IconTrees,
  IconPlant,
  IconMap,
  IconArchive,
  IconFilePlus,
  IconAsset,
  IconTimeline,
  IconFileUpload,
  IconHistory,
  IconReportMoney,
  IconMessage,
  IconLayoutGrid,
  IconChevronDown,
  IconDots,
  IconUserCheck,
  IconUserCircle,
  IconBuilding,
  IconChecklist,
  IconGavel,
  IconLogout,
  IconUser,
  IconBell,
  IconCreditCard,
  IconDatabaseEdit,
} from '@tabler/icons-react'

import { IconBook2 } from '@tabler/icons-react'
import { useAuth } from '@/app/auth-context'
import { getSupabaseClient } from '@/app/supabase-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const navMain = [
  { title: 'Dashboard', url: '/dashboard', icon: IconHome },
  {
    title: 'Divisi Perencanaan', // Note: This title is used as a key
    url: '/perencanaan',
    icon: IconFileText,
    children: [
      { title: 'Projects', url: '/perencanaan/projects', icon: IconBriefcase },
      { title: 'Analitik', url: '/analitik', icon: IconChartBar },
      { title: 'Pengolahan Data', url: '/perencanaan/pengolahan-data', icon: IconDatabaseEdit },
      { title: 'Tim Divisi', url: '/perencanaan/tim', icon: IconUsersGroup },
      { title: 'Monev', url: '/monev', icon: IconReport },
    ],
  },
  {
    title: 'Divisi Pelaksana Program',
    url: '/pelaksanaprogram',
    icon: IconTargetArrow,
    children: [
      { title: 'Progres & Milestone', url: '/pelaksana-program/progres', icon: IconTimeline },
      { title: 'Pengajuan LPJ', url: '/pelaksana-program/lpj', icon: IconFileUpload },
      { title: 'Tim Divisi', url: '/pelaksana-program/tim', icon: IconUsersGroup },
    ],
  },
  {
    title: 'Divisi Keuangan',
    url: '/keuangan',
    icon: IconWallet,
    children: [
      { title: 'Pencairan Dana', url: '/keuangan/pencairan', icon: IconCash },
      { title: 'Verifikasi LPJ', url: '/keuangan/verifikasi', icon: IconFileCheck },
      { title: 'Riwayat Transaksi', url: '/keuangan/riwayat', icon: IconHistory },
      { title: 'Laporan Keuangan', url: '/keuangan/laporan', icon: IconReportMoney },
      { title: 'Tim Divisi', url: '/keuangan/tim', icon: IconUsersGroup },
    ],
  },
  {
    title: 'Divisi Personalia, Umum, & Adm',
    url: '/personaliaumumadministrasi',
    icon: IconBuilding,
    children: [
      { title: 'Manajemen Pengguna', url: '/personalia/users', icon: IconUsers },
      { title: 'Manajemen Aset', url: '/personalia/aset', icon: IconAsset },
      { title: 'Pengajuan Internal', url: '/personalia/pengajuan', icon: IconFilePlus },
      { title: 'Arsip & Persuratan', url: '/personalia/arsip', icon: IconArchive },
      { title: 'Tim Divisi', url: '/personalia/tim', icon: IconUsersGroup },
    ],
  },
]

const navBankData = [
  {
    title: 'Bank Data & Dokumen',
    url: '/bank-data',
    icon: IconDatabase,
    children: [
      { title: 'Dokumen Proyek & Legal', url: '/bank-data/legal', icon: IconUsersGroup },
      { title: 'Data Baseline & Referensi', url: '/bank-data/baseline', icon: IconBaseline },
      { title: 'Monitoring Lapangan', url: '/bank-data/monitoring-lapangan', icon: IconRulerMeasure },
      { title: 'Penginderaan Jauh', url: '/bank-data/remote-sensing', icon: IconSatellite },
      { title: 'Laporan & Verifikasi', url: '/bank-data/laporan', icon: IconFileAnalytics },
      { title: 'Data Usaha Masyarakat', url: '/bank-data/usaha-masyarakat', icon: IconBuildingStore },
      { title: 'SOP Kantor', url: '/bank-data/sop', icon: IconBook2 },
    ],
  },
];

const navApproval = [
  {
    title: 'Kepala Cabang (Validator)',
    url: '/kepalacabang',
    icon: IconChecklist,
    children: [
      { title: 'Dashboard Pemantauan', url: '/dashboard', icon: IconLayoutGrid },
      { title: 'Antrean Validasi', url: '/kepalacabang', icon: IconTimeline },
      { title: 'Riwayat Validasi', url: '/kepalacabang/riwayat', icon: IconHistory },
      { title: 'KPI', url: '/kepalacabang/kpi', icon: IconChartBar },
    ],
  },
  {
    title: 'Ketua Yayasan (Approver)',
    url: '/dashboard',
    icon: IconGavel,
    children: [
      { title: 'Antrean Persetujuan', url: '/ketuayayasan', icon: IconTimeline },
      { title: 'Riwayat Persetujuan', url: '/ketuayayasan/riwayat', icon: IconHistory },
      { title: 'Laporan Keuangan', url: '/keuangan/laporan', icon: IconReportMoney },
      { title: 'KPI', url: '/ketuayayasan/kpi', icon: IconChartBar },
    ],
  },
]

const navSecondary = [
  { title: 'Settings', url: '/settings', icon: IconSettings },
  { title: 'Get Help', url: '/help', icon: IconHelpCircle },
  { title: 'Search', url: '/search', icon: IconSearch },
]

function MainNav({ items }: { items: typeof navMain }) {
  const pathname = usePathname()
  return (
    <SidebarMenu>
      {items.map((item) => (
        item.children ? 
          <NavDropdownMenuItem 
            key={item.title} 
            item={item} 
            pathname={pathname} 
          /> 
        : (
          <SidebarMenuItem key={item.title}>
            <a href={item.url} className="flex w-full">
              <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.url)} asChild>
                <span>
                  {item.icon && (
                    <item.icon
                      className={item.title === 'Dashboard' ? 'size-5' : ''}
                    />
                  )}
                  <span>{item.title}</span>
                </span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        )
      ))}
    </SidebarMenu>
  )
}

type NavItemWithChildren = (typeof navMain)[0] | (typeof navBankData)[0] | (typeof navApproval)[0];

function NavDropdownMenuItem({ item, pathname }: { item: NavItemWithChildren, pathname: string }) {
  const [isOpen, setIsOpen] = React.useState(item.children?.some(child => pathname.startsWith(child.url)) || false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={pathname === item.url}
        className="w-full justify-start"
        asChild
      >
        <div className="flex w-full items-center">
          <a href={item.url} className="flex flex-1 items-center gap-2">
            {item.icon && (
              <item.icon />
            )}
            <span>{item.title}</span>
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto p-1 -mr-1 rounded-md hover:bg-accent"
          >
            <IconChevronDown
              className={`size-4 shrink-0 cursor-pointer transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
            />
            <span className="sr-only">Toggle submenu</span>
          </button>
        </div>
      </SidebarMenuButton>
      {isOpen && (
        <SidebarMenu className="ml-4">
          {item.children?.map((child) => (
            <SidebarMenuItem key={child.title}>
              <a href={child.url} className="flex w-full">
                <SidebarMenuButton
                  tooltip={child.title}
                  isActive={pathname.startsWith(child.url)}
                  asChild
                >
                  <span>
                    {child.icon && <child.icon />}
                    <span>{child.title}</span>
                  </span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  );
}

function ApprovalNav({ items }: { items: typeof navApproval }) {
  const pathname = usePathname()
  return (
    <SidebarMenu>
      {items.map((item) =>
        item.children ? (
          <NavDropdownMenuItem key={item.title} item={item} pathname={pathname} />
        ) : (
          <SidebarMenuItem key={item.title}>
            <a href={item.url} className="flex w-full">
              <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.url)} asChild>
                <span>{item.icon && <item.icon />}<span>{item.title}</span></span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        )
      )}
    </SidebarMenu>
  )
}

function SecondaryNav({
  items,
  className,
}: {
  items: typeof navSecondary
  className?: string
}) {
  return (
    <SidebarMenu className={className}>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

interface UserProfile {
  name: string
  email: string
  avatar: string
}

function UserMenu({ user }: { user: UserProfile }) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <IconUser />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconBell />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar({ ...props }) {
  const { user, loading } = useAuth()

  if (loading) {
    // Saat loading, tampilkan skeleton sidebar agar layout tidak berantakan.
    // Ini memberikan pengalaman pengguna yang lebih baik daripada halaman kosong.
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <div className="p-4"><p>Loading user...</p></div>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconLayoutGrid className="!size-5" />
                <span className="text-base font-semibold">Kantoor Antang</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        <MainNav items={navMain} />
        <SidebarSeparator className="my-2" />
        <ApprovalNav items={navApproval} />
        <SidebarSeparator className="my-2" />
        <SidebarSeparator className="my-2" />
        <MainNav items={navBankData} />
      </SidebarContent>
      <SidebarFooter>
        <SecondaryNav items={navSecondary} />
        {user && (
          <UserMenu
            user={{
              name: user.profile?.full_name || user.email || 'User',
              email: user.email || '',
              avatar:
                user.user_metadata?.avatar_url || '/avatars/placeholder.jpg',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
