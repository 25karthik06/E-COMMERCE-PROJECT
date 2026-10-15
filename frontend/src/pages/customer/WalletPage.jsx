import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWallet, addMoney } from '../../api/walletApi';
import { Wallet as WalletIcon, CreditCard, ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add money form state
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (error) {
      toast.error('Failed to load wallet details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (cardNumber.length < 12) {
      toast.error('Please enter a valid card number');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedWallet = await addMoney({
        amount: Number(amount),
        cardNumber,
        expiryDate: expiry,
        cvv
      });
      setWallet(updatedWallet);
      setShowAddMoney(false);
      setAmount('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      toast.success(`Successfully added ₹${amount} to your wallet!`);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add money. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <WalletIcon size={24} className="text-primary" /> My Wallet
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Balance Card */}
        <div className="w-full">
          <div className="p-6 bg-primary text-white border-2 border-black h-full flex flex-col justify-between transition-all duration-200" style={{ boxShadow: '4px 4px 0px 0px #000' }}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">Available Balance</p>
              <h2 className="text-4xl font-bold">₹{wallet?.balance?.toFixed(2) || '0.00'}</h2>
            </div>
            <button 
              onClick={() => setShowAddMoney(!showAddMoney)}
              className="mt-8 bg-white text-ink border-2 border-black font-bold py-2 px-4 w-full flex items-center justify-center gap-2 hover:bg-accent transition-colors"
              style={{ boxShadow: '2px 2px 0px 0px #000' }}
            >
              <Plus size={18} /> Add Money
            </button>
          </div>
        </div>

        {/* Add Money Form */}
        {showAddMoney && (
          <div className="w-full">
            <div className="card p-6 border-2 border-black" style={{ boxShadow: '4px 4px 0px 0px #000' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Add Funds to Wallet
              </h3>
              <form onSubmit={handleAddMoney} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-base"
                    placeholder="500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase mb-1">Card Number (Mock)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="input-base"
                    placeholder="1234 5678 9101 1121"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase mb-1">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="input-base"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="input-base"
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddMoney(false)} className="btn-ghost border-2 border-black">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Processing...' : `Pay ₹${amount || '0'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="w-full">
          <div className="card p-6 border-2 border-black" style={{ boxShadow: '4px 4px 0px 0px #000' }}>
            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
            
            {!wallet?.transactions || wallet.transactions.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <WalletIcon size={48} className="mx-auto mb-3 opacity-20" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wallet.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border-2 border-black bg-white">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === 'CREDIT' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {tx.type === 'CREDIT' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-ink text-sm">{tx.description}</p>
                        <p className="text-xs text-muted font-medium">{new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === 'CREDIT' ? 'text-success' : 'text-error'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
