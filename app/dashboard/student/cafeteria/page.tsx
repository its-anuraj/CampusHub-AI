'use client';

import { useState, useEffect } from 'react';
import { Utensils, ShoppingBag, Clock, Sparkles, CheckCircle2, Flame, Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentCafeteriaPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/cafeteria');
        if (res.ok) {
          const json = await res.json();
          setItems(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = items.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const totalCalories = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = items.find(i => i.id === id);
    return sum + (item ? item.calories * qty : 0);
  }, 0);

  const handleCheckout = async () => {
    if (totalCartCount === 0) return;
    try {
      const res = await fetch('/api/cafeteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount,
          studentName: 'Alex Kumar'
        })
      });
      if (res.ok) {
        const json = await res.json();
        setOrderConfirmed(json.data || json);
        setCart({});
        addToast({
          title: 'Order Dispatched to Kitchen! 🥪',
          message: `Token #${json.data?.token || 'CHUB-MEAL-412'} generated. Ready in 12 mins.`,
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to place meal order', type: 'error' });
    }
  };

  const filtered = items.filter(i => selectedCategory === 'ALL' || i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 shadow-xs">
              <Utensils className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Cafeteria & Pre-Ordering</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Skip dining hall queues, monitor nutrition & calories, and pre-order hot meals</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Kitchens Live & Open
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Stalls' },
          { id: 'BREAKFAST', label: 'Breakfast & South Corner' },
          { id: 'LUNCH', label: 'Lunch Meals & Thalis' },
          { id: 'SNACKS', label: 'Evening Snacks' },
          { id: 'BEVERAGES', label: 'Coffee & Juices' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              selectedCategory === cat.id ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Items Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card flex flex-col justify-between hover:border-orange-300 transition-all">
              <div className="h-36 bg-slate-900 relative overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5">
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-md text-white uppercase',
                    item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                  )}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                  <span className="font-bold text-slate-900 text-sm">₹{item.price}</span>
                </div>
                <p className="text-[11px] text-slate-500">{item.stall}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>{item.calories} kcal</span>
                </div>

                <div className="pt-2">
                  {cart[item.id] ? (
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-1 text-xs">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-lg bg-white text-orange-700 shadow-xs cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="font-bold text-orange-900">{cart[item.id]}</span>
                      <button onClick={() => addToCart(item.id)} className="p-1 rounded-lg bg-orange-600 text-white shadow-xs cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Meal Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Cart Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-600" /> Meal Order Tray ({totalCartCount})
            </h3>

            {totalCartCount === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Your tray is empty. Add fresh items from the menu!</p>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="divide-y divide-slate-100 space-y-2">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = items.find(i => i.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="pt-2 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-400">₹{item.price} × {qty}</p>
                        </div>
                        <span className="font-bold text-slate-900">₹{item.price * qty}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-between text-xs text-orange-900">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-600" /> Nutrition Count:</span>
                  <span className="font-bold">{totalCalories} kcal</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-base text-orange-600">₹{totalAmount}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Pay & Generate Kitchen Token
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Token Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Meal Order Placed!</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-xs text-slate-500">Your Cafeteria Pickup Token</p>
              <p className="text-2xl font-mono font-bold text-orange-600">{orderConfirmed.token}</p>
              <p className="text-[11px] text-slate-500">Estimated Prep Time: ~{orderConfirmed.pickupEstimatedMinutes} Minutes</p>
            </div>
            <button
              onClick={() => setOrderConfirmed(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
