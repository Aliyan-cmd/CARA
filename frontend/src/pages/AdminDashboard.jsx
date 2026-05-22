import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, ShoppingBag, Package, Users, DollarSign, 
  AlertTriangle, Plus, Edit3, Trash2, Search, MapPin, 
  Calendar, CheckCircle2, Clock, Truck, XCircle, ChevronDown, 
  ChevronUp, Eye, EyeOff, Loader2 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for data
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Form states for Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: '',
    is_featured: false
  });

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      
      // 2. Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.data || []);

      if (statsData.message === 'success') {
        setStats(statsData.data);
      } else {
        throw new Error(statsData.error || 'Failed to fetch statistics');
      }

      // 3. Fetch orders
      const ordersRes = await fetch('/api/admin/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.message === 'success') {
        setOrders(ordersData.data || []);
      }

      // 4. Fetch products
      const productsRes = await fetch('/api/admin/products');
      const productsData = await productsRes.json();
      if (productsData.message === 'success') {
        setProducts(productsData.data || []);
      }

      // 5. Fetch users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      if (usersData.message === 'success') {
        setUsers(usersData.data || []);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Order Status Updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.message === 'success') {
        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        if (statsData.message === 'success') {
          setStats(statsData.data);
        }
      } else {
        alert('Failed to update status: ' + data.error);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setModalMode('add');
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      is_featured: false
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock_quantity: product.stock_quantity || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_featured: product.is_featured === 1 || product.is_featured === true
    });
    setShowProductModal(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock_quantity: parseInt(productForm.stock_quantity, 10),
      category_id: parseInt(productForm.category_id, 10)
    };

    const url = modalMode === 'add' ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.message === 'success') {
        setShowProductModal(false);
        // Refresh products and stats
        const productsRes = await fetch('/api/admin/products');
        const productsData = await productsRes.json();
        if (productsData.message === 'success') {
          setProducts(productsData.data || []);
        }
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        if (statsData.message === 'success') {
          setStats(statsData.data);
        }
      } else {
        alert('Operation failed: ' + data.error);
      }
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.message === 'success') {
        setProducts(prev => prev.filter(p => p.id !== productId));
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        if (statsData.message === 'success') {
          setStats(statsData.data);
        }
      } else {
        alert('Failed to delete product: ' + data.error);
      }
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleOrderAccordion = (orderId) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  // Filter computations
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(orderSearch) ||
      order.user.username.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.user.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(orderSearch.toLowerCase()));
    
    const matchesStatus = orderFilter === 'all' || order.status === orderFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(productSearch.toLowerCase()));
    
    const matchesCategory = productFilter === 'all' || product.category_id.toString() === productFilter;
    return matchesSearch && matchesCategory;
  });

  // Helpers for display badges
  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'uppercase'
    };

    switch(status) {
      case 'delivered':
        return { ...base, backgroundColor: 'rgba(46, 125, 50, 0.15)', color: '#4caf50', border: '1px solid rgba(76, 175, 80, 0.3)' };
      case 'shipped':
        return { ...base, backgroundColor: 'rgba(2, 136, 209, 0.15)', color: '#03a9f4', border: '1px solid rgba(3, 169, 244, 0.3)' };
      case 'pending':
        return { ...base, backgroundColor: 'rgba(239, 108, 0, 0.15)', color: '#ff9800', border: '1px solid rgba(255, 152, 0, 0.3)' };
      case 'cancelled':
        return { ...base, backgroundColor: 'rgba(198, 40, 40, 0.15)', color: '#f44336', border: '1px solid rgba(244, 67, 54, 0.3)' };
      default:
        return base;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle2 size={12} />;
      case 'shipped': return <Truck size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default: return null;
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: '1rem', paddingTop: '150px' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '1px' }}>Loading Admin Console...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '180px', paddingBottom: '100px', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
          <AlertTriangle size={48} style={{ color: '#f44336', marginBottom: '1.5rem' }} />
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>Initialization Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardData}>Retry Authentication & Load</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 1) 90.2%)' }}>
      <div className="container">
        
        {/* Header Section */}
        <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 'normal', fontFamily: 'Playfair Display, serif', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <BarChart3 style={{ color: 'var(--primary)' }} /> CARA Admin Portal
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time shop intelligence and command center.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={fetchDashboardData}>
              Refresh Data
            </button>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={handleOpenAddProduct}>
              <Plus size={16} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} /> Add Product
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
            { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag size={16} /> },
            { id: 'products', label: `Products (${products.length})`, icon: <Package size={16} /> },
            { id: 'customers', label: `Customers (${users.filter(u => u.role === 'customer').length})`, icon: <Users size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--glass)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                padding: '1rem 1.8rem',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'var(--transition)',
                borderRadius: '8px 8px 0 0'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && stats && (
          <div className="fade-in">
            {/* Stats Summary Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              
              <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)', position: 'relative', overflow: 'hidden' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--text-light)' }}>{formatPrice(stats.totalRevenue)}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#4caf50', display: 'block', marginTop: '0.2rem' }}>All-time sales</span>
                </div>
                <div style={{ background: 'rgba(201, 166, 107, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                  <DollarSign size={28} />
                </div>
              </div>

              <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--text-light)' }}>{stats.totalOrders}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'block', marginTop: '0.2rem' }}>
                    {orders.filter(o => o.status === 'pending').length} pending checkout
                  </span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-light)', padding: '1rem', borderRadius: '12px' }}>
                  <ShoppingBag size={28} />
                </div>
              </div>

              <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Customers</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--text-light)' }}>{stats.totalCustomers}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#03a9f4', display: 'block', marginTop: '0.2rem' }}>Unique registered shoppers</span>
                </div>
                <div style={{ background: 'rgba(3, 169, 244, 0.1)', color: '#03a9f4', padding: '1rem', borderRadius: '12px' }}>
                  <Users size={28} />
                </div>
              </div>

              <div className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'var(--transition)', border: stats.lowStock > 0 ? '1px solid rgba(255, 152, 0, 0.3)' : '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Low Stock Alert</p>
                  <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', fontWeight: 'bold', color: stats.lowStock > 0 ? '#ff9800' : 'var(--text-light)' }}>{stats.lowStock}</h3>
                  <span style={{ fontSize: '0.75rem', color: stats.lowStock > 0 ? '#ff9800' : 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                    {stats.lowStock > 0 ? 'Action required immediately' : 'Inventory healthy'}
                  </span>
                </div>
                <div style={{ background: stats.lowStock > 0 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: stats.lowStock > 0 ? '#ff9800' : 'var(--text-muted)', padding: '1rem', borderRadius: '12px' }}>
                  <AlertTriangle size={28} />
                </div>
              </div>

            </div>

            {/* Graphs and Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              
              {/* Sales Trend SVG Chart */}
              <div className="glass" style={{ padding: '2rem' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-light)' }}>Sales Performance Trend</h4>
                {stats.salesTrend && stats.salesTrend.length > 0 ? (
                  <div style={{ width: '100%', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* SVG Line Chart */}
                    <svg viewBox="0 0 500 180" style={{ width: '100%', height: '180px', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                      
                      {/* Plot path */}
                      {(() => {
                        const maxVal = Math.max(...stats.salesTrend.map(d => d.revenue || 0), 100);
                        const points = stats.salesTrend.map((d, index) => {
                          const x = (index / Math.max(stats.salesTrend.length - 1, 1)) * 500;
                          // Invert Y: Y=150 is base, Y=10 is peak
                          const y = 150 - ((d.revenue || 0) / maxVal) * 130;
                          return `${x},${y}`;
                        });
                        
                        const pathD = `M ${points.join(' L ')}`;
                        const areaD = `${pathD} L 500,150 L 0,150 Z`;

                        return (
                          <>
                            {/* Area fill */}
                            <path d={areaD} fill="url(#chartGrad)" />
                            {/* Line path */}
                            <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
                            {/* Point circles */}
                            {stats.salesTrend.map((d, index) => {
                              const x = (index / Math.max(stats.salesTrend.length - 1, 1)) * 500;
                              const y = 150 - ((d.revenue || 0) / maxVal) * 130;
                              return (
                                <g key={index} style={{ cursor: 'pointer' }}>
                                  <circle cx={x} cy={y} r="5" fill="var(--secondary)" stroke="var(--primary)" strokeWidth="2" />
                                  <title>{`${d.date}: ${formatPrice(d.revenue)} (${d.count} orders)`}</title>
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                    {/* X-Axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '10px' }}>
                      {stats.salesTrend.map((d, i) => {
                        // Display every alternate or first/last label
                        if (i === 0 || i === stats.salesTrend.length - 1 || stats.salesTrend.length < 5) {
                          // Format YYYY-MM-DD to short form
                          const dateObj = new Date(d.date);
                          return <span key={i}>{dateObj.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No recent transaction trends found.</p>
                )}
              </div>

              {/* Category Breakdown Graph */}
              <div className="glass" style={{ padding: '2rem' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-light)' }}>Revenue Share by Department</h4>
                {stats.categorySales && stats.categorySales.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'center', height: '180px' }}>
                    {stats.categorySales.map((cat, i) => {
                      const totalVal = stats.categorySales.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;
                      const percentage = ((cat.value || 0) / totalVal) * 100;
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: '500' }}>{cat.category}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{formatPrice(cat.value)} ({percentage.toFixed(0)}%)</span>
                          </div>
                          {/* Progress bar container */}
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No category sales data recorded.</p>
                )}
              </div>

            </div>

            {/* Critical Low Stock Warning list */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', marginBottom: '1.2rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} style={{ color: '#ff9800' }} /> Inventory Stock Warnings
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {products.filter(p => p.stock_quantity < 15).length > 0 ? (
                  products.filter(p => p.stock_quantity < 15).map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.1)' }}>
                      <img src={p.image_url} alt={p.name} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ fontSize: '0.85rem', fontWeight: '600', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.name}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Category: {p.category_name}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 'bold', 
                          color: p.stock_quantity === 0 ? '#f44336' : '#ff9800', 
                          background: p.stock_quantity === 0 ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)', 
                          padding: '2px 8px', 
                          borderRadius: '4px' 
                        }}>
                          {p.stock_quantity} left
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: 'span 3', padding: '1rem 0' }}>All catalog items are sufficiently stocked.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="fade-in">
            {/* Search and Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search by Order ID, Customer name or Shipping city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '25px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    outline: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="glass" style={{ overflowX: 'auto', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1.2rem' }}>Order ID</th>
                    <th style={{ padding: '1.2rem' }}>Customer</th>
                    <th style={{ padding: '1.2rem' }}>Date</th>
                    <th style={{ padding: '1.2rem' }}>Total</th>
                    <th style={{ padding: '1.2rem' }}>Status</th>
                    <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => {
                      const isExpanded = expandedOrder === order.id;
                      const orderDate = new Date(order.created_at);
                      
                      return (
                        <React.Fragment key={order.id}>
                          {/* Row Summary */}
                          <tr style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.03)', 
                            background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                          }} onClick={() => toggleOrderAccordion(order.id)}>
                            <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>#{order.id}</td>
                            <td style={{ padding: '1.2rem' }}>
                              <div style={{ fontWeight: '500' }}>{order.user.username}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user.email}</div>
                            </td>
                            <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} />
                                {orderDate.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}
                              </span>
                            </td>
                            <td style={{ padding: '1.2rem', fontWeight: '600' }}>{formatPrice(order.total_price)}</td>
                            <td style={{ padding: '1.2rem' }}>
                              <span style={getStatusBadgeStyle(order.status)}>
                                {getStatusIcon(order.status)} {order.status}
                              </span>
                            </td>
                            <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                              <button 
                                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
                                onClick={(e) => { e.stopPropagation(); toggleOrderAccordion(order.id); }}
                              >
                                {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </td>
                          </tr>
                          
                          {/* Accordion Detail Panel */}
                          {isExpanded && (
                            <tr>
                              <td colSpan="6" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                                  
                                  {/* Purchased Items List */}
                                  <div>
                                    <h5 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Line Items</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                      {order.items && order.items.length > 0 ? (
                                        order.items.map((item, idx) => (
                                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', gap: '15px', padding: '0.6rem 0', borderBottom: idx !== order.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                                            <img src={item.image_url} alt={item.product_name} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.product_name}</span>
                                            </div>
                                            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                                              <span style={{ color: 'var(--text-muted)' }}>{item.quantity} x {formatPrice(item.price_at_purchase)}</span>
                                              <div style={{ fontWeight: '600', marginTop: '2px' }}>{formatPrice(item.quantity * item.price_at_purchase)}</div>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No item details stored.</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Shipping and Fulfillment Control */}
                                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '2rem' }}>
                                    <h5 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Fulfillment</h5>
                                    
                                    <div style={{ marginBottom: '1.2rem' }}>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Shipping Destination</span>
                                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                        <MapPin size={14} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                                        {order.shipping_address || 'No shipping address provided.'}
                                      </p>
                                    </div>

                                    <div>
                                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>Fulfillment Control</label>
                                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                          value={order.status}
                                          disabled={actionLoading}
                                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                          style={{
                                            flex: 1,
                                            background: 'var(--secondary)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '6px',
                                            color: 'white',
                                            padding: '0.5rem 0.8rem',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                          }}
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="shipped">Shipped</option>
                                          <option value="delivered">Delivered</option>
                                          <option value="cancelled">Cancelled</option>
                                        </select>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No matching customer orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="fade-in">
            {/* Search, Filter, and Trigger Add */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search catalog by name or description..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.5rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '25px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Category:</span>
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    style={{
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '20px',
                      color: 'white',
                      padding: '0.6rem 1.2rem',
                      outline: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="all">All Departments</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }} onClick={handleOpenAddProduct}>
                  <Plus size={16} style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline' }} /> Create New
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="glass" style={{ overflowX: 'auto', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1.2rem' }}>Item</th>
                    <th style={{ padding: '1.2rem' }}>Category</th>
                    <th style={{ padding: '1.2rem' }}>Price</th>
                    <th style={{ padding: '1.2rem' }}>Stock Level</th>
                    <th style={{ padding: '1.2rem' }}>Status</th>
                    <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => {
                      const isLowStock = product.stock_quantity < 15;
                      const isOutOfStock = product.stock_quantity === 0;
                      
                      return (
                        <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--text-light)' }}>{product.name}</div>
                              {product.is_featured === 1 && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(201, 166, 107, 0.15)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px', fontWeight: 'bold' }}>FEATURED</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{product.category_name}</td>
                          <td style={{ padding: '1rem', fontWeight: '600' }}>{formatPrice(product.price)}</td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* Stock Bar */}
                              <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ 
                                  width: `${Math.min((product.stock_quantity / 100) * 100, 100)}%`, 
                                  height: '100%', 
                                  background: isOutOfStock ? '#f44336' : isLowStock ? '#ff9800' : '#4caf50' 
                                }}></div>
                              </div>
                              <span style={{ fontSize: '0.8rem', fontWeight: '500', color: isOutOfStock ? '#f44336' : isLowStock ? '#ff9800' : 'var(--text-muted)' }}>
                                {product.stock_quantity} units
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {isOutOfStock ? (
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#f44336', background: 'rgba(244, 67, 54, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>OUT OF STOCK</span>
                            ) : isLowStock ? (
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ff9800', background: 'rgba(255, 152, 0, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>LOW STOCK</span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4caf50', background: 'rgba(76, 175, 80, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>AVAILABLE</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleOpenEditProduct(product)}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-light)', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                style={{ background: 'rgba(244, 67, 54, 0.05)', border: '1px solid rgba(244, 67, 54, 0.2)', color: '#f44336', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products match filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- CUSTOMERS TAB --- */}
        {activeTab === 'customers' && (
          <div className="fade-in">
            {/* Customers table */}
            <div className="glass" style={{ overflowX: 'auto', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1.2rem' }}>Customer Details</th>
                    <th style={{ padding: '1.2rem' }}>Location</th>
                    <th style={{ padding: '1.2rem' }}>Registration Date</th>
                    <th style={{ padding: '1.2rem' }}>Security Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.role === 'admin' ? 'rgba(201, 166, 107, 0.2)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem', border: u.role === 'admin' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>
                              {u.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600' }}>{u.username}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} style={{ color: 'var(--primary)' }} />
                            {u.location || 'Not Specified'}
                          </span>
                        </td>
                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(u.created_at).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}
                        </td>
                        <td style={{ padding: '1.2rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: u.role === 'admin' ? 'rgba(201, 166, 107, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                            border: u.role === 'admin' ? '1px solid rgba(201,166,107,0.3)' : '1px solid rgba(255,255,255,0.05)',
                            textTransform: 'uppercase'
                          }}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No customers registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* --- ADD / EDIT PRODUCT DIALOG MODAL --- */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div className="glass fade-in" style={{
            width: '100%',
            maxWidth: '550px',
            background: 'var(--secondary)',
            border: '1px solid var(--glass-border)',
            padding: '2.5rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '1.8rem', 
              marginBottom: '1.5rem', 
              color: 'var(--primary)',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '10px'
            }}>
              {modalMode === 'add' ? 'Create New Catalog Item' : 'Modify Product Specifications'}
            </h3>
            
            <form onSubmit={handleProductFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Linen Tuxedo"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="89.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Initial Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="50"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Department / Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      background: 'var(--bg-dark)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      color: 'white',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image_url}
                  onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Product Description</label>
                <textarea
                  rows="3"
                  placeholder="Summarize the fit, fabric composition, and sizing information..."
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    color: 'white',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={productForm.is_featured}
                  onChange={(e) => setProductForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label htmlFor="is_featured" style={{ fontSize: '0.85rem', color: 'var(--text-light)', cursor: 'pointer' }}>
                  Feature this product on homepage catalog
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  disabled={actionLoading}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '4px',
                    background: 'transparent',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '4px',
                    background: 'var(--primary)',
                    border: 'none',
                    color: 'var(--secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  {modalMode === 'add' ? 'Publish Item' : 'Update Catalog'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
