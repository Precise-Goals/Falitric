// Exchange — Faltric P2P Energy Exchange with Firebase backend
import { useState, useEffect, useCallback } from "react";
import { database, ref, push, onValue, get, set, update } from "../firebase";

const walletKey = (addr) => addr?.toLowerCase().replace(/[.#$[\]]/g, "_") || "";

export default function Exchange({ user }) {
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState("1.05");
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState("limit");
  const [orders, setOrders] = useState([]);
  const [myTrades, setMyTrades] = useState([]);
  const [balance, setBalance] = useState(user?.token_balance ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Real-time order book from Firebase
  useEffect(() => {
    const unsub = onValue(ref(database, "faltric_orders"), (snap) => {
      if (snap.exists()) {
        const all = Object.entries(snap.val()).map(([key, val]) => ({
          id: key,
          ...val,
        }));
        setOrders(
          all
            .filter((o) => o.status === "open")
            .sort((a, b) => b.price - a.price),
        );
      } else {
        setOrders([]);
      }
    });
    return () => unsub();
  }, []);

  // My trades
  useEffect(() => {
    if (!user?.wallet_address) return;
    const unsub = onValue(ref(database, "faltric_trades"), (snap) => {
      if (snap.exists()) {
        const all = Object.entries(snap.val()).map(([key, val]) => ({
          id: key,
          ...val,
        }));
        setMyTrades(
          all
            .filter(
              (t) =>
                t.buyer === user.wallet_address ||
                t.seller === user.wallet_address,
            )
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10),
        );
      }
    });
    return () => unsub();
  }, [user?.wallet_address]);

  // Sync balance
  useEffect(() => {
    if (!user?.wallet_address) return;
    const unsub = onValue(
      ref(
        database,
        `faltric_users/${walletKey(user.wallet_address)}/token_balance`,
      ),
      (snap) => {
        if (snap.exists()) setBalance(snap.val());
      },
    );
    return () => unsub();
  }, [user?.wallet_address]);

  // Execute trade: match against existing orders or place new one
  const handleExecute = useCallback(async () => {
    if (!user?.wallet_address)
      return showToast("Connect your wallet first", "error");
    if (!amount || parseFloat(amount) <= 0)
      return showToast("Enter a valid amount", "error");
    if (!price || parseFloat(price) <= 0)
      return showToast("Enter a valid price", "error");

    const qty = parseFloat(amount);
    const px = parseFloat(price);
    const total = qty * px;

    // Check balance
    if (side === "buy" && balance < total)
      return showToast("Insufficient FAL balance", "error");

    setSubmitting(true);
    try {
      // Try to match against opposite side orders
      const opposites = orders.filter(
        (o) =>
          o.side !== side &&
          o.wallet !== user.wallet_address &&
          parseFloat(o.amount) >= qty &&
          (side === "buy"
            ? parseFloat(o.price) <= px
            : parseFloat(o.price) >= px),
      );

      if (opposites.length > 0 && side === "buy") {
        // Execute trade against best matching ask
        const match = opposites[opposites.length - 1]; // lowest ask for buy
        const matchTotal = qty * parseFloat(match.price);
        const sellerKey = walletKey(match.wallet);
        const buyerKey = walletKey(user.wallet_address);

        // Update balances
        const sellerSnap = await get(
          ref(database, `faltric_users/${sellerKey}/token_balance`),
        );
        const buyerSnap = await get(
          ref(database, `faltric_users/${buyerKey}/token_balance`),
        );
        const sellerBal = sellerSnap.exists() ? sellerSnap.val() : 0;
        const buyerBal = buyerSnap.exists() ? buyerSnap.val() : 0;

        await update(ref(database, `faltric_users/${sellerKey}`), {
          token_balance: sellerBal + matchTotal,
        });
        await update(ref(database, `faltric_users/${buyerKey}`), {
          token_balance: buyerBal - matchTotal,
        });

        // Close the matched order
        await update(ref(database, `faltric_orders/${match.id}`), {
          status: "filled",
        });

        // Record trade
        await push(ref(database, "faltric_trades"), {
          buyer: user.wallet_address,
          seller: match.wallet,
          amount: qty,
          price: parseFloat(match.price),
          total: matchTotal,
          timestamp: Date.now(),
          type: "P2P Energy Sale",
        });

        showToast(`✅ Bought ${qty} kWh @ ${match.price} USDC!`);
      } else if (opposites.length > 0 && side === "sell") {
        // Execute trade against best matching bid
        const match = opposites[0]; // highest bid for sell
        const matchTotal = qty * parseFloat(match.price);
        const buyerKey = walletKey(match.wallet);
        const sellerKey = walletKey(user.wallet_address);

        const buyerSnap = await get(
          ref(database, `faltric_users/${buyerKey}/token_balance`),
        );
        const sellerSnap = await get(
          ref(database, `faltric_users/${sellerKey}/token_balance`),
        );
        const buyerBal = buyerSnap.exists() ? buyerSnap.val() : 0;
        const sellerBal = sellerSnap.exists() ? sellerSnap.val() : 0;

        await update(ref(database, `faltric_users/${buyerKey}`), {
          token_balance: buyerBal - matchTotal,
        });
        await update(ref(database, `faltric_users/${sellerKey}`), {
          token_balance: sellerBal + matchTotal,
        });
        await update(ref(database, `faltric_orders/${match.id}`), {
          status: "filled",
        });

        await push(ref(database, "faltric_trades"), {
          buyer: match.wallet,
          seller: user.wallet_address,
          amount: qty,
          price: parseFloat(match.price),
          total: matchTotal,
          timestamp: Date.now(),
          type: "P2P Energy Sale",
        });

        showToast(`✅ Sold ${qty} kWh @ ${match.price} USDC!`);
      } else {
        // No match – place open order
        await push(ref(database, "faltric_orders"), {
          wallet: user.wallet_address,
          name: user.name || "Anonymous",
          side,
          price: px,
          amount: qty,
          total,
          status: "open",
          timestamp: Date.now(),
        });
        showToast(
          `📋 Order placed: ${side === "buy" ? "Buy" : "Sell"} ${qty} kWh @ ${px} USDC`,
        );
      }

      setAmount("");
    } catch (err) {
      showToast(err.message || "Transaction failed", "error");
    } finally {
      setSubmitting(false);
    }
  }, [side, price, amount, orders, user, balance]);

  // Split order book into asks and bids
  const asks = orders.filter((o) => o.side === "sell").slice(0, 5);
  const bids = orders.filter((o) => o.side === "buy").slice(0, 5);

  return (
    <main className="flex-grow container mx-auto max-w-7xl px-4 py-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 px-6 py-4 border-[3px] border-black font-bold text-sm shadow-[6px_6px_0_0_#000] transition-all ${toast.type === "error" ? "bg-red-100 text-red-800" : "bg-[#d0db9f] text-[#1e2809]"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Hero row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-end">
        <div className="md:col-span-8">
          <div className="inline-block bg-[#6b8a1e] text-white px-2 py-1 text-xs font-bold uppercase tracking-widest mb-3 border border-[#415514] shadow-[2px_2px_0px_0px_#415514]">
            Live Market
          </div>
          <h2
            className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4 leading-none"
            style={{ textShadow: "4px 4px 0 #1e2809" }}
          >
            P2P Energy Exchange
          </h2>
          <p className="text-[#d0db9f] font-medium max-w-xl text-lg border-l-4 border-[#6b8a1e] pl-4">
            Decentralized renewable energy trading. 1 FAL = 1 kWh.
          </p>
        </div>
        <div className="md:col-span-4 flex flex-col sm:flex-row gap-4 justify-end">
          <div className="bg-zinc-900 border-[3px] border-[#6b8a1e] p-4 flex-1 shadow-[4px_4px_0px_0px_#415514] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-[#6b8a1e]/10">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "80px" }}
              >
                account_balance_wallet
              </span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-1 relative z-10">
              My Balance
            </p>
            <p className="text-3xl font-black text-white relative z-10">
              {balance.toLocaleString()}{" "}
              <span className="text-xs font-bold align-top text-[#8faa3a]">
                FAL
              </span>
            </p>
          </div>
          <div className="bg-white border-[3px] border-black p-4 flex-1 shadow-[4px_4px_0px_0px_#415514]">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">
              Current Rate
            </p>
            <p className="text-3xl font-black text-black">
              1.05 <span className="text-xs font-bold align-top">USDC</span>
            </p>
            <p className="text-xs text-[#6b8a1e] font-bold mt-1 flex items-center gap-1">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                trending_up
              </span>
              +2.8% today
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Order Book */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Live chart (decorative) */}
          <div className="w-full h-56 bg-zinc-900 border-[3px] border-[#6b8a1e] relative overflow-hidden shadow-[4px_4px_0px_0px_#415514]">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(#6b8a1e 1px, transparent 1px), linear-gradient(90deg, #6b8a1e 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end px-4 gap-1">
              {[
                40, 60, 45, 80, 55, 70, 90, 65, 50, 75, 60, 85, 95, 70, 55, 40,
                30, 50,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 border-t border-x border-[#6b8a1e]/60"
                  style={{
                    height: `${h}%`,
                    background: "linear-gradient(to top, #6b8a1e22, #8faa3a11)",
                  }}
                />
              ))}
            </div>
            <div className="absolute top-0 left-0 p-4 w-full flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2 border border-[#6b8a1e]/40 bg-black/50 px-2 py-1">
                <span className="size-2 rounded-full bg-[#8faa3a] animate-pulse" />
                <span className="text-xs font-bold uppercase text-[#8faa3a] tracking-wider">
                  Live Feed
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 font-mono">VOL_24H</div>
                <div className="text-xl font-bold text-white">
                  45,200 <span className="text-xs">kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Book */}
          <div className="bg-zinc-900/60 backdrop-blur-sm border-[3px] border-[#6b8a1e] shadow-[4px_4px_0px_0px_#415514]">
            <div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-black bg-white">
              <h3 className="text-xl font-black text-black uppercase flex items-center gap-2 tracking-tighter">
                <span className="material-symbols-outlined">list_alt</span>{" "}
                Order Book
              </h3>
              <span className="text-xs text-[#6b8a1e] font-bold uppercase border-2 border-[#6b8a1e] px-2 py-1">
                {orders.length} open orders
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 font-bold border-b border-gray-700">
                    <th className="p-3 font-mono">Side</th>
                    <th className="p-3 font-mono">Price (USDC)</th>
                    <th className="p-3 font-mono">Amount (kWh)</th>
                    <th className="p-3 text-right font-mono">Total</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  {asks.length === 0 && bids.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-gray-500 font-bold uppercase text-xs tracking-widest"
                      >
                        No open orders — be the first to list energy!
                      </td>
                    </tr>
                  ) : (
                    <>
                      {asks.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-white/5 transition-colors group border-b border-gray-800/30"
                        >
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-red-900/50 text-red-300 text-[10px] font-black uppercase border border-red-700">
                              ASK
                            </span>
                          </td>
                          <td className="p-3 text-red-300 font-bold">
                            {parseFloat(row.price).toFixed(3)}
                          </td>
                          <td className="p-3 text-gray-300">
                            {parseFloat(row.amount).toFixed(2)}
                          </td>
                          <td className="p-3 text-gray-400 text-right">
                            {parseFloat(row.total).toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSide("buy");
                                setPrice(row.price.toString());
                                setAmount(row.amount.toString());
                              }}
                              className="text-xs font-bold px-2 py-1 uppercase border transition-all bg-white text-black border-black hover:bg-[#6b8a1e] hover:text-white hover:border-[#415514]"
                            >
                              Buy
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[#1e2809] border-y border-[#6b8a1e]/30">
                        <td
                          colSpan={5}
                          className="py-2 text-center text-xs text-[#8faa3a] font-bold uppercase tracking-widest"
                        >
                          — Spread —
                        </td>
                      </tr>
                      {bids.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-white/5 transition-colors group border-b border-gray-800/30"
                        >
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-[#1e2809] text-[#8faa3a] text-[10px] font-black uppercase border border-[#6b8a1e]">
                              BID
                            </span>
                          </td>
                          <td className="p-3 text-[#8faa3a] font-bold">
                            {parseFloat(row.price).toFixed(3)}
                          </td>
                          <td className="p-3 text-gray-300">
                            {parseFloat(row.amount).toFixed(2)}
                          </td>
                          <td className="p-3 text-gray-400 text-right">
                            {parseFloat(row.total).toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSide("sell");
                                setPrice(row.price.toString());
                                setAmount(row.amount.toString());
                              }}
                              className="text-xs font-bold px-2 py-1 uppercase border transition-all bg-[#6b8a1e] text-white border-[#415514] hover:bg-[#415514]"
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Recent Trades */}
          {myTrades.length > 0 && (
            <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#415514]">
              <div className="px-6 py-4 border-b-[3px] border-black bg-[#f5f7ee]">
                <h3 className="text-lg font-black text-black uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6b8a1e]">
                    history
                  </span>{" "}
                  My Trades
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-xs text-gray-500 font-bold uppercase border-b-2 border-black">
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTrades.map((t) => {
                      const isBuyer = t.buyer === user?.wallet_address;
                      return (
                        <tr
                          key={t.id}
                          className="border-b border-gray-200 hover:bg-[#f5f7ee]"
                        >
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black uppercase border-2 ${isBuyer ? "bg-[#d0db9f] border-[#6b8a1e] text-[#1e2809]" : "bg-red-50 border-red-400 text-red-700"}`}
                            >
                              {isBuyer ? "Buy" : "Sell"}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            {parseFloat(t.amount).toFixed(2)} kWh
                          </td>
                          <td className="p-3 text-gray-600">
                            {parseFloat(t.price).toFixed(3)}
                          </td>
                          <td className="p-3 text-right font-bold">
                            {parseFloat(t.total).toFixed(2)} USDC
                          </td>
                          <td className="p-3 text-right text-gray-400 text-xs">
                            {new Date(t.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Terminal / Order Form */}
        <div className="lg:col-span-5">
          <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#415514] sticky top-24">
            <div className="bg-[#1e2809] p-4 flex items-center justify-between border-b-[3px] border-black">
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8faa3a]">
                  terminal
                </span>{" "}
                Terminal
              </h3>
              <div className="flex items-center gap-2 bg-[#6b8a1e]/20 px-3 py-1 border border-[#6b8a1e]/40">
                <span className="size-2 rounded-full bg-[#8faa3a] animate-pulse" />
                <span className="text-xs text-[#8faa3a] font-mono uppercase">
                  Sepolia Testnet
                </span>
              </div>
            </div>
            <div className="p-6">
              {/* Buy/Sell toggle */}
              <div className="grid grid-cols-2 gap-0 mb-8 border-2 border-black bg-black p-1 shadow-[2px_2px_0px_0px_#000]">
                {["buy", "sell"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className={`py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                      side === s
                        ? "bg-[#6b8a1e] text-white border border-[#415514] shadow-[2px_2px_0px_0px_#1e2809] -translate-y-1 -translate-x-1 relative z-10"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {s === "buy" ? "🌿 Buy" : "⚡ Sell"}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {/* Order type */}
                <div className="flex gap-6 border-b-2 border-black pb-4">
                  {["Limit", "Market"].map((t, i) => (
                    <label
                      key={t}
                      className={`flex items-center gap-2 cursor-pointer group ${i === 1 ? "opacity-50 hover:opacity-100" : ""}`}
                    >
                      <div
                        className={`w-4 h-4 border-2 border-black flex items-center justify-center ${i === 0 ? "bg-[#6b8a1e]" : ""}`}
                        onClick={() =>
                          setOrderType(i === 0 ? "limit" : "market")
                        }
                      >
                        {i === 0 && <div className="w-2 h-2 bg-white" />}
                      </div>
                      <span className="text-sm font-bold text-black uppercase group-hover:underline">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Price input */}
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2 tracking-wide">
                    Price (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border-[3px] border-black text-black p-4 font-mono text-xl focus:ring-0 focus:outline-none focus:border-[#6b8a1e] placeholder-gray-300"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-sm font-bold bg-[#d0db9f] px-2 py-1 border border-[#6b8a1e]">
                      USDC
                    </span>
                  </div>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-2 tracking-wide">
                    Amount (kWh)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white border-[3px] border-black text-black p-4 font-mono text-xl focus:ring-0 focus:outline-none focus:border-[#6b8a1e] placeholder-gray-300"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-sm font-bold bg-[#d0db9f] px-2 py-1 border border-[#6b8a1e]">
                      FAL
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {["25%", "50%", "75%", "100%"].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          if (!price || balance <= 0) return;
                          const pct = parseFloat(p) / 100;
                          if (side === "buy")
                            setAmount(
                              (
                                (balance * pct) /
                                parseFloat(price || 1)
                              ).toFixed(2),
                            );
                          else setAmount((balance * pct).toFixed(2));
                        }}
                        className="flex-1 bg-[#f5f7ee] hover:bg-[#6b8a1e] hover:text-white text-xs text-black py-2 font-bold border-2 border-black transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 border-2 border-dashed border-[#8faa3a] bg-[#f5f7ee]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-black font-bold uppercase">
                      Est. Total
                    </span>
                    <span className="text-lg font-black text-black font-mono">
                      {amount && price
                        ? `${(parseFloat(amount || 0) * parseFloat(price || 0)).toFixed(2)} USDC`
                        : "0.00 USDC"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      Fees (0.1%)
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {amount && price
                        ? `${(parseFloat(amount || 0) * parseFloat(price || 0) * 0.001).toFixed(4)} USDC`
                        : "0.0000 USDC"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleExecute}
                  disabled={submitting}
                  className={`w-full font-black uppercase text-xl py-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#415514] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3 ${
                    submitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : side === "buy"
                        ? "bg-[#6b8a1e] text-white hover:bg-[#415514]"
                        : "bg-[#1e2809] text-[#8faa3a] hover:bg-[#415514] hover:text-white"
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>{" "}
                      Processing…
                    </>
                  ) : (
                    <>
                      <span>
                        {side === "buy" ? "Buy Energy" : "Sell Energy"}
                      </span>
                      <span className="material-symbols-outlined font-black">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
