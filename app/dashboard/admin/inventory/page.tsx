'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Plus, Download, ShieldCheck, Cpu, HardDrive, Monitor, Sparkles, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';
import { exportToCSV } from '@/lib/exportUtils';

export default function AdminInventoryPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('COMPUTING');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('150000');

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('/api/inventory');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, []);

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, location, cost })
      });
      if (res.ok) {
        addToast({ title: 'Asset Tagged', message: 'Hardware asset registered with unique barcoded tag.', type: 'success' });
        setModalOpen(false);
        setName('');
        setLocation('');
        // Refresh
        const ref = await fetch('/api/inventory');
        if (ref.ok) {
          const json = await ref.json();
          setData(json.data || json);
        }
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to log asset', type: 'error' });
    }
  };

  const assets = data?.assets || [];
  const metrics = data?.metrics;

  const handleExport = () => {
    exportToCSV(assets, 'Campus_Asset_Inventory_Register');
    addToast({ title: 'Export Generated', message: 'Hardware asset register saved to CSV.', type: 'info' });
  };

  const filtered = assets.filter((a: any) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.assetTag.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <HardDrive className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Asset & Hardware Inventory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Lifecycle tracking for institutional lab hardware, computing racks, AV equipment, and warranty audits</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" /> Export Asset Register
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tag New Asset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Asset Capital Valuation', val: metrics.totalAssetsValuation, sub: 'Hardware & lab infrastructure', color: 'text-blue-600' },
            { label: 'Active Asset Tags', val: metrics.activeItemsCount, sub: 'Across 13 departments', color: 'text-emerald-600' },
            { label: 'Warranty Expiring (Q3)', val: metrics.warrantyExpiringThisQuarter, sub: 'Scheduled for AMC renewal', color: 'text-amber-600' },
            { label: 'In Maintenance / Repair', val: metrics.maintenanceLogged, sub: 'Authorized service center', color: 'text-rose-600' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
              <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
              <p className={cn('text-2xl font-bold mt-1 tracking-tight', kpi.color)}>{kpi.val}</p>
              <p className="text-[11px] text-slate-400 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Assets Register Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Capital Asset Master Inventory</h3>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tag, model, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-slate-900 outline-none flex-1"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Asset Barcode Tag</th>
                <th className="p-3.5">Hardware Item & Model</th>
                <th className="p-3.5">Department Location</th>
                <th className="p-3.5">Book Value (Cost)</th>
                <th className="p-3.5">Warranty Expiry</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((ast: any) => (
                <tr key={ast.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{ast.assetTag}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{ast.name}</td>
                  <td className="p-3.5 text-slate-600">{ast.location}</td>
                  <td className="p-3.5 font-bold text-slate-900">₹{ast.cost.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-slate-600 font-mono">{new Date(ast.warrantyEnd).toLocaleDateString()}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {ast.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Register Institutional Hardware Asset</h3>

            <form onSubmit={handleRegisterAsset} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Equipment / Model Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dell Precision 7920 Workstation" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none">
                    <option value="COMPUTING">Computing / Servers</option>
                    <option value="AV_EQUIPMENT">Projectors & Audio</option>
                    <option value="NETWORKING">Switches & Routers</option>
                    <option value="LAB_HARDWARE">Lab Rig / Instruments</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Acquisition Cost (INR)</label>
                  <input type="number" value={cost} onChange={e => setCost(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Location Room / Lab</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Turing Block • AI Lab 3" className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer">
                Tag & Save to Asset Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
