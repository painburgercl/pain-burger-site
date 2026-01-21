import React, { useState, useEffect } from 'react';
import { X, Flame, Droplet, UtensilsCrossed, Info, Instagram, MessageCircle, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import menuData from './data/menu.json';

const categories = [
  { id: 'burgers', name: 'BURGER PAIN', icon: Flame },
  { id: 'papas', name: 'PAPAS FRITAS', icon: UtensilsCrossed },
  { id: 'salsas', name: 'SALSAS', icon: Droplet },
  { id: 'bebestibles', name: 'BEBESTIBLES', icon: Droplet },
  { id: 'agregados', name: 'AGREGADOS', icon: Info },
];

const App = () => {
  const [activeCategory, setActiveCategory] = useState('burgers');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    payment: 'Transferencia'
  });

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsOpen(h >= 18 || h < 3);
    };
    check();
    const interval = setInterval(check, 60000);

    // Order Verification Logic
    const params = new URLSearchParams(window.location.search);
    const token = params.get('v');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        setVerificationData(decoded);
      } catch (e) {
        console.error("Invalid token");
      }
    }

    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => {
    const itemToAdd = {
      ...product,
      id: product.options ? `${product.id}-${selectedOption}` : product.id,
      displayName: product.options ? `${product.name} (${selectedOption})` : product.name,
      quantity: 1
    };

    setCart(prev => {
      const existing = prev.find(p => p.id === itemToAdd.id);
      if (existing) {
        return prev.map(p => p.id === itemToAdd.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, itemToAdd];
    });
    setSelectedProduct(null);
    setSelectedOption('');
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const finalizeOrder = () => {
    if (!customerInfo.name || !customerInfo.address) {
      alert("Por favor completa tu nombre y dirección");
      return;
    }

    // Generate Verification Token
    const orderObj = {
      n: customerInfo.name,
      a: customerInfo.address,
      p: customerInfo.payment,
      i: cart.map(p => ({ n: p.displayName || p.name, q: p.quantity })),
      t: total
    };
    const token = btoa(JSON.stringify(orderObj));
    const verifyUrl = `${window.location.origin}${window.location.pathname}?v=${token}`;

    const message = `🔥 *NUEVO PEDIDO - PAIN BURGER* 🔥\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📍 *Dirección:* ${customerInfo.address}\n` +
      `💵 *Pago:* ${customerInfo.payment}\n\n` +
      `📝 *Detalle:* \n` +
      cart.map(p => `• ${p.quantity}x ${p.displayName || p.name}`).join('\n') +
      `\n\n💰 *TOTAL: $${total.toLocaleString()}*\n\n` +
      `✅ *Verificar pedido oficial aquí:* \n${verifyUrl}`;

    window.open(`https://api.whatsapp.com/send/?phone=56987536144&text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="app">
      <header>
        <div className="container header-content">
          <div className="logo-container">
            <div className="logo-img">
              <img src="./logo.jpg" alt="Logo" />
            </div>
            <div>
              <h1 className="font-outfit brand-title">PAIN BURGER</h1>
              <p className="brand-subtitle">THE TASTE OF FIRE</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button
              onClick={() => window.open(`https://api.whatsapp.com/send/?phone=56987536144&text=${encodeURIComponent("Hola PainBurger, quiero hacer un pedido")}`, "_blank")}
              style={{ background: 'none', border: 'none', color: '#25D366', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Pedir por WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
            <a href="https://instagram.com/painburger.cl" target="_blank" style={{ color: '#E1306C', display: 'flex', alignItems: 'center' }}>
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '140px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="status-badge" style={{ color: isOpen ? '#4ade80' : '#f87171' }}>
            MONTE ÁGUILA Y CABRERO • {isOpen ? 'ABIERTO' : 'CERRADO (18:00 - 03:00)'}
          </div>
          <h2 className="font-outfit" style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '10px' }}>Nuestra Carta</h2>
        </div>

        <nav className="category-nav">
          <div className="container">
            {categories.map(c => (
              <button
                key={c.id}
                className={`category-btn ${activeCategory === c.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </nav>

        <section className="container">
          <div className="product-grid">
            {(menuData[activeCategory] || []).map(item => (
              <div key={item.id} className="product-card" onClick={() => setSelectedProduct(item)}>
                <div className="product-thumb">
                  <img src={item.image ? `.${item.image}` : './logo.jpg'} alt={item.name} onError={e => e.target.src = './logo.jpg'} />
                </div>
                <div className="product-info">
                  <div className="product-name">{item.name}</div>
                  <div className="product-desc">{item.description || item.detail}</div>
                  <div className="product-price">{item.price ? `$${item.price.toLocaleString()}` : 'Ver detalles'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedProduct(null)}><X /></button>

              <div className="modal-img">
                <img src={selectedProduct.image ? `.${selectedProduct.image}` : './logo.jpg'} alt={selectedProduct.name} onError={e => e.target.src = './logo.jpg'} />
              </div>

              <div className="modal-info">
                <p style={{ color: '#dc2626', fontSize: '12px', fontWeight: 800, marginBottom: '5px' }}>{activeCategory.toUpperCase()}</p>
                <h2 className="font-outfit" style={{ fontSize: '36px', marginBottom: '10px' }}>{selectedProduct.name}</h2>
                <div style={{ width: '40px', height: '4px', background: '#dc2626', marginBottom: '20px' }}></div>
                <p style={{ fontSize: '18px', color: '#888', lineHeight: '1.6', marginBottom: '30px' }}>
                  {selectedProduct.description || "Calidad premium garantizada. Preparado con ingredientes frescos del día."}
                </p>
                {selectedProduct.options && (
                  <div style={{ marginBottom: '25px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Selecciona una variedad:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {selectedProduct.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSelectedOption(opt)}
                          style={{
                            padding: '8px 15px',
                            borderRadius: '10px',
                            border: `1px solid ${selectedOption === opt ? '#dc2626' : 'rgba(255,255,255,0.1)'}`,
                            background: selectedOption === opt ? '#dc2626' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800 }}>
                    {selectedProduct.price ? `$${selectedProduct.price.toLocaleString()}` : "Gratis"}
                  </div>
                  <button
                    className="btn-order"
                    style={{ width: 'auto', padding: '12px 25px', opacity: (selectedProduct.options && !selectedOption) ? 0.5 : 1 }}
                    disabled={selectedProduct.options && !selectedOption}
                    onClick={() => addToCart(selectedProduct)}
                  >
                    {selectedProduct.options && !selectedOption ? 'Selecciona una opción' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showCart && (
          <div className="modal-overlay" onClick={() => setShowCart(false)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              className="cart-drawer"
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="font-outfit" style={{ fontSize: '24px' }}>Tu Pedido</h2>
                <button className="close-btn" style={{ position: 'relative', top: 0, right: 0 }} onClick={() => setShowCart(false)}><X /></button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', opacity: 0.5 }}>
                  <ShoppingBag size={48} style={{ marginBottom: '20px' }} />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '15px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden' }}>
                          <img src={item.image ? `.${item.image}` : './logo.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = './logo.jpg'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.displayName || item.name}</div>
                          <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '13px' }}>${((item.price || 0) * item.quantity).toLocaleString()}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                            <button className="qty-btn" style={{ marginLeft: 'auto', color: '#f87171' }} onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>

                    {/* CUSTOMER FORM */}
                    <div style={{ marginBottom: '20px' }}>
                      <input
                        type="text"
                        placeholder="Tu Nombre"
                        className="form-input"
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Dirección de entrega"
                        className="form-input"
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      />
                      <select
                        className="form-input"
                        value={customerInfo.payment}
                        onChange={e => setCustomerInfo({ ...customerInfo, payment: e.target.value })}
                      >
                        <option value="Transferencia">Transferencia</option>
                        <option value="Efectivo">Efectivo</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <button
                      className="btn-order"
                      style={{ width: '100%', opacity: (!customerInfo.name || !customerInfo.address) ? 0.5 : 1 }}
                      onClick={finalizeOrder}
                    >
                      Finalizar por WhatsApp
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer style={{ padding: '80px 0 120px 0', textAlign: 'center', opacity: 0.3, fontSize: '12px' }}>
        © 2026 PAIN BURGER • TASTE THE FIRE
      </footer>

      {/* FLOATING CART BUTTON */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="floating-cart-container"
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              zIndex: 1000,
              width: 'auto',
              minWidth: '220px'
            }}
          >
            <button
              className="btn-order floating-cart-btn"
              onClick={() => setShowCart(true)}
              style={{ gap: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'white', color: '#dc2626', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </div>
                <span>Ver pedido</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>${total.toLocaleString()}</span>
            </button>
          </motion.div>
        )}

        {verificationData && (
          <div className="modal-overlay" onClick={() => setVerificationData(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="modal-content"
              style={{ maxWidth: '400px', background: '#0a0a0a', border: '2px solid #4ade80' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#4ade80', color: 'black', padding: '10px', borderRadius: '10px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
                  PEDIDO AUTÉNTICO 🛡️
                </div>
                <h2 className="font-outfit">Detalle Oficial</h2>
              </div>

              <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                <p><strong>Cliente:</strong> {verificationData.n}</p>
                <p><strong>Dirección:</strong> {verificationData.a}</p>
                <p><strong>Pago:</strong> {verificationData.p}</p>
                <div style={{ margin: '15px 0', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  {verificationData.i.map((item, idx) => (
                    <div key={idx}>• {item.q}x {item.n}</div>
                  ))}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', color: '#4ade80' }}>
                  Total: ${verificationData.t.toLocaleString()}
                </div>
              </div>

              <button
                className="btn-order"
                onClick={() => {
                  setVerificationData(null);
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
                style={{ background: '#4ade80', color: 'black' }}
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
