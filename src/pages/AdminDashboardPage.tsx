import React, { useState, useEffect } from 'react';
import { Vehicle, BusinessSettings, AdminUser, VehicleImage, TransmissionType, FuelType, BodyType, VehicleCondition, AvailabilityStatus } from '../types';
import { vehicleRepository } from '../repositories/MockVehicleRepository';
import { businessSettingsRepository } from '../repositories/MockBusinessSettingsRepository';
import { authService } from '../services/MockAuthenticationService';
import { mediaStorageService } from '../services/MockMediaStorageService';
import { formatPKR, formatMileage } from '../utils/formatters';
import {
  Shield,
  LayoutDashboard,
  Car,
  PlusCircle,
  Settings,
  LogOut,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertTriangle,
  Upload,
  Star,
  RotateCcw,
  ExternalLink,
  X,
  Plus,
  Image as ImageIcon,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardPageProps {
  onBackToSite: () => void;
  onPreviewVehicle: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onBackToSite,
  onPreviewVehicle,
}) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'add' | 'settings'>('overview');

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editing state
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewModalVehicle, setPreviewModalVehicle] = useState<Vehicle | null>(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    pricePKR: 5000000,
    mileageKm: 0,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineCapacityCc: 1500,
    exteriorColor: '',
    interiorColor: '',
    bodyType: 'Sedan',
    registrationCity: 'Dera Ghazi Khan',
    importStatus: 'Local Assembled',
    condition: 'Excellent',
    features: [],
    description: '',
    images: [],
    status: 'Available',
    isFeatured: false,
    adminNotes: '',
  });

  const [featureInput, setFeatureInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageViewLabel, setNewImageViewLabel] = useState<VehicleImage['viewLabel']>('Front Three-Quarter');

  // Load Auth
  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
  }, []);

  // Load Data
  const refreshData = async () => {
    const [vList, settings] = await Promise.all([
      vehicleRepository.getAllVehicles(),
      businessSettingsRepository.getSettings(),
    ]);
    setVehicles(vList);
    setBusinessSettings(settings);
  };

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await authService.login(loginInput);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    } else {
      setLoginError(res.error || 'Login failed.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Handle Form Change
  const handleInputChange = (field: keyof Vehicle, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add Feature tag
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx),
    }));
  };

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const newImg: VehicleImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      order: (formData.images?.length || 0) + 1,
      viewLabel: newImageViewLabel,
      isVerified: true,
      altText: `${formData.year || ''} ${formData.make || ''} ${formData.model || ''} ${newImageViewLabel}`,
    };
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImg],
    }));
    setNewImageUrl('');
  };

  // Local Image File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await mediaStorageService.uploadImage(file);
      const newImg: VehicleImage = {
        id: `img-upload-${Date.now()}`,
        url: dataUrl,
        order: (formData.images?.length || 0) + 1,
        viewLabel: newImageViewLabel,
        isVerified: true,
        altText: `${formData.year || ''} ${formData.make || ''} ${formData.model || ''} uploaded photo`,
      };
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImg],
      }));
      showNotification('success', 'Image uploaded successfully.');
    } catch (err: any) {
      showNotification('error', err.message || 'Image upload failed.');
    }
  };

  const handleRemoveImage = (imgId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img.id !== imgId),
    }));
  };

  // Start Editing Vehicle
  const handleStartEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({ ...vehicle });
    setActiveTab('add');
  };

  // Save Vehicle (Create or Update)
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.year || !formData.pricePKR) {
      showNotification('error', 'Please fill in all mandatory fields: Make, Model, Year, Asking Price.');
      return;
    }

    try {
      if (editingVehicle) {
        // Update
        await vehicleRepository.updateVehicle(editingVehicle.id, formData);
        showNotification('success', `Vehicle ${editingVehicle.id} updated successfully.`);
      } else {
        // Create
        await vehicleRepository.createVehicle(formData as any);
        showNotification('success', 'New vehicle listing added to showroom inventory.');
      }
      setEditingVehicle(null);
      // Reset form
      setFormData({
        make: '',
        model: '',
        variant: '',
        year: new Date().getFullYear(),
        pricePKR: 5000000,
        mileageKm: 0,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        engineCapacityCc: 1500,
        exteriorColor: '',
        interiorColor: '',
        bodyType: 'Sedan',
        registrationCity: 'Dera Ghazi Khan',
        importStatus: 'Local Assembled',
        condition: 'Excellent',
        features: [],
        description: '',
        images: [],
        status: 'Available',
        isFeatured: false,
        adminNotes: '',
      });
      await refreshData();
      setActiveTab('cars');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save vehicle.');
    }
  };

  // Delete Vehicle with confirmation
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await vehicleRepository.deleteVehicle(deleteConfirmId);
      showNotification('success', 'Vehicle removed from showroom inventory.');
      setDeleteConfirmId(null);
      await refreshData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete vehicle.');
    }
  };

  // Quick Status Toggle
  const handleQuickStatusChange = async (id: string, status: AvailabilityStatus) => {
    await vehicleRepository.updateVehicle(id, { status });
    showNotification('success', `Vehicle status updated to ${status}.`);
    await refreshData();
  };

  // Quick Featured Toggle
  const handleToggleFeatured = async (id: string, current: boolean) => {
    await vehicleRepository.updateVehicle(id, { isFeatured: !current });
    showNotification('success', `Vehicle featured status updated.`);
    await refreshData();
  };

  // Reset to default seed
  const handleResetSeed = async () => {
    if (window.confirm('Reset all showroom listings back to default verified demo data?')) {
      await vehicleRepository.resetToDefaultSeed();
      await refreshData();
      showNotification('success', 'Showroom inventory reset to default seed records.');
    }
  };

  // Save Business Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessSettings) return;
    await businessSettingsRepository.updateSettings(businessSettings);
    showNotification('success', 'Showroom contact and business settings saved.');
  };

  // Login Screen if not authenticated
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#090A0C] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#090A0C] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#15171B] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1E2229] border border-[#C6A15B]/50 flex items-center justify-center mx-auto text-[#C6A15B]">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Leghari Motors Admin</h1>
            <p className="text-xs text-slate-400">
              Showroom Administration Portal · Dera Ghazi Khan
            </p>
          </div>

          {/* Development Mode Notice (Mandatory from prompt Section 8) */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/30 text-xs text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Development Demo Mode</span>
            </div>
            <p className="text-[11px] text-amber-200/80">
              Authorized admin username: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-100 font-mono">shahidlegahrii</code>. Database credentials are not required for this mock repository version.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="shahidlegahrii"
                className="w-full px-4 py-3 rounded-xl bg-[#090A0C] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#C6A15B] text-sm"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 bg-rose-950/50 p-2.5 rounded-lg border border-rose-800/40">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-black bg-[#C6A15B] hover:bg-[#D4B26F] transition-all text-sm uppercase tracking-wider shadow-[0_4px_14px_rgba(198,161,91,0.3)]"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Public Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalCount = vehicles.length;
  const availableCount = vehicles.filter((v) => v.status === 'Available').length;
  const soldCount = vehicles.filter((v) => v.status === 'Sold').length;
  const featuredCount = vehicles.filter((v) => v.isFeatured).length;

  return (
    <div className="min-h-screen bg-[#090A0C] text-slate-100">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#15171B]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#090A0C] border border-[#C6A15B] flex items-center justify-center text-[#C6A15B] font-bold text-xs">
            LM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Leghari Motors Admin</span>
              <span className="text-[10px] bg-[#C6A15B]/20 text-[#C6A15B] px-1.5 py-0.5 rounded font-medium">
                Demo Auth
              </span>
            </div>
            <span className="text-xs text-slate-400 block">
              Owner: <strong>Shahid Leghari</strong> (<code className="text-slate-300">@{currentUser.username}</code>)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 hover:bg-rose-900/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Notifications Toast */}
      {actionMessage && (
        <div className="fixed top-16 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-600'
                : 'bg-rose-950 text-rose-200 border-rose-600'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        </div>
      )}

      {/* Dashboard Sub-nav */}
      <div className="bg-[#121418] border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#C6A15B] text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'cars'
                ? 'bg-[#C6A15B] text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Manage Cars ({totalCount})</span>
          </button>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setActiveTab('add');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'add'
                ? 'bg-[#C6A15B] text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{editingVehicle ? 'Edit Vehicle' : 'Add New Car'}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#C6A15B] text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Showroom & Contact Settings</span>
          </button>
          <button
            onClick={handleResetSeed}
            className="ml-auto text-xs text-slate-500 hover:text-[#C6A15B] flex items-center gap-1 px-2.5 py-1.5 rounded"
            title="Reset to default seed listings"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo Seed</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#15171B] border border-white/10 space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Total Listings</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                  {totalCount}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#15171B] border border-white/10 space-y-1">
                <span className="text-xs text-emerald-400 uppercase tracking-wider">Available Stock</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                  {availableCount}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#15171B] border border-white/10 space-y-1">
                <span className="text-xs text-amber-400 uppercase tracking-wider">Featured Cars</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
                  {featuredCount}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#15171B] border border-white/10 space-y-1">
                <span className="text-xs text-rose-400 uppercase tracking-wider">Sold Archive</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tabular-nums">
                  {soldCount}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Inventory */}
            <div className="p-6 rounded-2xl bg-[#15171B] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Recently Added Vehicles</h3>
                  <p className="text-xs text-slate-400">Current active showroom stock in Dera Ghazi Khan</p>
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3 py-1.5 rounded-lg bg-[#C6A15B] text-black text-xs font-bold"
                >
                  + Add New Vehicle
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {vehicles.slice(0, 5).map((v) => (
                  <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg bg-[#090A0C] overflow-hidden border border-white/10 shrink-0">
                        {v.images[0] ? (
                          <img
                            src={v.images[0].url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                            No Pic
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {v.year} {v.make} {v.model}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatPKR(v.pricePKR)} · {v.registrationCity} Reg · Ref: {v.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                          v.status === 'Available'
                            ? 'bg-emerald-950 text-emerald-300'
                            : v.status === 'Reserved'
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-rose-950 text-rose-300'
                        }`}
                      >
                        {v.status}
                      </span>
                      <button
                        onClick={() => handleStartEdit(v)}
                        className="p-1.5 text-slate-400 hover:text-white"
                        title="Edit Vehicle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MANAGE CARS TAB */}
        {activeTab === 'cars' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Showroom Inventory Management</h2>
                <p className="text-xs text-slate-400">Update availability, price, features, and imagery</p>
              </div>
              <button
                onClick={() => {
                  setEditingVehicle(null);
                  setActiveTab('add');
                }}
                className="px-4 py-2 rounded-xl bg-[#C6A15B] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="rounded-2xl bg-[#15171B] border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090A0C] text-slate-400 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4">Mileage</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-8 rounded bg-[#090A0C] overflow-hidden border border-white/10 shrink-0">
                              {v.images[0] ? (
                                <img
                                  src={v.images[0].url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-500">
                                  No Pic
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white">
                                {v.year} {v.make} {v.model}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {v.variant} · ID: {v.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-white tabular-nums">
                          {formatPKR(v.pricePKR)}
                        </td>

                        <td className="py-3 px-4 tabular-nums">
                          {formatMileage(v.mileageKm)}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={v.status}
                            onChange={(e) =>
                              handleQuickStatusChange(v.id, e.target.value as AvailabilityStatus)
                            }
                            className={`px-2 py-1 rounded text-xs font-semibold focus:outline-none border ${
                              v.status === 'Available'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : v.status === 'Reserved'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : 'bg-rose-950 text-rose-300 border-rose-800'
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleFeatured(v.id, v.isFeatured)}
                            className={`p-1.5 rounded transition-colors ${
                              v.isFeatured
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                            title={v.isFeatured ? 'Featured (Click to unfeature)' : 'Mark Featured'}
                          >
                            <Star className={`w-4 h-4 ${v.isFeatured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onPreviewVehicle(v.id)}
                              className="p-1.5 text-slate-400 hover:text-white"
                              title="Public View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(v)}
                              className="p-1.5 text-[#C6A15B] hover:text-[#E2CA8E]"
                              title="Edit Details & Images"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(v.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT CAR TAB */}
        {activeTab === 'add' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingVehicle ? `Edit Vehicle (${editingVehicle.id})` : 'Add New Vehicle Listing'}
                </h2>
                <p className="text-xs text-slate-400">
                  Ensure all details, vehicle generation, and images match physical showroom stock.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('cars')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-8">
              {/* Core Attributes */}
              <div className="p-6 rounded-2xl bg-[#15171B] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6A15B]">
                  Core Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Make / Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota, Honda"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Land Cruiser, Civic"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Variant / Trim</label>
                    <input
                      type="text"
                      placeholder="e.g. ZX 300 Series, RS Turbo"
                      value={formData.variant}
                      onChange={(e) => handleInputChange('variant', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Model Year *</label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2027}
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Asking Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min={100000}
                      step={50000}
                      value={formData.pricePKR}
                      onChange={(e) => handleInputChange('pricePKR', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.mileageKm}
                      onChange={(e) => handleInputChange('mileageKm', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Engine (cc)</label>
                    <input
                      type="number"
                      min={600}
                      max={7000}
                      value={formData.engineCapacityCc}
                      onChange={(e) => handleInputChange('engineCapacityCc', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value as TransmissionType)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                      <option value="AGS">AGS</option>
                      <option value="e-CVT">e-CVT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => handleInputChange('fuelType', e.target.value as FuelType)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                      <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Body Style</label>
                    <select
                      value={formData.bodyType}
                      onChange={(e) => handleInputChange('bodyType', e.target.value as BodyType)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Crossover">Crossover</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Condition</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value as VehicleCondition)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                      <option value="Good">Good</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Exterior Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Pearl White"
                      value={formData.exteriorColor}
                      onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Interior Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Beige Leather"
                      value={formData.interiorColor}
                      onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Registration City</label>
                    <input
                      type="text"
                      placeholder="e.g. Dera Ghazi Khan, Lahore"
                      value={formData.registrationCity}
                      onChange={(e) => handleInputChange('registrationCity', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Import Status</label>
                    <select
                      value={formData.importStatus}
                      onChange={(e) => handleInputChange('importStatus', e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Local Assembled">Local Assembled</option>
                      <option value="Japanese Import">Japanese Import</option>
                      <option value="Brand New Import">Brand New Import</option>
                      <option value="UK Import">UK Import</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Gallery Images Management (Strict rules: verified view labels, upload or url) */}
              <div className="p-6 rounded-2xl bg-[#15171B] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6A15B]">
                    Image Gallery & Verification
                  </h3>
                  <span className="text-xs text-slate-400">
                    {formData.images?.length || 0} images assigned
                  </span>
                </div>

                {/* Add Image Inputs */}
                <div className="p-4 rounded-xl bg-[#090A0C] border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Image URL or Asset Path
                      </label>
                      <input
                        type="text"
                        placeholder="https://... or /src/assets/..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#15171B] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        View Angle Label
                      </label>
                      <select
                        value={newImageViewLabel}
                        onChange={(e) => setNewImageViewLabel(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#15171B] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                      >
                        <option value="Front Three-Quarter">Front Three-Quarter</option>
                        <option value="Rear Three-Quarter">Rear Three-Quarter</option>
                        <option value="Side Profile">Side Profile</option>
                        <option value="Interior & Cockpit">Interior & Cockpit</option>
                        <option value="Dashboard & Screen">Dashboard & Screen</option>
                        <option value="Rear Seats">Rear Seats</option>
                        <option value="Engine Bay">Engine Bay</option>
                        <option value="Other">Other View</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="flex-1 py-1.5 px-3 bg-[#C6A15B] text-black font-bold text-xs rounded-lg hover:bg-[#D4B26F] transition-colors"
                      >
                        Add URL
                      </button>

                      <label className="cursor-pointer py-1.5 px-3 bg-[#20242B] hover:bg-[#2A303A] border border-white/10 text-xs text-slate-300 rounded-lg flex items-center gap-1 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Images List */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative rounded-xl overflow-hidden bg-[#090A0C] border border-white/10 aspect-video flex flex-col justify-between"
                      >
                        <img
                          src={img.url}
                          alt={img.altText}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                          <span className="text-[10px] text-white font-medium bg-black/50 px-1.5 py-0.5 rounded self-start">
                            {img.viewLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="p-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded self-end"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No images assigned yet. If left empty, the vehicle card will gracefully display the "Genuine Photos Pending" branded placeholder.
                  </p>
                )}
              </div>

              {/* Description & Features */}
              <div className="p-6 rounded-2xl bg-[#15171B] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6A15B]">
                  Description & Equipment
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Detailed Showroom Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide authentic details regarding vehicle condition, paint history, registration status, and physical location..."
                    className="w-full p-3 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                {/* Features Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Features & Equipment List
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. Adaptive Cruise Control, Sunroof"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-1.5 rounded-lg bg-[#20242B] text-xs font-semibold text-slate-200 hover:bg-[#2A303A]"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formData.features?.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#090A0C] border border-white/10 text-xs text-slate-300"
                      >
                        {f}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Admin Internal Notes (Protected: NEVER shown publicly) */}
                <div className="pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                    <Lock className="w-3 h-3" />
                    <span>Private Admin Notes (Never shown on public site)</span>
                  </div>
                  <input
                    type="text"
                    value={formData.adminNotes}
                    onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                    placeholder="Private purchase cost, seller phone, biometric appointment notes..."
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-amber-500/20 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Status & Featured Checkboxes */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mr-2">Listing Status:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as AvailabilityStatus)}
                      className="px-2.5 py-1 rounded bg-[#090A0C] border border-white/10 text-xs text-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="rounded border-white/20 text-[#C6A15B] focus:ring-[#C6A15B]"
                    />
                    <span>Highlight in Featured Section</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('cars')}
                  className="px-5 py-2.5 rounded-xl bg-[#15171B] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#D4B26F] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(198,161,91,0.3)]"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && businessSettings && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Showroom & WhatsApp Configuration</h2>
              <p className="text-xs text-slate-400">
                Update business hours, telephone numbers, and inquiry recipient details.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#15171B] border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Showroom Name</label>
                  <input
                    type="text"
                    value={businessSettings.showroomName}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, showroomName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={businessSettings.ownerName}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number (International without +)
                  </label>
                  <input
                    type="text"
                    value={businessSettings.whatsappNumber}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, whatsappNumber: e.target.value })}
                    placeholder="923001234567"
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Used for generating instant customer inquiry chat links.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Showroom Phone</label>
                  <input
                    type="text"
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Showroom Email</label>
                  <input
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City, Province</label>
                  <input
                    type="text"
                    value={`${businessSettings.city}, ${businessSettings.province}`}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-[#090A0C]/50 border border-white/10 text-xs text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Showroom Physical Address</label>
                <input
                  type="text"
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps URL</label>
                <input
                  type="url"
                  value={businessSettings.googleMapsUrl}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, googleMapsUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Hours</label>
                <input
                  type="text"
                  value={businessSettings.businessHours}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, businessHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#090A0C] border border-white/10 text-xs text-white"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C6A15B] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#D4B26F] transition-all"
                >
                  Save Business Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#15171B] border border-rose-900/60 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-600/50 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-base">Confirm Vehicle Deletion</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently remove listing <code className="text-rose-300">{deleteConfirmId}</code> from Leghari Motors?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 rounded-lg bg-[#20242B] text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
