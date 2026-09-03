import React from 'react';

export default function CredentialsNotice() {
  return (
    <div className="max-w-3xl mx-auto my-10 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold">
          !
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Shopify Credentials Required</h2>
          <p className="text-sm text-slate-400">
            Connect your Shopify Admin Storefront API to view live products.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-slate-300">
        <p>
          To connect this React frontend to your Shopify backend, populate the <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-mono border border-slate-800">.env</code> file in your project root with your Shopify credentials:
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto space-y-1">
          <div className="text-slate-500"># .env</div>
          <div><span className="text-indigo-400">VITE_SHOPIFY_STORE_DOMAIN</span>=<span className="text-emerald-400">your-store.myshopify.com</span></div>
          <div><span className="text-indigo-400">VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN</span>=<span className="text-emerald-400">your_public_storefront_access_token</span></div>
        </div>

        <div className="bg-slate-950/60 rounded-lg p-4 border border-slate-800 space-y-2 text-xs">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">How to get Storefront API Access Token:</h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Go to your <strong className="text-slate-200">Shopify Admin</strong> &gt; <strong className="text-slate-200">Settings</strong> &gt; <strong className="text-slate-200">Apps and sales channels</strong>.</li>
            <li>Click <strong className="text-slate-200">Develop apps</strong> and create or open a custom app.</li>
            <li>Under <strong className="text-slate-200">Storefront API Integration</strong>, select product read scopes (<code className="text-slate-300">unauthenticated_read_product_listings</code>).</li>
            <li>Install the app and copy your <strong className="text-slate-200">Storefront API access token</strong> into <code className="text-amber-400">.env</code>.</li>
            <li>Restart the dev server (<code className="text-slate-300">npm run dev</code>).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
