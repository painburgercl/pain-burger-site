import React, { useState, useEffect } from 'react';
import { X, Flame, Droplet, UtensilsCrossed, Info, Instagram, MessageCircle } from 'lucide-react';
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

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsOpen(h >= 18 || h < 3);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  const order = () => {
    window.open("https://api.whatsapp.com/send/?phone=56987536144&text=Hola+PainBurger+quiero+hacer+un+pedido", "_blank");
  };

  return (
    <div className="app">
      <header>
        <div className="container header-content">
          <div className="logo-container">
            <div className="logo-img">
              <img src="/logo.jpg" alt="Logo" />
            </div>
            <div>
              <h1 className="font-outfit brand-title">PAIN BURGER</h1>
              <p className="brand-subtitle">THE TASTE OF FIRE</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button
              onClick={order}
              style={{ background: 'none', border: 'none', color: '#25D366', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Pedir por WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
            <a href="https://instagram.com/painburger.cl" target="_blank" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
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
                  <img src={item.image || '/logo.jpg'} alt={item.name} onError={e => e.target.src = '/logo.jpg'} />
                </div>
                <div className="product-info">
                  <div className="product-name">{item.name}</div>
                  <div className="product-desc">{item.description || item.detail}</div>
                  <div className="product-price">{item.price ? `$${item.price.toLocaleString()}` : 'Acompañamiento'}</div>
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
                <img src={selectedProduct.image || '/logo.jpg'} alt={selectedProduct.name} onError={e => e.target.src = '/logo.jpg'} />
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
                    {selectedProduct.price ? `$${selectedProduct.price.toLocaleString()}` : "Añadido"}
                  </div>
                  <button className="btn-order" style={{ width: 'auto', padding: '12px 25px' }} onClick={order}>Pedir</button>
                </div>
              </div>
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
