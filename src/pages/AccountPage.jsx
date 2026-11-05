import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Package,
  Calendar,
  CreditCard,
  Truck,
  ExternalLink,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { fetchCustomerOrders } from '../services/shopify/customerApi';

function formatCurrency(amount, currencyCode = 'INR') {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode || 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return `₹${num.toFixed(2)}`;
  }
}

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export default function AccountPage() {
  const {
    customer,
    isAuthenticated,
    loading: authLoading,
    login,
    logout,
    updateProfile,
    addAddress,
    editAddress,
    removeAddress,
    getValidAccessToken,
  } = useCustomerAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Tab navigation: 'overview' | 'orders' | 'addresses' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile edit modal state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    phoneNumber: '',
    isDefault: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState(null);

  // Check URL hash or query to switch tabs (e.g., /account?tab=orders)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'orders', 'addresses', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Load orders when authenticated
  const loadOrders = useCallback(async (afterCursor = null) => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const token = await getValidAccessToken();
      if (!token) return;
      const orderData = await fetchCustomerOrders(token, { first: 10, after: afterCursor });
      if (afterCursor) {
        setOrders((prev) => [...prev, ...(orderData.nodes || [])]);
      } else {
        setOrders(orderData.nodes || []);
      }
      setPageInfo(orderData.pageInfo || {});
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrdersError('Unable to load your orders right now. Please refresh.');
    } finally {
      setOrdersLoading(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

  // Handle profile form open
  const openEditProfile = () => {
    setProfileForm({
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
    });
    setProfileError(null);
    setEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    try {
      await updateProfile(profileForm);
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle address form open
  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      zip: '',
      phoneNumber: customer?.phoneNumber?.phoneNumber || '',
      isDefault: false,
    });
    setAddressError(null);
    setAddressModalOpen(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    const isDefault = customer?.defaultAddress?.id === addr.id;
    setAddressForm({
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      company: addr.company || '',
      address1: addr.address1 || '',
      address2: addr.address2 || '',
      city: addr.city || '',
      province: addr.province || '',
      zip: addr.zip || '',
      phoneNumber: addr.phoneNumber || '',
      isDefault,
    });
    setAddressError(null);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressError(null);
    try {
      const payload = {
        firstName: addressForm.firstName,
        lastName: addressForm.lastName,
        company: addressForm.company,
        address1: addressForm.address1,
        address2: addressForm.address2,
        city: addressForm.city,
        province: addressForm.province,
        zip: addressForm.zip,
        phoneNumber: addressForm.phoneNumber,
      };

      if (editingAddressId) {
        await editAddress(editingAddressId, payload, addressForm.isDefault);
      } else {
        await addAddress(payload, addressForm.isDefault);
      }
      setAddressModalOpen(false);
    } catch (err) {
      setAddressError(err.message || 'Failed to save address.');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    try {
      await removeAddress(id);
    } catch (err) {
      alert(err.message || 'Failed to delete address.');
    }
  };

  // -------------------------------------------------------------
  // VIEW: LOADING AUTH STATE
  // -------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#0B7A3B] animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase tracking-wider text-[#7B8A82]">
              Connecting to Shopify Account...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: UNAUTHENTICATED (LOGIN / REGISTRATION)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
        <Header />

        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-12 sm:py-20 flex items-center justify-center">
          <div className="w-full bg-white border border-[#D8E8DD] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl text-center">
            {/* Header Badge */}
            <div className="space-y-3">
              <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#0B7A3B] bg-[#EAF7EE] border border-[#0B7A3B]/20 px-3 py-1 rounded-full">
                OFFICIAL MEMBER ACCESS
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#10231A] uppercase tracking-wider">
                Customer Account
              </h1>
              <p className="text-[#52645A] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Log in or create an account to view your cricket gear orders, manage delivery addresses, and expedite checkout.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 text-left bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl p-4">
              <div className="space-y-1">
                <Package className="w-4 h-4 text-[#0B7A3B]" />
                <p className="text-[11px] font-bold text-[#10231A] leading-tight">Order Tracking</p>
                <p className="text-[10px] text-[#7B8A82]">Live Shopify status</p>
              </div>
              <div className="space-y-1 border-x border-[#D8E8DD] px-3">
                <MapPin className="w-4 h-4 text-[#0B7A3B]" />
                <p className="text-[11px] font-bold text-[#10231A] leading-tight">Fast Checkout</p>
                <p className="text-[10px] text-[#7B8A82]">Saved addresses</p>
              </div>
              <div className="space-y-1 pl-1">
                <ShieldCheck className="w-4 h-4 text-[#0B7A3B]" />
                <p className="text-[11px] font-bold text-[#10231A] leading-tight">Passwordless</p>
                <p className="text-[10px] text-[#7B8A82]">Instant email code</p>
              </div>
            </div>

            {/* Direct Login Action */}
            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={() => login('/account')}
                className="w-full py-4 px-6 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0B7A3B]/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue with Shopify</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-[#7B8A82] leading-relaxed">
                No password required. Shopify will send a secure 6-digit one-time code to your email address.
              </p>
            </div>

            {/* Guest Checkout Notice */}
            <div className="border-t border-[#D8E8DD] pt-4 text-center">
              <p className="text-xs text-[#52645A]">
                Just browsing? You can always{' '}
                <Link to="/catalog" className="text-[#0B7A3B] font-bold hover:underline">
                  shop as a guest
                </Link>{' '}
                without creating an account.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED CUSTOMER DASHBOARD
  // -------------------------------------------------------------
  const displayName = customer?.displayName || customer?.firstName || 'Valued Athlete';
  const customerEmail = customer?.emailAddress?.emailAddress || '';
  const customerPhone = customer?.phoneNumber?.phoneNumber || '';
  const defaultAddress = customer?.defaultAddress;
  const addressList = customer?.addresses?.nodes || [];

  return (
    <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Top Header / Welcome Banner */}
        <div className="bg-[#F5FAF6] border border-[#D8E8DD] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#0B7A3B] bg-[#EAF7EE] border border-[#0B7A3B]/20 px-2.5 py-0.5 rounded-full">
                VERIFIED MEMBER
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#0B7A3B]" />
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-black text-[#10231A] uppercase tracking-wider">
              Welcome, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[#52645A] font-mono">
              {customerEmail} {customerPhone && `• ${customerPhone}`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-[#D8E8DD] hover:border-red-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#D8E8DD] gap-2 overflow-x-auto pb-px">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'addresses', label: `Addresses (${addressList.length})`, icon: MapPin },
            { id: 'profile', label: 'Profile', icon: Edit2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#0B7A3B] text-[#0B7A3B] bg-[#EAF7EE]/50'
                    : 'border-transparent text-[#7B8A82] hover:text-[#10231A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Recent Orders (Left 8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-black text-[#10231A] uppercase tracking-wider">
                  Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#0B7A3B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All Orders <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {ordersLoading ? (
                <div className="bg-white border border-[#D8E8DD] rounded-2xl p-8 text-center space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0B7A3B] mx-auto" />
                  <p className="text-xs text-[#7B8A82]">Syncing orders with Shopify...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white border border-[#D8E8DD] rounded-2xl p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#EAF7EE] text-[#0B7A3B] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-[#10231A]">No Orders Placed Yet</p>
                    <p className="text-xs text-[#52645A]">
                      Your verified orders will appear here automatically after checkout.
                    </p>
                  </div>
                  <Link
                    to="/catalog"
                    className="inline-block px-5 py-2.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Explore Equipment Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#D8E8DD] rounded-2xl p-5 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8E8DD]/60 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-[#10231A]">
                            {order.name}
                          </span>
                          <span className="text-xs text-[#7B8A82] font-mono">
                            {formatDate(order.processedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                              order.fulfillmentStatus === 'FULFILLED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {order.fulfillmentStatus || 'UNFULFILLED'}
                          </span>
                          <span className="font-mono font-extrabold text-sm text-[#0B7A3B]">
                            {formatCurrency(order.totalPrice?.amount, order.totalPrice?.currencyCode)}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {order.lineItems?.nodes?.slice(0, 3).map((line) => (
                            <div
                              key={line.id}
                              className="w-12 h-12 rounded-lg bg-[#F5FAF6] border border-[#D8E8DD] overflow-hidden flex items-center justify-center p-1 shrink-0"
                              title={line.title}
                            >
                              {line.image?.url ? (
                                <img
                                  src={line.image.url}
                                  alt={line.title}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Package className="w-4 h-4 text-[#7B8A82]" />
                              )}
                            </div>
                          ))}
                          {order.lineItems?.nodes?.length > 3 && (
                            <span className="text-[11px] text-[#7B8A82] font-mono pl-1">
                              +{order.lineItems.nodes.length - 3} more
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs text-[#0B7A3B] font-bold hover:underline shrink-0 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Profile & Default Address (Right 4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Profile Card */}
              <div className="bg-white border border-[#D8E8DD] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D8E8DD] pb-3">
                  <h3 className="font-heading text-sm font-black text-[#10231A] uppercase tracking-wider">
                    Profile Summary
                  </h3>
                  <button
                    onClick={openEditProfile}
                    className="text-xs text-[#0B7A3B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#7B8A82] block text-[11px]">Name</span>
                    <span className="font-bold text-[#10231A]">
                      {customer?.firstName || customer?.lastName
                        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                        : 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7B8A82] block text-[11px]">Email</span>
                    <span className="font-mono text-[#10231A]">{customerEmail}</span>
                  </div>
                  {customerPhone && (
                    <div>
                      <span className="text-[#7B8A82] block text-[11px]">Phone</span>
                      <span className="font-mono text-[#10231A]">{customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Default Address Card */}
              <div className="bg-white border border-[#D8E8DD] rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D8E8DD] pb-3">
                  <h3 className="font-heading text-sm font-black text-[#10231A] uppercase tracking-wider">
                    Primary Address
                  </h3>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className="text-xs text-[#0B7A3B] font-bold hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>

                {defaultAddress ? (
                  <div className="text-xs text-[#52645A] space-y-1">
                    <p className="font-bold text-[#10231A]">
                      {defaultAddress.firstName} {defaultAddress.lastName}
                    </p>
                    {defaultAddress.company && <p>{defaultAddress.company}</p>}
                    <p>{defaultAddress.address1}</p>
                    {defaultAddress.address2 && <p>{defaultAddress.address2}</p>}
                    <p>
                      {defaultAddress.city}, {defaultAddress.province} {defaultAddress.zip}
                    </p>
                    {defaultAddress.phoneNumber && (
                      <p className="font-mono pt-1">{defaultAddress.phoneNumber}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-[#7B8A82]">No default address saved.</p>
                    <button
                      onClick={openAddAddress}
                      className="text-xs text-[#0B7A3B] font-bold hover:underline cursor-pointer"
                    >
                      + Add an address
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-[#10231A] uppercase tracking-wider">
                  Order History
                </h2>
                <p className="text-xs text-[#52645A]">
                  Track fulfillment and view itemized invoices for your past purchases.
                </p>
              </div>
            </div>

            {ordersLoading && orders.length === 0 ? (
              <div className="bg-white border border-[#D8E8DD] rounded-2xl p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#0B7A3B] mx-auto" />
                <p className="text-xs text-[#7B8A82]">Retrieving orders from Shopify...</p>
              </div>
            ) : ordersError ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
                <p className="text-xs text-red-600 font-medium">{ordersError}</p>
                <button
                  onClick={() => loadOrders()}
                  className="px-4 py-2 bg-[#0B7A3B] text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-[#D8E8DD] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#EAF7EE] text-[#0B7A3B] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-black uppercase tracking-wider text-[#10231A]">
                    No Orders Found
                  </h3>
                  <p className="text-xs text-[#52645A] leading-relaxed">
                    You haven't placed any orders with this account yet. Ready to elevate your game?
                  </p>
                </div>
                <Link
                  to="/catalog"
                  className="inline-block px-6 py-3 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Browse Cricket Gear
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#D8E8DD] rounded-2xl p-6 hover:shadow-md transition-all space-y-4"
                  >
                    {/* Order header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8E8DD] pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-base text-[#10231A]">
                            {order.name}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                              order.financialStatus === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {order.financialStatus || 'PAID'}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                              order.fulfillmentStatus === 'FULFILLED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {order.fulfillmentStatus || 'UNFULFILLED'}
                          </span>
                        </div>
                        <p className="text-xs text-[#7B8A82] font-mono">
                          Placed on {formatDate(order.processedAt)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-[#7B8A82] block">Total Amount</span>
                        <span className="text-lg font-black font-mono text-[#0B7A3B]">
                          {formatCurrency(order.totalPrice?.amount, order.totalPrice?.currencyCode)}
                        </span>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div className="divide-y divide-[#D8E8DD]/60">
                      {order.lineItems?.nodes?.map((line) => (
                        <div key={line.id} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#F5FAF6] border border-[#D8E8DD] overflow-hidden p-1 shrink-0 flex items-center justify-center">
                              {line.image?.url ? (
                                <img
                                  src={line.image.url}
                                  alt={line.title}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-[#7B8A82]" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-[#10231A] line-clamp-1">
                                {line.title}
                              </p>
                              <p className="text-[11px] text-[#7B8A82] font-mono">
                                Quantity: {line.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-xs font-bold text-[#10231A]">
                              {formatCurrency(line.totalPrice?.amount, line.totalPrice?.currencyCode)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer Actions */}
                    <div className="border-t border-[#D8E8DD] pt-3 flex justify-between items-center text-xs">
                      {order.shippingAddress && (
                        <p className="text-[11px] text-[#7B8A82] truncate max-w-sm">
                          Ship to: {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                          {order.shippingAddress.zip}
                        </p>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#0B7A3B] font-bold hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <span>Full Breakdown</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {pageInfo.hasNextPage && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => loadOrders(pageInfo.endCursor)}
                      disabled={ordersLoading}
                      className="px-6 py-3 bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#D8E8DD] transition-all cursor-pointer"
                    >
                      {ordersLoading ? 'Loading more...' : 'Load Earlier Orders'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-black text-[#10231A] uppercase tracking-wider">
                  Address Book
                </h2>
                <p className="text-xs text-[#52645A]">
                  Manage your shipping and delivery destinations for quick checkout.
                </p>
              </div>
              <button
                onClick={openAddAddress}
                className="px-4 py-2.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#0B7A3B]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {addressList.length === 0 ? (
              <div className="bg-white border border-[#D8E8DD] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#EAF7EE] text-[#0B7A3B] flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-black uppercase tracking-wider text-[#10231A]">
                    No Addresses Saved
                  </h3>
                  <p className="text-xs text-[#52645A]">
                    Save a delivery address to expedite your orders.
                  </p>
                </div>
                <button
                  onClick={openAddAddress}
                  className="px-5 py-2.5 bg-[#0B7A3B] text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addressList.map((addr) => {
                  const isDefault = defaultAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      className={`bg-white border rounded-2xl p-5 space-y-4 transition-all relative flex flex-col justify-between ${
                        isDefault
                          ? 'border-[#0B7A3B] shadow-md ring-1 ring-[#0B7A3B]/30'
                          : 'border-[#D8E8DD] shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#D8E8DD]/60">
                          <p className="font-bold text-sm text-[#10231A]">
                            {addr.firstName} {addr.lastName}
                          </p>
                          {isDefault && (
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#0B7A3B] border border-[#0B7A3B]/20">
                              Default
                            </span>
                          )}
                        </div>

                        {addr.company && <p className="text-[#7B8A82]">{addr.company}</p>}
                        <p className="text-[#52645A]">{addr.address1}</p>
                        {addr.address2 && <p className="text-[#52645A]">{addr.address2}</p>}
                        <p className="text-[#52645A]">
                          {addr.city}, {addr.province} {addr.zip}
                        </p>
                        {addr.phoneNumber && (
                          <p className="font-mono text-[#7B8A82] pt-1">{addr.phoneNumber}</p>
                        )}
                      </div>

                      <div className="border-t border-[#D8E8DD] pt-3 flex items-center justify-between text-xs">
                        <button
                          onClick={() => openEditAddress(addr)}
                          className="text-[#0B7A3B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-[#10231A] uppercase tracking-wider">
                Personal Profile
              </h2>
              <p className="text-xs text-[#52645A]">
                Manage your identity and authentication credentials stored on Shopify.
              </p>
            </div>

            <div className="bg-white border border-[#D8E8DD] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-4 divide-y divide-[#D8E8DD]/60 text-xs">
                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[#7B8A82] block text-[11px]">First Name</span>
                    <span className="font-bold text-sm text-[#10231A]">
                      {customer?.firstName || '—'}
                    </span>
                  </div>
                  <button
                    onClick={openEditProfile}
                    className="text-[#0B7A3B] font-bold hover:underline text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-[#7B8A82] block text-[11px]">Last Name</span>
                    <span className="font-bold text-sm text-[#10231A]">
                      {customer?.lastName || '—'}
                    </span>
                  </div>
                  <button
                    onClick={openEditProfile}
                    className="text-[#0B7A3B] font-bold hover:underline text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-[#7B8A82] block text-[11px]">Email Address</span>
                    <span className="font-mono text-sm text-[#10231A]">{customerEmail}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#0B7A3B] bg-[#EAF7EE] px-2 py-0.5 rounded border border-[#0B7A3B]/20">
                    Verified
                  </span>
                </div>

                {customerPhone && (
                  <div className="pt-4 flex justify-between items-center">
                    <div>
                      <span className="text-[#7B8A82] block text-[11px]">Phone Number</span>
                      <span className="font-mono text-sm text-[#10231A]">{customerPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white border border-[#D8E8DD] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#D8E8DD] pb-4">
                <div>
                  <h3 className="font-heading text-lg font-black text-[#10231A] uppercase tracking-wider">
                    Order Details {selectedOrder.name}
                  </h3>
                  <p className="text-xs text-[#7B8A82] font-mono">
                    Placed on {formatDate(selectedOrder.processedAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#7B8A82] hover:text-[#10231A] flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#10231A]">
                  Purchased Items ({selectedOrder.lineItems?.nodes?.length || 0})
                </p>
                <div className="divide-y divide-[#D8E8DD]/60">
                  {selectedOrder.lineItems?.nodes?.map((line) => (
                    <div key={line.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F5FAF6] border border-[#D8E8DD] overflow-hidden p-1 shrink-0 flex items-center justify-center">
                          {line.image?.url ? (
                            <img src={line.image.url} alt={line.title} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-4 h-4 text-[#7B8A82]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#10231A] line-clamp-1">{line.title}</p>
                          <p className="text-[11px] text-[#7B8A82] font-mono">Qty: {line.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#10231A]">
                        {formatCurrency(line.totalPrice?.amount, line.totalPrice?.currencyCode)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl p-4 space-y-2 text-xs">
                {selectedOrder.subtotal && (
                  <div className="flex justify-between text-[#52645A]">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatCurrency(selectedOrder.subtotal.amount, selectedOrder.subtotal.currencyCode)}</span>
                  </div>
                )}
                {selectedOrder.totalShipping && (
                  <div className="flex justify-between text-[#52645A]">
                    <span>Shipping</span>
                    <span className="font-mono">{formatCurrency(selectedOrder.totalShipping.amount, selectedOrder.totalShipping.currencyCode)}</span>
                  </div>
                )}
                {selectedOrder.totalTax && (
                  <div className="flex justify-between text-[#52645A]">
                    <span>Taxes</span>
                    <span className="font-mono">{formatCurrency(selectedOrder.totalTax.amount, selectedOrder.totalTax.currencyCode)}</span>
                  </div>
                )}
                <div className="border-t border-[#D8E8DD] pt-2 flex justify-between font-bold text-sm text-[#10231A]">
                  <span>Total</span>
                  <span className="font-mono text-[#0B7A3B]">
                    {formatCurrency(selectedOrder.totalPrice?.amount, selectedOrder.totalPrice?.currencyCode)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="space-y-1 text-xs">
                  <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#10231A]">
                    Shipping Destination
                  </p>
                  <p className="text-[#52645A]">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p className="text-[#52645A]">
                    {selectedOrder.shippingAddress.address1} {selectedOrder.shippingAddress.address2}
                  </p>
                  <p className="text-[#52645A]">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.zip}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white border border-[#D8E8DD] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
              <h3 className="font-heading text-lg font-black text-[#10231A] uppercase tracking-wider border-b border-[#D8E8DD] pb-3">
                Edit Profile Name
              </h3>

              {profileError && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  {profileError}
                </p>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#10231A] block">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-3 text-xs text-[#10231A] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#10231A] block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-3 text-xs text-[#10231A] outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="flex-1 py-3 bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] text-xs font-bold uppercase rounded-xl border border-[#D8E8DD] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex-1 py-3 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT ADDRESS MODAL */}
        {addressModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white border border-[#D8E8DD] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
              <h3 className="font-heading text-lg font-black text-[#10231A] uppercase tracking-wider border-b border-[#D8E8DD] pb-3">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>

              {addressError && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  {addressError}
                </p>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-[11px] text-[#10231A]">First Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.firstName}
                      onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                      className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-[11px] text-[#10231A]">Last Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.lastName}
                      onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                      className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-[11px] text-[#10231A]">Company (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.company}
                    onChange={(e) => setAddressForm({ ...addressForm, company: e.target.value })}
                    className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-[11px] text-[#10231A]">Address Line 1</label>
                  <input
                    type="text"
                    required
                    placeholder="House, street, apartment"
                    value={addressForm.address1}
                    onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                    className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-[11px] text-[#10231A]">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Suite, unit, landmark"
                    value={addressForm.address2}
                    onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                    className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-[11px] text-[#10231A]">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-[11px] text-[#10231A]">State / Province</label>
                    <input
                      type="text"
                      required
                      value={addressForm.province}
                      onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                      className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-[11px] text-[#10231A]">PIN / Zip</label>
                    <input
                      type="text"
                      required
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-[11px] text-[#10231A]">Phone Number</label>
                  <input
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                    className="w-full bg-[#F5FAF6] border border-[#D8E8DD] focus:border-[#0B7A3B] rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="defaultAddressCheckbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 text-[#0B7A3B] rounded border-[#D8E8DD] focus:ring-[#0B7A3B]"
                  />
                  <label htmlFor="defaultAddressCheckbox" className="text-xs text-[#52645A] cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(false)}
                    className="flex-1 py-3 bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] text-xs font-bold uppercase rounded-xl border border-[#D8E8DD] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="flex-1 py-3 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {addressSaving ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
