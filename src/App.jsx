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
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsOpen(h >= 18 || h < 3);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSelectedProduct(null);
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
    const message = `🔥 *NUEVO PEDIDO - PAIN BURGER* 🔥\n\n` +
      cart.map(p => `• ${p.quantity}x ${p.name} ($${((p.price || 0) * p.quantity).toLocaleString()})`).join('\n') +
      `\n\n💰 *TOTAL: $${total.toLocaleString()}*\n\n` +
      `📍 Dirección: \n` +
      `💵 Método de pago: \n` +
      `📞 Contacto: `;

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
              onClick={() => setShowCart(true)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
              title="Ver Carrito"
            >
              <ShoppingBag size={22} />
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#dc2626',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid black'
                }}>
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800 }}>
                    {selectedProduct.price ? `$${selectedProduct.price.toLocaleString()}` : "Gratis"}
                  </div>
                  <button className="btn-order" style={{ width: 'auto', padding: '12px 25px' }} onClick={() => addToCart(selectedProduct)}>Agregar al carrito</button>
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
                          <img src={item.image ? `.${item.image}` : './logo.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <button className="btn-order" style={{ width: '100%' }} onClick={finalizeOrder}>Finalizar por WhatsApp</button>
                    <p style={{ fontSize: '11px', textAlign: 'center', marginTop: '15px', opacity: 0.5 }}>
                      Serás redirigido a WhatsApp para coordinar el pago (Transferencia o Efectivo) y la entrega.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer style={{ padding: '40px 0', textAlign: 'center', opacity: 0.3, fontSize: '12px' }}>
        © 2026 PAIN BURGER • TASTE THE FIRE
      </footer>
    </div>
  );
};

export default App;
