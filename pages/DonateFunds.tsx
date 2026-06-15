import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface DonateFundsProps {
  onNavigate?: (page: string, params?: any) => void;
}

interface NgoOption {
  id: string;
  organization_name: string;
  location?: string;
  focus?: string;
}

interface Receipt {
  receiptId: string;
  ngoName: string;
  ngoLocation: string;
  amount: number;
  commission: number;
  ngoReceives: number;
  donorName: string;
  paymentMethod: string;
  note: string;
  paidAt: string;
}

const FALLBACK_NGOS: NgoOption[] = [
  { id: 'ngo-1', organization_name: 'Hope Harbor Foundation', location: 'Hyderabad', focus: 'Child welfare' },
  { id: 'ngo-2', organization_name: 'GreenRoots Community Trust', location: 'Bengaluru', focus: 'Food support' },
  { id: 'ngo-3', organization_name: 'CareBridge Relief Network', location: 'Mumbai', focus: 'Emergency response' },
  { id: 'ngo-4', organization_name: 'Sunrise Shelter Initiative', location: 'Chennai', focus: 'Women and family support' },
];

const DonateFunds: React.FC<DonateFundsProps> = ({ onNavigate }) => {
  const [ngos, setNgos] = useState<NgoOption[]>(FALLBACK_NGOS);
  const [ngoSearch, setNgoSearch] = useState('');
  const [manualNgoName, setManualNgoName] = useState('');
  const [selectedNgoId, setSelectedNgoId] = useState<string>('');
  const [manualNgoLocation, setManualNgoLocation] = useState('');
  const [useManualNgoEntry, setUseManualNgoEntry] = useState(false);
  const [amount, setAmount] = useState('2500');
  const [customAmountEnabled, setCustomAmountEnabled] = useState(false);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [confirmManualNgo, setConfirmManualNgo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const { data, error: ngoError } = await supabase
          .from('profiles')
          .select('id, organization_name, location')
          .eq('role', 'NGO')
          .in('verification_status', ['APPROVED', 'VERIFIED'])
          .limit(12);

        if (ngoError || !data?.length) {
          return;
        }

        setNgos(
          data
            .filter((ngo: any) => ngo.organization_name)
            .map((ngo: any) => ({
              id: ngo.id,
              organization_name: ngo.organization_name,
              location: ngo.location,
            }))
        );
      } catch (fetchError) {
        console.error('Unable to fetch NGOs for fund donations:', fetchError);
      }
    };

    fetchNgos();
  }, []);

  const filteredNgos = useMemo(() => {
    const query = ngoSearch.trim().toLowerCase();
    if (!query) return ngos;
    return ngos.filter((ngo) => {
      const haystack = `${ngo.organization_name} ${ngo.location || ''} ${ngo.focus || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [ngos, ngoSearch]);

  const selectedNgo = ngos.find((ngo) => ngo.id === selectedNgoId);
  const resolvedNgoName = selectedNgo?.organization_name || (useManualNgoEntry ? manualNgoName.trim() : '');
  const resolvedNgoLocation = selectedNgo?.location || (useManualNgoEntry ? manualNgoLocation.trim() : '');
  const numericAmount = Number(amount);
  const commission = Number.isFinite(numericAmount) && numericAmount > 0 ? Math.round(numericAmount * 0.05) : 0;
  const ngoReceives = Number.isFinite(numericAmount) && numericAmount > 0 ? numericAmount - commission : 0;
  const hasTypedSearch = ngoSearch.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resolvedNgoName) {
      setError('Please select an NGO or type the NGO name you want to support.');
      return;
    }

    if (!selectedNgo && useManualNgoEntry && !resolvedNgoLocation) {
      setError('Please enter the NGO location for a manually typed NGO name.');
      return;
    }

    if (!selectedNgo && useManualNgoEntry && !confirmManualNgo) {
      setError('Please confirm that the manually entered NGO name is correct before payment.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 100) {
      setError('Please enter an amount of at least Rs. 100.');
      return;
    }

    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1300));

      const nextReceipt: Receipt = {
        receiptId: `HC-${Date.now().toString().slice(-8)}`,
        ngoName: resolvedNgoName,
        ngoLocation: resolvedNgoLocation || 'Location provided manually',
        amount: numericAmount,
        commission,
        ngoReceives,
        donorName: 'HopeCycle Donor',
        paymentMethod,
        note: note.trim(),
        paidAt: new Date().toISOString(),
      };

      setReceipt(nextReceipt);
      setAmount('2500');
      setCustomAmountEnabled(false);
      setNote('');
      setConfirmManualNgo(false);
    } catch (paymentError) {
      console.error('Fund donation payment failed:', paymentError);
      setError('We could not complete the payment right now. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.28),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_32%)]"></div>
        <div className="relative grid gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              <span className="material-symbols-outlined text-base">payments</span>
              Support NGOs directly
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Fund an NGO and generate a receipt instantly.</h1>
              <p className="max-w-2xl text-sm font-medium leading-7 text-white/70 sm:text-base">
                Pick a verified NGO, enter the amount you want to donate, complete the payment flow, and keep a clean receipt inside HopeCycle.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('fund-donation-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-primary-deep transition-all hover:brightness-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                Donate now
              </button>
              <button
                onClick={() => onNavigate?.('landing')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">west</span>
                Back home
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { label: 'Minimum donation', value: 'Rs. 100', icon: 'currency_rupee' },
              { label: 'Receipt delivery', value: 'Instant', icon: 'receipt_long' },
              { label: 'Payment methods', value: 'UPI, Card, Net Banking', icon: 'account_balance_wallet' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-white/10 text-primary">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">{item.label}</p>
                <p className="mt-2 text-lg font-black tracking-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section id="fund-donation-form" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-brand-surface-dark lg:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-brand-text dark:text-white">Donation checkout</h2>
              <p className="mt-2 text-sm font-medium text-brand-muted dark:text-slate-400">
                You can choose from the NGO list below or type the NGO name manually.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-bold text-red-500">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Choose NGO</label>
                <span className="text-[11px] font-bold text-slate-400">{ngos.length} options available</span>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Search and type NGO name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input
                    type="text"
                    value={ngoSearch}
                    onChange={(e) => {
                      setNgoSearch(e.target.value);
                      setSelectedNgoId('');
                      setError(null);
                    }}
                    placeholder="Type NGO name, location, or type"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-brand-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white"
                  />
                </div>
                {filteredNgos.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/30">
                    <div className="max-h-56 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                      {filteredNgos.slice(0, 8).map((ngo) => {
                        const isSelected = selectedNgoId === ngo.id;
                        return (
                          <button
                            key={ngo.id}
                            type="button"
                            onClick={() => {
                              setSelectedNgoId(ngo.id);
                              setNgoSearch(ngo.organization_name);
                              setUseManualNgoEntry(false);
                              setManualNgoName('');
                              setManualNgoLocation('');
                              setConfirmManualNgo(false);
                              setError(null);
                            }}
                            className={`w-full rounded-xl px-4 py-3 text-left transition-all ${isSelected
                              ? 'bg-primary/10 ring-1 ring-primary/30'
                              : 'bg-white hover:bg-primary/10 dark:bg-slate-950/40'
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-black text-brand-text dark:text-white">{ngo.organization_name}</p>
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{ngo.location || 'India'} • {ngo.focus || 'NGO'}</p>
                              </div>
                              {isSelected && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/30">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-brand-text dark:text-white">Can’t find the NGO?</p>
                      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Add NGO details directly and continue with the donation flow.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !useManualNgoEntry;
                        setUseManualNgoEntry(nextState);
                        setSelectedNgoId('');
                        setConfirmManualNgo(false);
                        if (nextState && ngoSearch.trim() && !manualNgoName.trim()) {
                          setManualNgoName(ngoSearch.trim());
                        }
                        if (!nextState) {
                          setManualNgoName('');
                          setManualNgoLocation('');
                        }
                        setError(null);
                      }}
                      className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${useManualNgoEntry
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15'
                        }`}
                    >
                      {useManualNgoEntry ? 'Cancel manual entry' : 'Add NGO details'}
                    </button>
                  </div>
                </div>
                {useManualNgoEntry && (
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/30">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-primary">NGO details</p>
                      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                        Enter the NGO information carefully before starting payment.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">NGO name</label>
                      <input
                        type="text"
                        value={manualNgoName}
                        onChange={(e) => {
                          setManualNgoName(e.target.value);
                          setConfirmManualNgo(false);
                        }}
                        placeholder="Enter NGO name"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-brand-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">NGO location</label>
                      <input
                        type="text"
                        value={manualNgoLocation}
                        onChange={(e) => setManualNgoLocation(e.target.value)}
                        placeholder="Enter NGO location"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-brand-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white"
                      />
                    </div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={confirmManualNgo}
                        onChange={(e) => setConfirmManualNgo(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        I confirm that <span className="font-black text-brand-text dark:text-white">{manualNgoName.trim()}</span> is the correct NGO name.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Donation amount</label>
                <span className="text-xs font-bold text-slate-400">Indian Rupees</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {['1000', '2500', '5000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmountEnabled(false);
                    }}
                    className={`min-h-[64px] rounded-2xl border px-5 py-4 text-left transition-all ${amount === preset
                      ? 'border-primary bg-primary/10 text-brand-text shadow-sm'
                      : 'border-slate-200 bg-white text-brand-text hover:border-primary/40 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30 dark:text-white'
                      }`}
                  >
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400">Quick amount</span>
                    <span className={`mt-1 block text-xl font-black tracking-tight ${amount === preset ? 'text-primary' : 'text-brand-text dark:text-white'}`}>
                      Rs. {Number(preset).toLocaleString()}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setCustomAmountEnabled(true);
                    if (Number(amount) <= 5000) {
                      setAmount('6000');
                    }
                  }}
                  className={`min-h-[64px] rounded-2xl border px-5 py-4 text-left transition-all ${customAmountEnabled
                    ? 'border-primary bg-primary/10 text-brand-text shadow-sm'
                    : 'border-slate-200 bg-white text-brand-text hover:border-primary/40 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30 dark:text-white'
                    }`}
                >
                  <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400">Custom amount</span>
                  <span className={`mt-1 block text-lg font-black tracking-tight ${customAmountEnabled ? 'text-primary' : 'text-brand-text dark:text-white'}`}>
                    More than Rs. 5000
                  </span>
                </button>
              </div>
              {customAmountEnabled && (
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-black text-slate-500">Rs.</span>
                  <input
                    type="number"
                    min="5100"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-brand-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Payment method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'CARD', 'NET BANKING'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`min-h-[52px] rounded-xl border px-3 text-[11px] font-black uppercase tracking-widest transition-all ${paymentMethod === method
                        ? 'border-primary bg-primary text-primary-deep'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-primary/40 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
                        }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Donation note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Optional note for the NGO"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-brand-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/30">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Payment summary</p>
                  <p className="mt-1 text-sm font-bold text-brand-text dark:text-white">{resolvedNgoName || 'Choose an NGO'} • {paymentMethod}</p>
                  {resolvedNgoLocation && (
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{resolvedNgoLocation}</p>
                  )}
                </div>
                <div className="grid gap-3 text-sm font-bold text-brand-text dark:text-white">
                  <div className="flex items-center justify-between">
                    <span>Total amount paid</span>
                    <span>Rs. {Number.isFinite(numericAmount) ? numericAmount.toLocaleString() : '0'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>HopeCycle commission (5%)</span>
                    <span>Rs. {commission.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-emerald-600 dark:border-slate-700">
                    <span>NGO receives</span>
                    <span>Rs. {ngoReceives.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-black uppercase tracking-widest text-primary-deep transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <>
                  <span className="size-5 rounded-full border-2 border-primary-deep/30 border-t-primary-deep animate-spin"></span>
                  Processing payment
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pay now
                </>
              )}
            </button>
          </form>
        </section>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-brand-surface-dark lg:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-brand-text dark:text-white">Receipt</h2>
                <p className="mt-2 text-sm font-medium text-brand-muted dark:text-slate-400">
                  The latest payment receipt will appear here right after checkout.
                </p>
              </div>
              {receipt && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-black uppercase tracking-widest text-brand-text transition-all hover:border-primary hover:text-primary dark:border-slate-700 dark:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Print
                </button>
              )}
            </div>

            {receipt ? (
              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="border-b border-emerald-100 px-6 py-5 dark:border-emerald-500/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">Payment successful</p>
                      <h3 className="mt-2 text-xl font-black tracking-tight text-brand-text dark:text-white">HopeCycle Fund Donation Receipt</h3>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-emerald-600 shadow-sm dark:bg-brand-surface-dark">
                      Paid
                    </span>
                  </div>
                </div>
                <div className="space-y-5 px-6 py-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Receipt ID</p>
                      <p className="mt-1 font-black text-brand-text dark:text-white">{receipt.receiptId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paid at</p>
                      <p className="mt-1 font-black text-brand-text dark:text-white">{new Date(receipt.paidAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">NGO</p>
                      <p className="mt-1 font-black text-brand-text dark:text-white">{receipt.ngoName}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{receipt.ngoLocation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment method</p>
                      <p className="mt-1 font-black text-brand-text dark:text-white">{receipt.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Donor</p>
                      <p className="mt-1 font-black text-brand-text dark:text-white">{receipt.donorName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commission</p>
                      <p className="mt-1 font-black text-brand-text dark:text-white">Rs. {receipt.commission.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white px-5 py-5 shadow-sm dark:bg-brand-surface-dark">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount paid</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-emerald-600">Rs. {receipt.amount.toLocaleString()}</p>
                    <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">NGO receives Rs. {receipt.ngoReceives.toLocaleString()}</p>
                    {receipt.note && (
                      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Note: {receipt.note}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/30">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-brand-surface-dark">
                  <span className="material-symbols-outlined text-3xl">receipt_long</span>
                </div>
                <h3 className="mt-5 text-lg font-black text-brand-text dark:text-white">No receipt yet</h3>
                <p className="mt-2 text-sm font-medium text-brand-muted dark:text-slate-400">
                  Once a donation is completed, the receipt will show up here immediately.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DonateFunds;
