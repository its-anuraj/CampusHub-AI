'use client';

import { useState, useEffect } from 'react';
import {
  Utensils,
  ShoppingBag,
  Clock,
  Sparkles,
  CheckCircle2,
  Flame,
  Plus,
  Minus,
  X,
  Star,
  Activity,
  Heart,
  Award,
  Send,
  QrCode,
  Ticket,
  Timer,
  Bell,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentCafeteriaPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'HIGH_PROTEIN'>('ALL');
  const [pickupSlot, setPickupSlot] = useState('1:15 PM (In 15 Mins)');
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [messRating, setMessRating] = useState(5);
  const [messFeedback, setMessFeedback] = useState('');
  const [currentServingToken, setCurrentServingToken] = useState(408);

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

  const handleSubmitMessFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Mess Feedback Recorded',
      message: 'Thank you! Your hygiene & taste rating was submitted to the Campus Mess Committee.',
      type: 'success'
    });
    setFeedbackModal(false);
    setMessFeedback('');
  };

  const filtered = items.filter(i => selectedCategory === 'ALL' || i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5 text-yellow-300" /> Smart Dining & Nutrition Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Smart Cafeteria & Daily Mess Hub</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Skip dining queues with instant meal pre-orders, monitor calorie intake with macro breakdown, and submit live food hygiene feedback.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Calorie & Nutrition Goal Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Cart Energy Intake</p>
          <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> {totalCalories} kcal
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Daily Target Goal</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5" /> 2,200 kcal
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Kitchen Live Status</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> All 4 Stalls Open
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-center">
          <button
            onClick={() => setFeedbackModal(true)}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 flex items-center justify-center gap-1.5 transition"
          >
            <Star className="w-3.5 h-3.5" /> Rate Mess Food
          </button>
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
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs",
              selectedCategory === cat.id
                ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
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
            <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-orange-500/50 transition">
              <div className="h-40 bg-muted relative overflow-hidden">
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
                  <h4 className="text-sm font-bold text-foreground leading-snug">{item.name}</h4>
                  <span className="text-sm font-bold text-orange-600 font-mono">₹{item.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.stall}</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> {item.calories} kcal</span>
                </div>
              </div>

              <div className="p-4 pt-0">
                {cart[item.id] ? (
                  <div className="flex items-center justify-between bg-muted rounded-xl p-1">
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg bg-card text-foreground hover:bg-background">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold font-mono text-foreground">{cart[item.id]}</span>
                    <button onClick={() => addToCart(item.id)} className="p-1.5 rounded-lg bg-card text-foreground hover:bg-background">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Live Cart */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" /> My Pre-Order Tray
            </h3>

            {totalCartCount === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Utensils className="w-6 h-6 mx-auto mb-2 opacity-30" />
                Your tray is empty. Add items from the menu.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="divide-y divide-border/60 max-h-56 overflow-y-auto">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = items.find(i => i.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">₹{item.price} × {qty}</p>
                        </div>
                        <span className="font-mono font-bold text-foreground">₹{item.price * qty}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Energy</span>
                    <span className="font-semibold text-orange-600 font-mono">{totalCalories} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground">
                    <span>Grand Total</span>
                    <span className="font-mono text-base text-orange-600">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Pickup Time Slot Selection */}
                <div className="space-y-1 pt-2 border-t border-border">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                    <Timer className="w-3 h-3 text-orange-500" /> Express Pickup Time
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full p-2 text-xs bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="1:15 PM (In 15 Mins)">1:15 PM (In 15 Mins)</option>
                    <option value="1:30 PM (In 30 Mins)">1:30 PM (In 30 Mins)</option>
                    <option value="1:45 PM (In 45 Mins)">1:45 PM (In 45 Mins)</option>
                    <option value="2:00 PM (In 60 Mins)">2:00 PM (In 60 Mins)</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
                >
                  Pay & Generate QR Meal Token (₹{totalAmount})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Digital Meal Coupon Pass Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                VERIFIED CAFETERIA MEAL PASS
              </span>
              <h3 className="font-bold text-lg text-foreground mt-2">Token #{orderConfirmed.token || 'CHUB-MEAL-412'}</h3>
              <p className="text-xs text-muted-foreground">Pickup: <strong className="text-foreground">{pickupSlot}</strong></p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <QrCode className="w-40 h-40 text-slate-900 mx-auto" />
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-muted/40 p-3 rounded-xl border border-border">
              <p>Stall: <strong className="text-foreground">Express Counter 2</strong></p>
              <p>Amount Paid: <strong className="text-orange-600 font-mono">₹{totalAmount || 180}</strong></p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">Show this QR pass at the kitchen counter for instant tray collection.</p>
            </div>

            <button
              onClick={() => setOrderConfirmed(null)}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition"
            >
              Done & Collect Tray
            </button>
          </div>
        </div>
      )}

      {/* Mess Rating Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">Daily Mess & Food Feedback</h3>
              <button onClick={() => setFeedbackModal(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitMessFeedback} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Hygiene & Taste Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMessRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7",
                          star <= messRating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Feedback / Suggestions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share feedback on meal warmth, cleanliness, menu items..."
                  value={messFeedback}
                  onChange={(e) => setMessFeedback(e.target.value)}
                  className="w-full p-3 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
