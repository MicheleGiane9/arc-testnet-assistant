import React from "react";

export default function SendToken() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl">

        <div className="text-7xl mb-6">
          🚧
        </div>

        <h1 className="text-4xl font-black text-white mb-4">
          Send USDC
        </h1>

        <p className="text-2xl font-bold text-yellow-400 mb-6">
          Under Maintenance
        </p>

        <p className="text-slate-400 leading-7 text-lg">
          This feature is temporarily unavailable while improvements
          and fixes are being implemented.
        </p>

        <div className="mt-8 text-sm text-slate-500">
          Please check back later.
        </div>

      </div>
    </div>
  );
}