import { useMemo, useState } from 'react';
import { PRODUCTS, getProductById, getSaving } from './product.js';

const guarantees = [
  ['Prix transparents', 'Deux offres. Aucun calcul caché.'],
  ['Bois chaleureux', 'Une finition authentique pour votre intérieur.'],
  ['Choix instantané', 'Comparez les deux modèles en un clic.'],
];

function Price({ value }) {
  return (
    <div className="price" aria-label={`${value} euros`}>
      <span>{value}</span><sup>€</sup>
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState('109');
  const selected = useMemo(() => getProductById(selectedId), [selectedId]);
  const saving = getSaving(selected.price);

  const scrollToOffers = () => {
    document.querySelector('#offres')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Accueil Fenêtre Directe">
          <span className="brand-mark" aria-hidden="true">FD</span>
          <span><strong>Fenêtre</strong> Directe</span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#offres">Nos offres</a>
          <a href="#comparatif">Comparer</a>
          <button className="nav-cta" onClick={scrollToOffers}>Voir les prix</button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Le bon prix, sans détour</p>
          <h1>Ne jetez pas votre argent par les fenêtres.</h1>
          <p className="hero-lead">
            Deux fenêtres bois, deux prix clairs. Comparez, choisissez et gardez votre budget pour ce qui compte vraiment.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={scrollToOffers}>Découvrir les offres</button>
            <a className="secondary" href="#comparatif">Comparer en 20 secondes</a>
          </div>
          <div className="hero-proof" aria-label="Avantages">
            <span><b>109 €</b> dès aujourd’hui</span>
            <span><b>16 €</b> d’économie possible</span>
            <span><b>2</b> vraies offres</span>
          </div>
        </div>

        <div className="hero-card" aria-label="Offre vedette">
          <div className="hero-card-badge">Prix malin</div>
          <img src="/assets/fenetre-109.jpg" alt="Fenêtre bois affichée à 109 euros" />
          <div className="hero-card-bottom">
            <span>Notre meilleure affaire</span>
            <Price value={109} />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Nos engagements">
        {guarantees.map(([title, copy], index) => (
          <article key={title}>
            <span className="trust-number">0{index + 1}</span>
            <div><strong>{title}</strong><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <section className="showroom" id="offres">
        <div className="section-heading">
          <p className="eyebrow">Votre mini-showroom</p>
          <h2>Deux fenêtres. <span>À vous de choisir.</span></h2>
          <p>Cliquez sur un prix pour changer instantanément le produit présenté.</p>
        </div>

        <div className="showcase">
          <div className="product-visual">
            <div className="image-frame">
              <img key={selected.image} src={selected.image} alt={`${selected.label} à ${selected.price} euros`} />
              {saving > 0 && <span className="saving-float">Vous gardez {saving} €</span>}
            </div>
            <div className="thumbnail-row" role="group" aria-label="Choisir une fenêtre">
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  className={`thumb ${selectedId === product.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(product.id)}
                  aria-pressed={selectedId === product.id}
                >
                  <img src={product.image} alt="" />
                  <span>{product.price} €</span>
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <p className="product-kicker">{selected.kicker}</p>
            <h3>{selected.label}</h3>
            <p className="product-description">{selected.description}</p>
            <Price value={selected.price} />
            <p className="tax-note">Prix affiché à titre pédagogique</p>

            <div className="selector" role="group" aria-label="Sélection du prix">
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  className={selectedId === product.id ? 'selected' : ''}
                  onClick={() => setSelectedId(product.id)}
                >
                  <span>{product.price} €</span>
                  <small>{product.id === '109' ? 'Prix malin' : 'Classique'}</small>
                </button>
              ))}
            </div>

            <div className={`saving-box ${saving ? 'visible' : ''}`}>
              <span className="saving-icon">↓</span>
              <div>
                <strong>{saving ? `${saving} € économisés` : 'Offre de référence'}</strong>
                <p>{saving ? 'par rapport au modèle à 125 €.' : 'Sélectionnez le prix malin pour comparer.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison" id="comparatif">
        <div className="section-heading compact">
          <p className="eyebrow">Comparatif express</p>
          <h2>Le calcul tient <span>sur une ligne.</span></h2>
        </div>
        <div className="comparison-grid">
          <div className="compare-card">
            <span>Fenêtre classique</span>
            <strong>125 €</strong>
            <p>Le point de référence.</p>
          </div>
          <div className="math-sign">−</div>
          <div className="compare-card featured">
            <span>Fenêtre prix malin</span>
            <strong>109 €</strong>
            <p>La même envie de bois, budget allégé.</p>
          </div>
          <div className="math-sign">=</div>
          <div className="compare-card result">
            <span>Dans votre poche</span>
            <strong>16 €</strong>
            <p>À ne pas jeter par la fenêtre.</p>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">FD</span><span><strong>Fenêtre</strong> Directe</span></a>
        <p>Projet pédagogique React + Vite · GitHub → Vercel → Internet</p>
      </footer>
    </main>
  );
}

export default App;
