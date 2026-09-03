import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [step, setStep] = useState<"role" | "phone" | "otp">("role");
  const [role, setRole] = useState<"renter" | "landlord">("renter");

  return (
    <main className="min-h-screen bg-white px-6 pt-16 pb-8">
      <Link href="/" className="text-slate-400 text-sm mb-6 inline-block">
        ← Back
      </Link>

      {step === "role" && (
        <>
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-slate-500 text-sm mb-8">
            Join thousands in Kaduna finding homes without agent stress.
          </p>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setRole("renter")}
              className={`flex-1 p-5 rounded-2xl border-2 text-center transition-colors ${
                role === "renter" ? "border-blue-500 bg-blue-50" : "border-slate-200"
              }`}
            >
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm font-semibold">I want to Rent</div>
            </button>
            <button
              onClick={() => setRole("landlord")}
              className={`flex-1 p-5 rounded-2xl border-2 text-center transition-colors ${
                role === "landlord" ? "border-blue-500 bg-blue-50" : "border-slate-200"
              }`}
            >
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-sm font-semibold">I have a Property</div>
            </button>
          </div>

          <button
            onClick={() => setStep("phone")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200"
          >
            Continue
          </button>
        </>
      )}

      {step === "phone" && (
        <>
          <h1 className="text-2xl font-bold mb-2">Enter Phone</h1>
          <p className="text-slate-500 text-sm mb-8">We'll send you a verification code.</p>

          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-500 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Amina Ibrahim"
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-medium text-slate-500 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <select className="w-24 p-4 border border-slate-200 rounded-xl outline-none text-sm bg-white">
                <option>+234</option>
              </select>
              <input
                type="tel"
                placeholder="803 123 4567"
                className="flex-1 p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => setStep("otp")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200"
          >
            Send Code
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <h1 className="text-2xl font-bold mb-2">Verify Phone</h1>
          <p className="text-slate-500 text-sm mb-8">
            Enter the 4-digit code sent to <strong>+234 803 123 4567</strong>
          </p>

          <div className="flex gap-3 justify-center mb-8">
            {["5", "2", "8", "9"].map((n, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                defaultValue={n}
                className="w-14 h-16 text-center text-2xl font-bold border border-slate-200 rounded-xl outline-none focus:border-blue-500"
              />
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mb-8">
            Didn't receive? <span className="text-blue-600 font-semibold cursor-pointer">Resend</span>
          </p>

          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 text-center"
          >
            Verify & Continue
          </Link>
        </>
      )}
    </main>
  );
}
