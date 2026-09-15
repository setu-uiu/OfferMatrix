import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const HeartIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="36" height="36" fill="none" stroke="#1a1a2e" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ArrowLeft = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
// Unsplash Source — free random photos, no API key needed
const categories = [
  {
    label: "New Arrivals",
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop",
    bg: "#fffbe6",
  },
  {
    label: "J-Beauty",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
    bg: "#e8f4ff",
  },
  {
    label: "K-Beauty",
    img: "https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop",
    bg: "#fff0f6",
  },
  {
    label: "International Bran…",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=200&h=200&fit=crop",
    bg: "#f0fff4",
  },
  {
    label: "Baby Care",
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop",
    bg: "#e8f4ff",
  },
  {
    label: "Make Up",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop",
    bg: "#fff0f6",
  },
  {
    label: "Doctor Cosmetics",
    img: "https://images.unsplash.com/photo-1579722821273-0f6c1b1e4b7c?w=200&h=200&fit=crop",
    bg: "#eef0ff",
  },
  {
    label: "Beauty Tips",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    bg: "#fffbe6",
  },
];

// Real face/skin photos for Shop By Concern
const concerns = [
  {
    label: "Anti-Aging",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=340&fit=crop&crop=face",
    tone: "#f5d7c8",
  },
  {
    label: "Dark Spots",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=340&fit=crop&crop=face",
    tone: "#e8c5a0",
  },
  {
    label: "Dullness",
    img: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=300&h=340&fit=crop&crop=face",
    tone: "#dbb89a",
  },
  {
    label: "Acne",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=340&fit=crop&crop=face",
    tone: "#f5cfc0",
  },
  {
    label: "Sensitive Skin",
    img: "https://images.unsplash.com/photo-1491349174775-aaaefdd81942?w=300&h=340&fit=crop&crop=face",
    tone: "#f0cfc0",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function KireiPage() {
  const [catStart, setCatStart] = useState(0);
  const visibleCount = 7;

  const prevCat = () => setCatStart((s) => Math.max(0, s - 1));
  const nextCat = () =>
    setCatStart((s) => Math.min(categories.length - visibleCount, s + 1));

  return (
    <div style={styles.page}>
      {/* Top accent bar */}
      <div style={styles.accentBar} />

      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <svg width="30" height="30" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <polygon points="50,10 60,40 90,40 67,58 75,88 50,70 25,88 33,58 10,40 40,40" fill="#c0392b" />
          </svg>
          <span style={styles.logoText}>Kirei</span>
        </div>

        <div style={styles.searchWrapper}>
          <input type="text" placeholder="Search for product" style={styles.searchInput} />
          <button style={styles.searchBtn} aria-label="Search"><SearchIcon /></button>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.supportBlock}>
            <PhoneIcon />
            <div style={styles.supportText}>
              <span style={styles.supportLabel}>Support</span>
              <span style={styles.supportNumber}>+880 966 679 1110</span>
            </div>
          </div>
          <div style={styles.iconGroup}>
            <button style={styles.iconBtn} aria-label="Wishlist"><HeartIcon /></button>
            <button style={styles.iconBtn} aria-label="Cart"><CartIcon /></button>
            <button style={styles.iconBtn} aria-label="Account"><UserIcon /></button>
          </div>
        </div>
      </header>

      {/* ── Nav ── */}
      <nav style={styles.nav}>
        <button style={styles.browseBtn}>
          Browse Categories <ChevronDown />
        </button>
        <ul style={styles.navLinks}>
          {["Home", "Today's Deals", "Shop", "Blogs", "Contact"].map((item) => (
            <li key={item}>
              <a href="#" style={{ ...styles.navLink, ...(item === "Home" ? styles.navLinkActive : {}) }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero Banner ── */}
      <section style={styles.heroWrapper}>
        <div style={styles.hero}>
          {/* Real dermatology/skincare photo on the left */}
          <div style={styles.heroImgArea}>
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop"
              alt="Dermatologist treating patient"
              style={styles.heroImg}
            />
          </div>

          {/* Text */}
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              <span style={styles.heroTitlePink}>Dermatologist</span>
              <br />
              <span style={styles.heroTitleDark}>Support</span>
            </h1>
            <button style={styles.bookBtn}>Book Now →</button>
          </div>

          {/* Decorative ring */}
          <div style={styles.heroDecorRight} />
        </div>
      </section>

      {/* ── Featured Categories ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Categories</h2>
          <div style={styles.carouselBtns}>
            <button
              style={{ ...styles.carouselBtn, opacity: catStart === 0 ? 0.4 : 1 }}
              onClick={prevCat}
              disabled={catStart === 0}
              aria-label="Previous"
            >
              <ArrowLeft />
            </button>
            <button
              style={{
                ...styles.carouselBtn,
                opacity: catStart >= categories.length - visibleCount ? 0.4 : 1,
              }}
              onClick={nextCat}
              disabled={catStart >= categories.length - visibleCount}
              aria-label="Next"
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        <div style={styles.categoriesTrack}>
          {categories.slice(catStart, catStart + visibleCount).map((cat) => (
            <div key={cat.label} style={styles.catCard}>
              <div style={{ ...styles.catImgBox, background: cat.bg }}>
                <img
                  src={cat.img}
                  alt={cat.label}
                  style={styles.catImg}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <span style={styles.catLabel}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop By Concern ── */}
      <section style={styles.concernSection}>
        <h2 style={styles.concernTitle}>Shop By Concern</h2>
        <div style={styles.concernGrid}>
          {concerns.map((c) => (
            <div key={c.label} style={{ ...styles.concernCard, background: c.tone }}>
              <img
                src={c.img}
                alt={c.label}
                style={styles.concernImg}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={styles.concernOverlay}>
                <span style={styles.concernLabel}>{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 <strong>Kirei</strong> — Beauty &amp; Skincare Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: "#1a1a2e",
    background: "#fff",
    minHeight: "100vh",
    overflowX: "hidden",
  },
  accentBar: {
    height: 4,
    background: "linear-gradient(90deg,#c0392b,#e74c3c,#ff6b6b,#e91e8c)",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 40px",
    borderBottom: "1px solid #f0f0f0",
    gap: 20,
    flexWrap: "wrap",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  logoText: {
    fontSize: 26,
    fontWeight: 700,
    fontStyle: "italic",
    color: "#1a1a2e",
    letterSpacing: "-0.5px",
    fontFamily: "Georgia, serif",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    maxWidth: 360,
    border: "1px solid #ddd",
    borderRadius: 6,
    overflow: "hidden",
    background: "#fafafa",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px 14px",
    fontSize: 14,
    background: "transparent",
    color: "#555",
  },
  searchBtn: {
    border: "none",
    background: "transparent",
    padding: "10px 14px",
    cursor: "pointer",
    color: "#555",
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  supportBlock: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  supportText: {
    display: "flex",
    flexDirection: "column",
  },
  supportLabel: { fontSize: 12, color: "#e74c3c", fontWeight: 600 },
  supportNumber: { fontSize: 13, fontWeight: 700, color: "#1a1a2e" },
  iconGroup: { display: "flex", alignItems: "center", gap: 4 },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 6,
    color: "#333",
    display: "flex",
    alignItems: "center",
  },

  // Nav
  nav: {
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
    borderBottom: "1px solid #f0f0f0",
    height: 48,
    gap: 40,
  },
  browseBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    color: "#1a1a2e",
    padding: 0,
    whiteSpace: "nowrap",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: 32,
    flex: 1,
    justifyContent: "center",
  },
  navLink: {
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    color: "#333",
    padding: "14px 0",
    borderBottom: "2px solid transparent",
  },
  navLinkActive: {
    color: "#e74c3c",
    borderBottom: "2px solid #e74c3c",
    fontWeight: 600,
  },

  // Hero
  heroWrapper: { padding: "20px 40px" },
  hero: {
    position: "relative",
    background: "linear-gradient(120deg,#b2f0f0 0%,#d6f8f8 45%,#edfcfc 100%)",
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 280,
    display: "flex",
    alignItems: "center",
  },
  heroImgArea: {
    flex: "0 0 48%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    minHeight: 280,
  },
  heroImg: {
    width: "100%",
    height: 280,
    objectFit: "cover",
    objectPosition: "center top",
    borderRadius: "0 0 0 16px",
  },
  heroContent: {
    flex: 1,
    padding: "40px 48px 40px 36px",
    zIndex: 2,
  },
  heroTitle: { lineHeight: 1.15, marginBottom: 28, margin: "0 0 28px" },
  heroTitlePink: {
    fontSize: 48,
    fontWeight: 800,
    color: "#e91e8c",
    fontStyle: "italic",
    display: "block",
  },
  heroTitleDark: {
    fontSize: 44,
    fontWeight: 700,
    color: "#1a1a2e",
    display: "block",
  },
  bookBtn: {
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 30,
    padding: "13px 30px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
  heroDecorRight: {
    position: "absolute",
    right: 50,
    top: "50%",
    transform: "translateY(-50%)",
    width: 200,
    height: 200,
    borderRadius: "50%",
    border: "2px solid rgba(100,210,210,0.3)",
    pointerEvents: "none",
  },

  // Featured Categories
  section: { padding: "32px 40px 24px" },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
    fontFamily: "Georgia, serif",
  },
  carouselBtns: { display: "flex", gap: 8 },
  carouselBtn: {
    width: 36,
    height: 36,
    border: "1.5px solid #ccc",
    background: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
  },
  categoriesTrack: {
    display: "flex",
    gap: 14,
    overflow: "hidden",
  },
  catCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flex: "0 0 calc((100% - 84px) / 7)",
    cursor: "pointer",
  },
  catImgBox: {
    width: "100%",
    aspectRatio: "1",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  catImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  catLabel: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
    fontWeight: 500,
    lineHeight: 1.3,
  },

  // Shop By Concern
  concernSection: { padding: "20px 40px 48px" },
  concernTitle: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Georgia, serif",
    color: "#1a1a2e",
  },
  concernGrid: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  concernCard: {
    flex: "1 1 160px",
    maxWidth: 190,
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    transition: "transform 0.2s",
  },
  concernImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center top",
    display: "block",
  },
  concernOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
    padding: "10px 12px",
    display: "flex",
    alignItems: "flex-end",
  },
  concernLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
  },

  // Footer
  footer: {
    borderTop: "1px solid #f0f0f0",
    padding: "18px 40px",
    textAlign: "center",
  },
  footerText: { fontSize: 13, color: "#888", margin: 0 },
};
