import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { handleCustomerAuthCallback } from '../services/shopify/customerAuth.js';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';

export default function AccountAuthorizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useCustomerAuth();
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const executedRef = useRef(false);

  useEffect(() => {
    // Avoid double execution in React 19 StrictMode
    if (executedRef.current) return;
    executedRef.current = true;

    async function processCallback() {
      try {
        const { returnTo } = await handleCustomerAuthCallback(searchParams);
        setStatus('success');
        // Refresh customer profile in context
        await refreshProfile();
        // Redirect to intended account page
        setTimeout(() => {
          navigate(returnTo || '/account', { replace: true });
        }, 600);
      } catch (err) {
        console.error('Customer Account OAuth callback error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    }

    processCallback();
  }, [searchParams, navigate, refreshProfile]);

  return (
    <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 sm:py-24 flex items-center justify-center">
        <div className="w-full bg-white border border-[#D8E8DD] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#EAF7EE] border border-[#0B7A3B]/20 flex items-center justify-center mx-auto shadow-inner">
                <Loader2 className="w-8 h-8 text-[#0B7A3B] animate-spin" />
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-[#10231A] uppercase tracking-wider">
                  Verifying Account
                </h1>
                <p className="text-xs text-[#52645A] leading-relaxed">
                  Completing secure sign-in with Shopify. You will be redirected shortly...
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#EAF7EE] border border-[#0B7A3B]/30 flex items-center justify-center mx-auto text-[#0B7A3B]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-[#0B7A3B] uppercase tracking-wider">
                  Authentication Successful
                </h1>
                <p className="text-xs text-[#52645A]">
                  Loading your SSD Sports dashboard...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
                <AlertCircle className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-[#10231A] uppercase tracking-wider">
                  Authentication Failed
                </h1>
                <p className="text-xs text-red-600 leading-relaxed max-w-sm mx-auto">
                  {errorMessage}
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  to="/account"
                  className="w-full py-3.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0B7A3B]/20"
                >
                  Try Signing In Again
                </Link>
                <Link
                  to="/"
                  className="w-full py-3 bg-[#F5FAF6] hover:bg-[#EAF7EE] text-[#10231A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-[#D8E8DD]"
                >
                  Return to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

