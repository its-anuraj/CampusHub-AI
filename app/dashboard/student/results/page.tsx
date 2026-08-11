'use client';
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 opacity-50">
          <span className="text-white text-2xl">🚧</span>
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Coming Soon</h2>
        <p className="text-slate-400 text-sm">This module is under active development.<br/>Check back soon!</p>
      </div>
    </div>
  );
}
