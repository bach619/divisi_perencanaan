'use client';

import * as React from 'react';
import { User } from '@supabase/supabase-js';
import { AppSidebar } from "@/components/app-sidebar";
import { getSupabaseClient } from '@/app/supabase-client';
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Camera, Lock, Bell, Shield, Eye, Globe, User as UserIcon, Mail, Phone, MapPin, Cake, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function AccountPageContent() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState('general');
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [location, setLocation] = React.useState('');
  React.useEffect(() => {
    const fetchUser = async () => {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setFirstName(metadata.full_name?.split(' ')[0] || '');
        setLastName(metadata.full_name?.split(' ').slice(1).join(' ') || '');
        setPhone(metadata.phone || '');
        setBirthday(metadata.birthday || '');
        setLocation(metadata.location || '');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) {
        throw new Error('User not found.');
      }

      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const supabase = getSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      // Refresh user data to show new avatar
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const supabase = getSupabaseClient();
      const fullName = `${firstName} ${lastName}`.trim();

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone,
          birthday,
          location,
        },
      });

      if (error) {
        throw error;
      }

      alert('Profile updated successfully!');
      // Refresh user data
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <p className="text-lg">Please log in to view your account.</p>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: 'general', label: 'General', icon: UserIcon },
    { id: 'security', label: 'Security & Login', icon: Lock },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'public-profile', label: 'Public Profile', icon: Globe },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Card className="lg:sticky top-8">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeSection === item.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'general' && (
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                          <AvatarImage 
                            src={user.user_metadata.avatar_url || '/avatars/shadcn.jpg'} 
                            alt={user.user_metadata.full_name || 'User'} 
                          />
                          <AvatarFallback className="text-4xl">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow-md transition-colors cursor-pointer">
                            <Camera className="w-5 h-5 text-gray-700" />
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          {user.user_metadata.full_name || 'User'}
                        </h3>
                        <p className="text-gray-600 mb-4">{user.email || ''}</p>
                        <label htmlFor="avatar-upload-button">
                            <Button asChild variant="outline" className="gap-2 cursor-pointer">
                                <span>
                                    <Camera className="w-4 h-4" />
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </span>
                            </Button>
                            <input
                                id="avatar-upload-button"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                          </Label>
                          <Input 
                            id="firstName" 
                            value={firstName}
                            className="h-11"
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                          </Label>
                          <Input 
                            id="lastName" 
                            value={lastName}
                            className="h-11"
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={user.email} 
                          disabled 
                          className="h-11 bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Your email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={phone}
                          className="h-11"
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthday" className="text-sm font-medium flex items-center gap-2">
                          <Cake className="w-4 h-4" />
                          Birthday
                        </Label>
                        <Input 
                          id="birthday" 
                          type="date"
                          className="h-11"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </Label>
                        <Input 
                          id="location" 
                          value={location}
                          className="h-11"
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveChanges} disabled={saving}>
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" className="h-11" />
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Login Activity</h2>
                    <p className="text-gray-600 mb-4">
                      See where you&apos;re logged in and manage your active sessions.
                    </p>
                    <Button variant="outline">View Login Activity</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">Profile Visibility</p>
                            <p className="text-sm text-gray-600">Who can see your profile</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Public</Button>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">Contact Info</p>
                            <p className="text-sm text-gray-600">Who can see your contact info</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Friends</Button>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">Email Privacy</p>
                            <p className="text-sm text-gray-600">Who can send you emails</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Everyone</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {['Email Notifications', 'Push Notifications', 'SMS Notifications', 'Activity Alerts'].map((item) => (
                        <div key={item} className="flex items-center justify-between py-3 border-b last:border-0">
                          <p className="font-medium">{item}</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'public-profile' && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Public Profile Preview</h2>
                    <p className="text-gray-600 mb-6">
                      This is how other users see your profile.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-20 w-20 border-2 border-white shadow">
                          <AvatarImage src={user.user_metadata.avatar_url} />
                          <AvatarFallback className="text-2xl">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{user.user_metadata.full_name || 'User'}</h3>
                          <p className="text-gray-600">@{user.email?.split('@')[0]}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
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
        <AccountPageContent />
      </SidebarInset>
    </SidebarProvider>
  );
}