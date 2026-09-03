import { useState } from "react";
import Link from "next/link";

export default function ListProperty() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-white pb-8">
      <div className="px-5 pt-12 pb-5 border-b border-slate-100">
        <Link href="/" className="text-slate-400 text-sm mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">List Your Property</h1>
        <p className="text-sm text-slate-500 mt-1">Reach verified renters in Kaduna</p>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${s <= step ? "bg-blue-500" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-6">
        <h3 className="font-bold text-lg mb-1">Property Details</h3>
        <p className="text-sm text-slate-500 mb-6">Help renters find your property in Kaduna</p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Property Title</label>
            <input
              type="text"
              placeholder="e.g. 3-Bedroom Flat in Barnawa GRA"
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Property Type</label>
            <select className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white">
              <option>Select type...</option>
              <option>Self-Contained (Single Room)</option>
              <option>Mini Flat (1 Bedroom)</option>
              <option>2 Bedroom Flat</option>
              <option>3 Bedroom Flat</option>
              <option>4+ Bedroom</option>
              <option>Duplex</option>
              <option>Bungalow</option>
              <option>Face-Me-I-Face-You</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Area / Zone</label>
            <select className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white">
              <option>Select area...</option>
              <option>Barnawa (GRA)</option>
              <option>Barnawa (Extension)</option>
              <option>Malali</option>
              <option>Ungwan Rimi</option>
              <option>Sabon Tasha</option>
              <option>Kakuri</option>
              <option>Tudun Wada</option>
              <option>Rigasa</option>
              <option>Samaru (ABU Axis)</option>
              <option>Ungwan Mu'azu</option>
              <option>Kawo</option>
              <option>Badiko</option>
              <option>Command Area</option>
              <option>Refinery Road</option>
              <option>Mando</option>
              <option>Gonin Gora</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Annual Rent (₦)</label>
            <input
              type="number"
              placeholder="650,000"
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Street Address</label>
            <input
              type="text"
              placeholder="e.g. GRA Phase 2, Behind St. Gerard's"
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
            <div className="text-4xl mb-2">📷</div>
            <div className="font-medium text-sm">Add Photos</div>
            <div className="text-xs text-slate-500 mt-1">Tap to upload from gallery (min 3 photos)</div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 mt-8">
          Continue to Amenities →
        </button>
      </div>
    </main>
  );
}
