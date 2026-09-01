/**
 * OfferMatrix Global User Profile, Wallet, Bank Cards & Referral Manager (om-profile.js)
 * Implements interactive modal managers for Profile, My Wallet (with Food, Ride & Skincare savings calculations), Bank Cards, and Refer & Earn.
 */
(function () {
  // Preset Avatars for quick selection
  const PRESET_AVATARS = [
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200'
  ];

  function injectGlobalFeatureStyles() {
    if (document.getElementById('om-global-feature-styles')) return;
    const style = document.createElement('style');
    style.id = 'om-global-feature-styles';
    style.textContent = `
      /* REMOVE SIDEBAR DOUBLE SCROLLBAR & HORIZONTAL SCROLLBAR LINES */
      .sb {
        overflow-x: hidden !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .sb::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      /* GLOBAL MODAL OVERLAY BASE */
      .om-pmodal-overlay,
      .om-wmodal-overlay,
      .om-bcmodal-overlay,
      .om-refmodal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.68);
        backdrop-filter: blur(8px);
        z-index: 99999;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      .om-pmodal-overlay.active,
      .om-wmodal-overlay.active,
      .om-bcmodal-overlay.active,
      .om-refmodal-overlay.active {
        display: flex;
        opacity: 1;
      }

      /* MODAL CARD BASE */
      .om-pmodal-card,
      .om-wmodal-card,
      .om-bcmodal-card,
      .om-refmodal-card {
        background: #ffffff;
        width: 100%;
        max-width: 650px;
        border-radius: 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        transform: translateY(20px) scale(0.96);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        color: #111827;
        border: 1px solid #f1f5f9;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
      }
      .om-pmodal-overlay.active .om-pmodal-card,
      .om-wmodal-overlay.active .om-wmodal-card,
      .om-bcmodal-overlay.active .om-bcmodal-card,
      .om-refmodal-overlay.active .om-refmodal-card {
        transform: translateY(0) scale(1);
      }

      /* MODAL HEADER */
      .om-pm-header {
        background: linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%);
        padding: 1.25rem 1.6rem;
        position: relative;
        border-bottom: 1px solid #fce7f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }
      .om-pm-header-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: #111827;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .om-pm-close-btn {
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid #fbcfe8;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        color: #4b5563;
        transition: all 0.2s;
      }
      .om-pm-close-btn:hover {
        background: #ff1a6e;
        color: #fff;
        border-color: #ff1a6e;
      }

      /* MODAL BODY */
      .om-pm-body {
        padding: 1.4rem 1.6rem;
        overflow-y: auto;
        flex: 1;
      }

      /* AVATAR SECTION */
      .om-pm-avatar-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      .om-pm-avatar-container {
        position: relative;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        box-shadow: 0 8px 24px rgba(255, 26, 110, 0.2);
        border: 3.5px solid #ffffff;
        outline: 2px solid #ff1a6e;
      }
      .om-pm-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .om-pm-avatar-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        background: #ff1a6e;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      .om-pm-avatar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .om-pm-btn-sm {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 5px 12px;
        border-radius: 50px;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #4b5563;
        cursor: pointer;
        transition: all 0.2s;
      }
      .om-pm-btn-sm:hover {
        border-color: #ff1a6e;
        color: #ff1a6e;
        background: #fff0f5;
      }

      .om-pm-presets {
        display: flex;
        gap: 8px;
        margin-top: 4px;
      }
      .om-pm-preset-img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s;
      }
      .om-pm-preset-img:hover, .om-pm-preset-img.selected {
        border-color: #ff1a6e;
        transform: scale(1.1);
      }

      /* FORM GROUPS */
      .om-pm-group {
        margin-bottom: 1.1rem;
      }
      .om-pm-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        color: #374151;
        margin-bottom: 0.35rem;
      }
      .om-pm-input, .om-pm-select {
        width: 100%;
        padding: 0.65rem 1rem;
        border: 1.5px solid #e2e8f0;
        border-radius: 12px;
        font-size: 0.88rem;
        color: #111827;
        outline: none;
        transition: all 0.2s;
        font-family: inherit;
        background: #fff;
      }
      .om-pm-input:focus, .om-pm-select:focus {
        border-color: #ff1a6e;
        box-shadow: 0 0 0 3.5px rgba(255, 26, 110, 0.12);
      }

      /* MEMBERSHIP TIER SELECTOR */
      .om-pm-tiers {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 4px;
      }
      .om-pm-tier-card {
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        padding: 0.7rem 0.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        background: #fafafa;
      }
      .om-pm-tier-card:hover {
        border-color: #cbd5e1;
      }
      .om-pm-tier-card.selected {
        border-color: #ff1a6e;
        background: #fff0f5;
        box-shadow: 0 4px 12px rgba(255, 26, 110, 0.12);
      }
      .om-pm-tier-icon {
        font-size: 1.2rem;
        margin-bottom: 2px;
      }
      .om-pm-tier-name {
        font-size: 0.76rem;
        font-weight: 800;
        color: #111827;
      }
      .om-pm-tier-sub {
        font-size: 0.65rem;
        color: #6b7280;
        margin-top: 1px;
      }

      /* MODAL FOOTER */
      .om-pm-footer {
        padding: 1rem 1.6rem 1.2rem;
        border-top: 1px solid #f1f5f9;
        display: flex;
        gap: 0.75rem;
        flex-shrink: 0;
      }
      .om-pm-btn-primary {
        flex: 1;
        background: linear-gradient(135deg, #ff1a6e, #ff4d8d);
        color: #fff;
        border: none;
        padding: 0.75rem 1.2rem;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(255, 26, 110, 0.35);
        transition: all 0.2s;
      }
      .om-pm-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 24px rgba(255, 26, 110, 0.45);
      }
      .om-pm-btn-secondary {
        padding: 0.75rem 1.2rem;
        border-radius: 50px;
        border: 1.5px solid #e2e8f0;
        background: #fff;
        color: #4b5563;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }
      .om-pm-btn-secondary:hover {
        background: #f8fafc;
      }

      /* TOAST NOTIFICATION */
      .om-pm-toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #10b981;
        color: #ffffff;
        padding: 0.8rem 1.4rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 700;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: 8px;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      .om-pm-toast.active {
        opacity: 1;
        transform: translateY(0);
      }

      /* ── WALLET STYLES ── */
      .om-wtabs {
        display: flex;
        gap: 6px;
        background: #f1f5f9;
        padding: 4px;
        border-radius: 14px;
        margin-bottom: 1.2rem;
      }
      .om-wtab {
        flex: 1;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 800;
        color: #64748b;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }
      .om-wtab.active {
        background: #ffffff;
        color: #ff1a6e;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .om-wsavings-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border-radius: 20px;
        padding: 1.4rem;
        color: #ffffff;
        margin-bottom: 1.2rem;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.3);
        position: relative;
        overflow: hidden;
      }
      .om-wsavings-card::after {
        content: '';
        position: absolute;
        right: -20px;
        bottom: -20px;
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, rgba(255, 26, 110, 0.25) 0%, transparent 70%);
        pointer-events: none;
      }
      .om-ws-title {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #94a3b8;
        font-weight: 700;
      }
      .om-ws-val {
        font-size: 2.2rem;
        font-weight: 900;
        color: #22c55e;
        margin: 4px 0 10px;
      }
      .om-ws-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        background: rgba(255, 255, 255, 0.06);
        padding: 10px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .om-wsg-item {
        text-align: center;
      }
      .om-wsg-lbl {
        font-size: 0.65rem;
        color: #cbd5e1;
        font-weight: 600;
      }
      .om-wsg-val {
        font-size: 0.85rem;
        font-weight: 800;
        color: #ffffff;
        margin-top: 2px;
      }

      .om-wcalc-banner {
        background: #f0fdf4;
        border: 1.5px solid #bbf7d0;
        border-radius: 14px;
        padding: 0.85rem 1rem;
        margin-bottom: 1.2rem;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.8rem;
        color: #166534;
        font-weight: 600;
      }
      .om-wcalc-banner strong {
        color: #15803d;
        font-weight: 800;
      }

      /* LIGHT SKY FOOD WALLET THEME */
      .om-wmodal-card.food-sky-wallet .om-pm-header {
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important;
        border-bottom: 1px solid #bae6fd !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wtab.active {
        background: linear-gradient(135deg, #0284c7, #38bdf8) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wsavings-card {
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important;
        border: 1.5px solid #7dd3fc !important;
        box-shadow: 0 12px 30px rgba(2, 132, 199, 0.18) !important;
        color: #0f172a !important;
      }
      .om-wmodal-card.food-sky-wallet .om-ws-title {
        color: #0369a1 !important;
      }
      .om-wmodal-card.food-sky-wallet .om-ws-val {
        color: #0284c7 !important;
      }
      .om-wmodal-card.food-sky-wallet .om-ws-grid {
        background: rgba(255, 255, 255, 0.75) !important;
        border: 1px solid #7dd3fc !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wsg-lbl {
        color: #475569 !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wsg-val {
        color: #0f172a !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wcalc-banner {
        background: #e0f2fe !important;
        border: 1.5px solid #bae6fd !important;
        color: #0369a1 !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wcalc-banner strong {
        color: #0284c7 !important;
      }
      .om-wmodal-card.food-sky-wallet .om-pm-btn-primary {
        background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%) !important;
        box-shadow: 0 4px 16px rgba(2, 132, 199, 0.35) !important;
      }
      .om-wmodal-card.food-sky-wallet .om-pm-btn-primary:hover {
        box-shadow: 0 8px 24px rgba(2, 132, 199, 0.45) !important;
      }
      .om-wmodal-card.food-sky-wallet .om-wti-saving {
        color: #0284c7 !important;
      }

      /* LIGHT RIDE WALLET THEME HERO CARD (#921E1A / SOFT CRIMSON PASTEL) */
      body.ride-theme .w-hero-card,
      .w-hero-card.ride-theme-wallet,
      .om-wmodal-card.ride-theme-wallet .om-wsavings-card {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
        border: 1.5px solid #fca5a5 !important;
        box-shadow: 0 12px 30px rgba(146, 30, 26, 0.12) !important;
        color: #111827 !important;
      }
      body.ride-theme .w-hero-card .w-hc-lbl,
      .w-hero-card.ride-theme-wallet .w-hc-lbl,
      .om-wmodal-card.ride-theme-wallet .om-ws-title {
        color: #921E1A !important;
        font-weight: 900 !important;
      }
      body.ride-theme .w-hero-card .w-hc-val,
      .w-hero-card.ride-theme-wallet .w-hc-val,
      .om-wmodal-card.ride-theme-wallet .om-ws-val {
        color: #921E1A !important;
      }
      body.ride-theme .w-hero-card .w-hc-grid,
      .w-hero-card.ride-theme-wallet .w-hc-grid,
      .om-wmodal-card.ride-theme-wallet .om-ws-grid {
        background: rgba(255, 255, 255, 0.85) !important;
        border: 1px solid #fca5a5 !important;
      }
      body.ride-theme .w-hero-card .w-hci-lbl,
      .w-hero-card.ride-theme-wallet .w-hci-lbl,
      .om-wmodal-card.ride-theme-wallet .om-wsg-lbl {
        color: #475569 !important;
        font-weight: 800 !important;
      }
      body.ride-theme .w-hero-card .w-hci-val,
      .w-hero-card.ride-theme-wallet .w-hci-val,
      .om-wmodal-card.ride-theme-wallet .om-wsg-val {
        color: #111827 !important;
        font-weight: 900 !important;
      }
      body.ride-theme .w-calc-banner,
      .w-calc-banner.ride-theme-wallet,
      .om-wmodal-card.ride-theme-wallet .om-wcalc-banner {
        background: #fef2f2 !important;
        border: 1.5px solid #fca5a5 !important;
        color: #921E1A !important;
      }
      body.ride-theme .w-calc-banner strong,
      .w-calc-banner.ride-theme-wallet strong,
      .om-wmodal-card.ride-theme-wallet .om-wcalc-banner strong {
        color: #921E1A !important;
      }

      /* RIDE THEME LIGHT COLOR & #921E1A DEEP CRIMSON RED ACCENT BUTTONS */
      body.ride-theme {
        background-color: #fef2f2 !important;
      }
      body.ride-theme .pay-banner {
        background: linear-gradient(135deg, #921E1A 0%, #7f1d1d 100%) !important;
        box-shadow: 0 8px 24px rgba(146, 30, 26, 0.3) !important;
      }
      body.ride-theme .pay-banner .pb-sub {
        color: #fee2e2 !important;
      }
      body.ride-theme .sb-item.on {
        background: #fee2e2 !important;
        color: #921E1A !important;
        border-right: none !important;
        border-radius: 12px !important;
        margin: 0 8px !important;
        width: calc(100% - 16px) !important;
      }
      /* Solid buttons & active tabs across all features */
      body.ride-theme .btn-invite,
      body.ride-theme .btn-primary,
      body.ride-theme .w-btn-primary,
      body.ride-theme .sb-logo-icon,
      body.ride-theme .btn-ride,
      body.ride-theme .btn-book-ride,
      body.ride-theme button.rtab.on,
      body.ride-theme .rtab.on,
      body.ride-theme .om-pm-btn-primary,
      body.ride-theme .btn-use-deal,
      body.ride-theme #rs-btn-search,
      body.ride-theme .btn-search-ride,
      body.ride-theme .btn-upgrade,
      body.ride-theme .btn-upgrade-now,
      body.ride-theme .ord-tab-pill.active,
      body.ride-theme .ord-tab.active,
      body.ride-theme .sd-tab-pill.active,
      body.ride-theme .pa-tab-pill.active,
      body.ride-theme .cpn-tab-pill.active,
      body.ride-theme .rev-tab-pill.active,
      body.ride-theme .w-tab-btn.active,
      body.ride-theme .rc-tab-btn.active,
      body.ride-theme .step-icon.active,
      body.ride-theme .ord-avatar-om,
      body.ride-theme .ao-logo.om-logo,
      body.ride-theme .badge-preparing,
      body.ride-theme .btn-track-order,
      body.ride-theme .upgrade-btn,
      body.ride-theme .btn-action,
      body.ride-theme .btn-grab,
      body.ride-theme .btn-copy-code,
      body.ride-theme .btn-write-review,
      body.ride-theme .btn-set-alert,
      body.ride-theme .sb-badge {
        background: #921E1A !important;
        color: #ffffff !important;
        box-shadow: 0 4px 14px rgba(146, 30, 26, 0.35) !important;
        border-color: #921E1A !important;
      }
      body.ride-theme .sd-tab-pill.active .sd-tab-badge,
      body.ride-theme .pa-tab-pill.active .pa-tab-badge,
      body.ride-theme .cpn-tab-pill.active .cpn-tab-badge,
      body.ride-theme .rev-tab-pill.active .rev-tab-badge {
        background: #ffffff !important;
        color: #921E1A !important;
      }
      /* Outline buttons & pills across all features */
      body.ride-theme .btn-track,
      body.ride-theme .btn-reorder,
      body.ride-theme .btn-view-det,
      body.ride-theme .btn-outline,
      body.ride-theme .btn-use,
      body.ride-theme .w-btn-secondary,
      body.ride-theme .sd-tab-pill,
      body.ride-theme .pa-tab-pill,
      body.ride-theme .cpn-tab-pill,
      body.ride-theme .rev-tab-pill,
      body.ride-theme .btn-upvote,
      body.ride-theme .btn-bell-toggle,
      body.ride-theme .btn-remove {
        border-color: #921E1A !important;
        color: #921E1A !important;
        background: #ffffff !important;
      }
      body.ride-theme .btn-upvote.voted {
        background: #fee2e2 !important;
        color: #921E1A !important;
      }
      body.ride-theme .btn-track:hover,
      body.ride-theme .btn-reorder:hover,
      body.ride-theme .btn-view-det:hover,
      body.ride-theme .btn-use:hover,
      body.ride-theme .btn-upvote:hover {
        background: #fef2f2 !important;
        border-color: #921E1A !important;
        color: #921E1A !important;
      }
      /* Dashed code boxes */
      body.ride-theme .cc-code-box {
        border-color: #921E1A !important;
        background: #fff5f5 !important;
      }
      /* Text accents, prices & hearts across all features */
      body.ride-theme .txt-pink,
      body.ride-theme .text-pink,
      body.ride-theme .txt-live-tracker,
      body.ride-theme .txt-orders-total,
      body.ride-theme .discount-text,
      body.ride-theme .hero-fname-ride-highlight,
      body.ride-theme .live-tracker-link,
      body.ride-theme .deal-price,
      body.ride-theme .pa-price,
      body.ride-theme .cc-disc,
      body.ride-theme .cc-off,
      body.ride-theme .cc-app span,
      body.ride-theme .rc-target,
      body.ride-theme .heart-btn,
      body.ride-theme .sd-title span,
      body.ride-theme .sd-hdr-row span,
      body.ride-theme .pa-title span {
        color: #921E1A !important;
      }
      /* Progress line & steppers */
      body.ride-theme .timeline-tracker::after,
      body.ride-theme .step-line.active,
      body.ride-theme .progress-bar-fill,
      body.ride-theme .live-dot {
        background: #921E1A !important;
      }
      /* Badges & Pills */
      body.ride-theme .time-left-badge,
      body.ride-theme .badge-live,
      body.ride-theme .badge-pink,
      body.ride-theme .badge-in-transit-soft,
      body.ride-theme .sds-ico,
      body.ride-theme .pa-ico,
      body.ride-theme .pas-ico {
        background: #fee2e2 !important;
        color: #921E1A !important;
        border: 1px solid #fca5a5 !important;
      }
      body.ride-theme .tb-saved {
        background: #fee2e2 !important;
        color: #921E1A !important;
        border-color: #fca5a5 !important;
      }
      body.ride-theme .tb-avatar {
        border-color: #921E1A !important;
      }

      .om-wtrans-header {
        font-size: 0.88rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .om-wtrans-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .om-wtrans-item {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 0.95rem 1.1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;
      }
      .om-wtrans-item:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .om-wti-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .om-wti-img {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        object-fit: cover;
      }
      .om-wti-name {
        font-size: 0.88rem;
        font-weight: 800;
        color: #111827;
      }
      .om-wti-sub {
        font-size: 0.72rem;
        color: #64748b;
        margin-top: 2px;
      }
      .om-wti-right {
        text-align: right;
      }
      .om-wti-saving {
        font-size: 1rem;
        font-weight: 900;
        color: #16a34a;
      }
      .om-wti-breakdown {
        font-size: 0.68rem;
        color: #64748b;
        margin-top: 2px;
      }

      /* ── BANK CARDS STYLES ── */
      .om-bc-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 1.4rem;
      }
      .om-card-item {
        background: linear-gradient(135deg, #1e293b, #334155);
        color: #fff;
        border-radius: 18px;
        padding: 1.1rem;
        position: relative;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 130px;
      }
      .om-card-item.mfs {
        background: linear-gradient(135deg, #d70f64, #e2136e);
      }
      .om-card-item.nagad {
        background: linear-gradient(135deg, #ea580c, #f97316);
      }
      .om-card-brand {
        font-size: 0.82rem;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .om-card-num {
        font-size: 1.05rem;
        letter-spacing: 2px;
        font-weight: 700;
        margin: 12px 0;
        font-family: monospace;
      }
      .om-card-holder {
        font-size: 0.72rem;
        text-transform: uppercase;
        color: #cbd5e1;
      }
      .om-card-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 50px;
        font-size: 0.65rem;
        font-weight: 800;
      }

      /* ── REFERRAL STYLES ── */
      .om-ref-box {
        background: linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%);
        border: 1.5px solid #fbcfe8;
        border-radius: 20px;
        padding: 1.4rem;
        text-align: center;
        margin-bottom: 1.2rem;
      }
      .om-ref-code-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: #ffffff;
        padding: 0.6rem 1rem;
        border-radius: 50px;
        border: 2px dashed #ff1a6e;
        margin: 1rem 0;
      }
      .om-ref-code {
        font-size: 1.3rem;
        font-weight: 900;
        color: #ff1a6e;
        letter-spacing: 1px;
      }
    `;
    document.head.appendChild(style);
  }

  /* ════════════════════════════════════════════════════════════
     1. USER PROFILE MANAGER
     ════════════════════════════════════════════════════════════ */
  function injectProfileModalHTML() {
    if (document.getElementById('om-profile-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'om-profile-modal-overlay';
    overlay.className = 'om-pmodal-overlay';
    overlay.innerHTML = `
      <div class="om-pmodal-card">
        <div class="om-pm-header">
          <div class="om-pm-header-title">
            👤 User Profile & Membership
          </div>
          <button class="om-pm-close-btn" id="om-pm-close">✕</button>
        </div>

        <div class="om-pm-body">
          <div class="om-pm-avatar-wrap">
            <div class="om-pm-avatar-container">
              <img id="om-pm-avatar-preview" class="om-pm-avatar-img" src="" alt="User Avatar" />
              <label for="om-pm-file-input" class="om-pm-avatar-badge" title="Upload new photo">📷</label>
            </div>
            <input type="file" id="om-pm-file-input" accept="image/*" style="display:none;" />

            <div class="om-pm-avatar-actions">
              <button class="om-pm-btn-sm" onclick="document.getElementById('om-pm-file-input').click()">📷 Upload Photo</button>
            </div>

            <div class="om-pm-presets">
              ${PRESET_AVATARS.map((url, idx) => `
                <img src="${url}" class="om-pm-preset-img" data-url="${url}" alt="Preset ${idx + 1}" onclick="window.OMProfile.selectPreset('${url}')" />
              `).join('')}
            </div>
          </div>

          <div class="om-pm-group">
            <label class="om-pm-label">Full Name</label>
            <input type="text" id="om-pm-name" class="om-pm-input" placeholder="e.g. Setu Meherunnesa" required />
          </div>

          <div class="om-pm-group">
            <label class="om-pm-label">Email Address</label>
            <input type="email" id="om-pm-email" class="om-pm-input" placeholder="e.g. setu@example.com" />
          </div>

          <div class="om-pm-group">
            <label class="om-pm-label">Phone Number</label>
            <input type="tel" id="om-pm-phone" class="om-pm-input" placeholder="e.g. +880 1712-345678" />
          </div>

          <div class="om-pm-group">
            <label class="om-pm-label">Delivery Address / Location</label>
            <input type="text" id="om-pm-address" class="om-pm-input" placeholder="e.g. House 42, Road 7, Dhanmondi, Dhaka" />
          </div>

          <div class="om-pm-group">
            <label class="om-pm-label">Membership Tier Status</label>
            <div class="om-pm-tiers">
              <div class="om-pm-tier-card" data-tier="General Member" onclick="window.OMProfile.selectTier('General Member')">
                <div class="om-pm-tier-icon">⚪</div>
                <div class="om-pm-tier-name">General</div>
                <div class="om-pm-tier-sub">Standard</div>
              </div>

              <div class="om-pm-tier-card" data-tier="Gold Member" onclick="window.OMProfile.selectTier('Gold Member')">
                <div class="om-pm-tier-icon">🥇</div>
                <div class="om-pm-tier-name">Gold</div>
                <div class="om-pm-tier-sub">5% Cashback</div>
              </div>

              <div class="om-pm-tier-card" data-tier="Platinum Member" onclick="window.OMProfile.selectTier('Platinum Member')">
                <div class="om-pm-tier-icon">💎</div>
                <div class="om-pm-tier-name">Platinum</div>
                <div class="om-pm-tier-sub">VIP Perks</div>
              </div>
            </div>
          </div>
        </div>

        <div class="om-pm-footer">
          <button class="om-pm-btn-secondary" id="om-pm-cancel">Cancel</button>
          <button class="om-pm-btn-primary" id="om-pm-save">Save Profile Changes</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const toast = document.createElement('div');
    toast.id = 'om-profile-toast';
    toast.className = 'om-pm-toast';
    toast.innerHTML = '✅ Profile & Membership Updated Successfully!';
    document.body.appendChild(toast);
  }

  class OMProfileManager {
    constructor() {
      this.selectedAvatar = '';
      this.selectedTier = 'Platinum Member';
      this.init();
    }

    init() {
      injectGlobalFeatureStyles();
      injectProfileModalHTML();
      this.bindEvents();
    }

    bindEvents() {
      const overlay = document.getElementById('om-profile-modal-overlay');
      const closeBtn = document.getElementById('om-pm-close');
      const cancelBtn = document.getElementById('om-pm-cancel');
      const saveBtn = document.getElementById('om-pm-save');
      const fileInput = document.getElementById('om-pm-file-input');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.close();
        });
      }

      if (saveBtn) saveBtn.addEventListener('click', () => this.save());

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.selectedAvatar = event.target.result;
              const preview = document.getElementById('om-pm-avatar-preview');
              if (preview) preview.src = this.selectedAvatar;
            };
            reader.readAsDataURL(file);
          }
        });
      }

      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.tb-user, .tb-avatar, .tb-uname, #tb-name');
        if (trigger && !e.target.closest('.om-pmodal-overlay, .om-wmodal-overlay, .om-bcmodal-overlay, .om-refmodal-overlay')) {
          e.preventDefault();
          this.open();
        }
      });
    }

    open() {
      if (!window.OMStore) return;
      const user = window.OMStore.getUser();

      const nameInput = document.getElementById('om-pm-name');
      const emailInput = document.getElementById('om-pm-email');
      const phoneInput = document.getElementById('om-pm-phone');
      const addressInput = document.getElementById('om-pm-address');
      const preview = document.getElementById('om-pm-avatar-preview');

      if (nameInput) nameInput.value = user.name || 'Setu Meherunnesa';
      if (emailInput) emailInput.value = user.email || 'setu.meherunnesa@example.com';
      if (phoneInput) phoneInput.value = user.phone || '+880 1712-345678';
      if (addressInput) addressInput.value = user.address || 'House 42, Road 7, Dhanmondi, Dhaka';

      this.selectedAvatar = user.avatar || PRESET_AVATARS[0];
      if (preview) preview.src = this.selectedAvatar;

      this.selectTier(user.tier || 'Platinum Member');

      const overlay = document.getElementById('om-profile-modal-overlay');
      if (overlay) overlay.classList.add('active');
    }

    close() {
      const overlay = document.getElementById('om-profile-modal-overlay');
      if (overlay) overlay.classList.remove('active');
    }

    selectPreset(url) {
      this.selectedAvatar = url;
      const preview = document.getElementById('om-pm-avatar-preview');
      if (preview) preview.src = url;

      document.querySelectorAll('.om-pm-preset-img').forEach(img => {
        img.classList.toggle('selected', img.getAttribute('data-url') === url);
      });
    }

    selectTier(tierName) {
      this.selectedTier = tierName;
      document.querySelectorAll('.om-pm-tier-card').forEach(card => {
        const t = card.getAttribute('data-tier');
        card.classList.toggle('selected', t === tierName);
      });
    }

    save() {
      const nameInput = document.getElementById('om-pm-name');
      const emailInput = document.getElementById('om-pm-email');
      const phoneInput = document.getElementById('om-pm-phone');
      const addressInput = document.getElementById('om-pm-address');

      const name = nameInput ? nameInput.value.trim() : 'Setu Meherunnesa';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      const tier = this.selectedTier || 'Platinum Member';
      const avatar = this.selectedAvatar || PRESET_AVATARS[0];

      if (window.OMStore) {
        window.OMStore.setUser({
          name: name,
          email: email,
          phone: phone,
          address: address,
          tier: tier,
          avatar: avatar
        });
        window.OMStore.updateBadges();
      }

      this.showToast('✅ Profile & Membership Updated Successfully!');
      this.close();
    }

    showToast(msg) {
      const toast = document.getElementById('om-profile-toast');
      if (toast) {
        toast.innerHTML = msg || '✅ Action completed!';
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
      }
    }
  }


  /* ════════════════════════════════════════════════════════════
     2. MY WALLET MANAGER (With Category Savings Calculations)
     ════════════════════════════════════════════════════════════ */
  function injectWalletModalHTML() {
    if (document.getElementById('om-wallet-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'om-wallet-modal-overlay';
    overlay.className = 'om-wmodal-overlay';
    overlay.innerHTML = `
      <div class="om-wmodal-card">
        <div class="om-pm-header">
          <div class="om-pm-header-title">
            💳 My Wallet & Purchase Savings
          </div>
          <button class="om-pm-close-btn" id="om-wm-close">✕</button>
        </div>

        <div class="om-pm-body">
          <!-- CATEGORY FILTER TABS -->
          <div class="om-wtabs">
            <button class="om-wtab active" data-cat="all" onclick="window.OMWallet.setCategoryTab('all')">All Savings</button>
            <button class="om-wtab" data-cat="food" onclick="window.OMWallet.setCategoryTab('food')">🍕 Food Savings</button>
            <button class="om-wtab" data-cat="ride" onclick="window.OMWallet.setCategoryTab('ride')">🚗 Ride Savings</button>
            <button class="om-wtab" data-cat="skincare" onclick="window.OMWallet.setCategoryTab('skincare')">✨ Skincare Savings</button>
          </div>

          <!-- DYNAMIC SAVINGS CARD -->
          <div class="om-wsavings-card" id="om-wm-card">
            <div class="om-ws-title" id="om-wm-card-title">Total Purchase Savings</div>
            <div class="om-ws-val" id="om-wm-total-val">৳0</div>

            <div class="om-ws-grid">
              <div class="om-wsg-item">
                <div class="om-wsg-lbl">Original Price</div>
                <div class="om-wsg-val" id="om-wm-orig-val">৳0</div>
              </div>
              <div class="om-wsg-item">
                <div class="om-wsg-lbl">Paid Amount</div>
                <div class="om-wsg-val" id="om-wm-paid-val">৳0</div>
              </div>
              <div class="om-wsg-item">
                <div class="om-wsg-lbl">Discount Saved</div>
                <div class="om-wsg-val" id="om-wm-disc-val">৳0</div>
              </div>
              <div class="om-wsg-item">
                <div class="om-wsg-lbl">MFS Cashback</div>
                <div class="om-wsg-val" id="om-wm-cash-val">৳0</div>
              </div>
            </div>
          </div>

          <!-- CALCULATION BANNER -->
          <div class="om-wcalc-banner" id="om-wm-calc-banner">
            <span>🧮 <strong>Calculation Formula:</strong> Total Savings = (Original Price - Paid Price) + Extra Cashback</span>
          </div>

          <!-- PURCHASE TRANSACTIONS LIST -->
          <div class="om-wtrans-header">
            <span id="om-wm-trans-title">Purchase Savings Breakdown</span>
            <button class="om-pm-btn-sm" onclick="window.OMWallet.addCustomPurchase()">➕ Add Custom Purchase</button>
          </div>

          <div class="om-wtrans-list" id="om-wm-trans-list">
            <!-- Dynamic Items -->
          </div>
        </div>

        <div class="om-pm-footer">
          <button class="om-pm-btn-secondary" id="om-wm-cancel">Close</button>
          <button class="om-pm-btn-primary" onclick="window.OMWallet.exportStatement()">📥 Export Savings Statement</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  class OMWalletManager {
    constructor() {
      this.currentCategory = 'all';
      this.init();
    }

    init() {
      injectGlobalFeatureStyles();
      injectWalletModalHTML();
      this.bindEvents();
    }

    bindEvents() {
      const overlay = document.getElementById('om-wallet-modal-overlay');
      const closeBtn = document.getElementById('om-wm-close');
      const cancelBtn = document.getElementById('om-wm-cancel');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.close();
        });
      }
    }

    open(initialCategory) {
      let cat = initialCategory;
      if (!cat) {
        const params = new URLSearchParams(window.location.search);
        const urlCat = params.get('cat');
        const urlTab = params.get('tab');
        const pathname = window.location.pathname.toLowerCase();

        if (urlCat === 'food' || urlTab === 'food') {
          cat = 'food';
        } else if (urlCat === 'ride' || urlTab === 'ride') {
          cat = 'ride';
        } else if (pathname.includes('skincare') || urlCat === 'skincare') {
          cat = 'skincare';
        } else {
          cat = 'all';
        }
      }

      this.currentCategory = cat;

      if (!window.location.pathname.toLowerCase().includes('wallet.html')) {
        window.location.href = 'wallet.html' + (cat && cat !== 'all' ? '?cat=' + cat : '');
        return;
      }

      if (typeof window.switchCategory === 'function') {
        window.switchCategory(cat);
      } else {
        const overlay = document.getElementById('om-wallet-modal-overlay');
        if (overlay) {
          overlay.classList.add('active');
          this.renderWalletContent();
        }
      }
    }

    close() {
      const overlay = document.getElementById('om-wallet-modal-overlay');
      if (overlay) overlay.classList.remove('active');
    }

    setCategoryTab(cat) {
      this.currentCategory = cat;
      this.renderWalletContent();
    }

    renderWalletContent() {
      const cat = this.currentCategory || 'all';

      const modalCard = document.querySelector('.om-wmodal-card');
      if (modalCard) {
        if (cat === 'food') {
          modalCard.classList.add('food-sky-wallet');
        } else {
          modalCard.classList.remove('food-sky-wallet');
        }
      }

      document.querySelectorAll('.om-wtab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-cat') === cat);
      });

      if (!window.OMStore) return;

      const items = window.OMStore.getOrdersSavingsBreakdown(cat);

      let totalOrig = 0;
      let totalPaid = 0;
      let totalDisc = 0;
      let totalCash = 0;
      let totalNet = 0;

      items.forEach(item => {
        totalOrig += item.originalPrice;
        totalPaid += item.paidAmount;
        totalDisc += item.discountSaving;
        totalCash += item.cashback;
        totalNet += item.netSavings;
      });

      const cardTitleEl = document.getElementById('om-wm-card-title');
      const totalValEl = document.getElementById('om-wm-total-val');
      const origValEl = document.getElementById('om-wm-orig-val');
      const paidValEl = document.getElementById('om-wm-paid-val');
      const discValEl = document.getElementById('om-wm-disc-val');
      const cashValEl = document.getElementById('om-wm-cash-val');
      const bannerEl = document.getElementById('om-wm-calc-banner');
      const transTitleEl = document.getElementById('om-wm-trans-title');

      if (cat === 'food') {
        if (cardTitleEl) cardTitleEl.textContent = '🍕 Food Purchases Savings';
        if (bannerEl) bannerEl.innerHTML = `<span>🧮 <strong>Food Calculation:</strong> Showing ONLY Food savings calculated from food orders. (৳${totalOrig} Orig - ৳${totalPaid} Paid = ৳${totalDisc} Off + ৳${totalCash} MFS = <strong>৳${totalNet} Saved</strong>)</span>`;
        if (transTitleEl) transTitleEl.textContent = `Food Purchase Savings (${items.length} Orders)`;
      } else if (cat === 'ride') {
        if (cardTitleEl) cardTitleEl.textContent = '🚗 Ride Purchases Savings';
        if (bannerEl) bannerEl.innerHTML = `<span>🧮 <strong>Ride Calculation:</strong> Showing ONLY Ride savings calculated from ride orders. (৳${totalOrig} Orig - ৳${totalPaid} Paid = ৳${totalDisc} Off + ৳${totalCash} MFS = <strong>৳${totalNet} Saved</strong>)</span>`;
        if (transTitleEl) transTitleEl.textContent = `Ride Purchase Savings (${items.length} Trips)`;
      } else if (cat === 'skincare') {
        if (cardTitleEl) cardTitleEl.textContent = '✨ Skincare Purchases Savings';
        if (bannerEl) bannerEl.innerHTML = `<span>🧮 <strong>Skincare Calculation:</strong> Showing ONLY Skincare savings calculated from beauty products. (৳${totalOrig} Orig - ৳${totalPaid} Paid = ৳${totalDisc} Off + ৳${totalCash} MFS = <strong>৳${totalNet} Saved</strong>)</span>`;
        if (transTitleEl) transTitleEl.textContent = `Skincare Purchase Savings (${items.length} Products)`;
      } else {
        if (cardTitleEl) cardTitleEl.textContent = '💳 Total Purchase Savings (All Categories)';
        if (bannerEl) bannerEl.innerHTML = `<span>🧮 <strong>Grand Total Formula:</strong> Sum of all purchase savings across Food, Ride & Skincare. (৳${totalOrig} Orig - ৳${totalPaid} Paid = ৳${totalDisc} Off + ৳${totalCash} MFS = <strong>৳${totalNet} Total Saved</strong>)</span>`;
        if (transTitleEl) transTitleEl.textContent = `All Purchase Savings (${items.length} Orders)`;
      }

      if (totalValEl) totalValEl.textContent = '৳' + totalNet.toLocaleString();
      if (origValEl) origValEl.textContent = '৳' + totalOrig.toLocaleString();
      if (paidValEl) paidValEl.textContent = '৳' + totalPaid.toLocaleString();
      if (discValEl) discValEl.textContent = '৳' + totalDisc.toLocaleString();
      if (cashValEl) cashValEl.textContent = '৳' + totalCash.toLocaleString();

      const listEl = document.getElementById('om-wm-trans-list');
      if (!listEl) return;

      if (items.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;padding:2rem;color:#94a3b8;font-size:0.85rem;">No purchase orders found for ${cat.toUpperCase()} category yet.</div>`;
        return;
      }

      listEl.innerHTML = items.map(item => {
        const catBadgeBg = item.category === 'food' ? '#d70f64' : (item.category === 'ride' ? '#111827' : '#ec4899');
        const catName = (item.category || 'food').toUpperCase();

        return `
          <div class="om-wtrans-item">
            <div class="om-wti-left">
              <img class="om-wti-img" src="${item.img || 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200'}" alt="Item" />
              <div>
                <div class="om-wti-name">${item.items || item.title || 'Purchase Item'}</div>
                <div class="om-wti-sub">
                  <span style="background:${catBadgeBg};color:#fff;font-weight:800;padding:1px 6px;border-radius:4px;font-size:0.65rem;margin-right:6px;">${catName}</span>
                  ${item.store} &bull; ${item.date} (${item.id})
                </div>
              </div>
            </div>

            <div class="om-wti-right">
              <div class="om-wti-saving">+৳${item.netSavings} Saved</div>
              <div class="om-wti-breakdown">
                Orig: <span style="text-decoration:line-through;">৳${item.originalPrice}</span> | Paid: <strong>৳${item.paidAmount}</strong> (Off ৳${item.discountSaving} + ৳${item.cashback} MFS)
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    addCustomPurchase() {
      const itemTitle = prompt('Enter Item Name (e.g. Sultan\'s Kacchi Special Combo):');
      if (!itemTitle) return;

      const category = (prompt('Enter Category (food, ride, skincare):', this.currentCategory !== 'all' ? this.currentCategory : 'food') || 'food').toLowerCase();
      const store = prompt('Enter Merchant / App Name:', category === 'food' ? 'foodpanda' : (category === 'ride' ? 'Pathao Ride' : 'Beautybooth BD')) || 'Store';
      const origPrice = Number(prompt('Enter Original Price (৳):', '500')) || 500;
      const paidPrice = Number(prompt('Enter Paid Amount (৳):', '350')) || 350;
      const cashback = Number(prompt('Enter Payment Cashback (৳):', '50')) || 50;

      const newOrder = {
        id: 'PURCHASE-' + Math.floor(100000 + Math.random() * 900000),
        items: itemTitle,
        title: itemTitle,
        store: store,
        category: category,
        total: paidPrice,
        oldPrice: origPrice,
        cashback: cashback,
        status: 'completed',
        statusText: 'Completed',
        date: 'Just now',
        img: category === 'food' ? 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200' : (category === 'ride' ? 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=200' : 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=200')
      };

      if (window.OMStore && window.OMStore.state && window.OMStore.state.orders) {
        window.OMStore.state.orders.unshift(newOrder);
        window.OMStore.saveState();
        window.OMStore.updateBadges();
      }

      this.renderWalletContent();
      if (window.OMProfile) window.OMProfile.showToast('✅ Custom purchase added & savings updated!');
    }

    exportStatement() {
      if (window.OMProfile) {
        window.OMProfile.showToast('📥 Savings Statement Exported Successfully!');
      } else {
        alert('📥 Savings Statement Exported Successfully!');
      }
    }
  }


  /* ════════════════════════════════════════════════════════════
     3. BANK CARDS MANAGER
     ════════════════════════════════════════════════════════════ */
  function injectBankCardsModalHTML() {
    if (document.getElementById('om-bankcards-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'om-bankcards-modal-overlay';
    overlay.className = 'om-bcmodal-overlay';
    overlay.innerHTML = `
      <div class="om-bcmodal-card">
        <div class="om-pm-header">
          <div class="om-pm-header-title">
            💳 Bank Cards & Payment Accounts
          </div>
          <button class="om-pm-close-btn" id="om-bcm-close">✕</button>
        </div>

        <div class="om-pm-body">
          <div style="font-size:0.85rem;font-weight:700;color:#374151;margin-bottom:0.75rem;">Your Linked Payment Cards & Accounts</div>
          
          <div class="om-bc-grid" id="om-bcm-card-grid">
            <div class="om-card-item">
              <div class="om-card-brand">
                <span>BRAC BANK</span>
                <span class="om-card-badge">VISA PLATINUM</span>
              </div>
              <div class="om-card-num">•••• •••• •••• 4829</div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                <div>
                  <div class="om-card-holder">Setu Meherunnesa</div>
                  <div style="font-size:0.65rem;color:#cbd5e1;margin-top:2px;">Exp: 12/28</div>
                </div>
                <div style="font-size:0.7rem;font-weight:800;color:#4ade80;">15% Extra Savings</div>
              </div>
            </div>

            <div class="om-card-item">
              <div class="om-card-brand">
                <span>CITY BANK</span>
                <span class="om-card-badge">MASTERCARD</span>
              </div>
              <div class="om-card-num">•••• •••• •••• 9102</div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                <div>
                  <div class="om-card-holder">Setu Meherunnesa</div>
                  <div style="font-size:0.65rem;color:#cbd5e1;margin-top:2px;">Exp: 08/27</div>
                </div>
                <div style="font-size:0.7rem;font-weight:800;color:#60a5fa;">10% Cashback</div>
              </div>
            </div>

            <div class="om-card-item mfs">
              <div class="om-card-brand">
                <span>bKash WALLET</span>
                <span class="om-card-badge">MFS</span>
              </div>
              <div class="om-card-num">+880 1712-345678</div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                <div>
                  <div class="om-card-holder">Setu Meherunnesa</div>
                  <div style="font-size:0.65rem;color:#fbcfe8;margin-top:2px;">Verified bKash Account</div>
                </div>
                <div style="font-size:0.7rem;font-weight:800;color:#fff;">20% Instant Cashback</div>
              </div>
            </div>

            <div class="om-card-item nagad">
              <div class="om-card-brand">
                <span>NAGAD WALLET</span>
                <span class="om-card-badge">MFS</span>
              </div>
              <div class="om-card-num">+880 1712-345678</div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                <div>
                  <div class="om-card-holder">Setu Meherunnesa</div>
                  <div style="font-size:0.65rem;color:#ffedd5;margin-top:2px;">Verified Nagad Account</div>
                </div>
                <div style="font-size:0.7rem;font-weight:800;color:#fff;">৳150 Flat OFF</div>
              </div>
            </div>
          </div>

          <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:18px;padding:1.2rem;">
            <div style="font-size:0.85rem;font-weight:800;color:#111827;margin-bottom:0.85rem;">💳 Add New Bank Card or MFS Account</div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="om-pm-group">
                <label class="om-pm-label">Card / Account Type</label>
                <select class="om-pm-select" id="om-bcm-type">
                  <option value="Visa">Visa Credit / Debit Card</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="EBL Card">Eastern Bank Card (EBL)</option>
                  <option value="Rocket">Rocket Mobile Banking</option>
                </select>
              </div>

              <div class="om-pm-group">
                <label class="om-pm-label">Card / Phone Number</label>
                <input type="text" id="om-bcm-number" class="om-pm-input" placeholder="4111 2222 3333 4444" />
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="om-pm-group">
                <label class="om-pm-label">Cardholder Name</label>
                <input type="text" id="om-bcm-holder" class="om-pm-input" placeholder="e.g. Setu Meherunnesa" value="Setu Meherunnesa" />
              </div>

              <div class="om-pm-group">
                <label class="om-pm-label">Expiry Date (MM/YY)</label>
                <input type="text" id="om-bcm-exp" class="om-pm-input" placeholder="12/29" />
              </div>
            </div>

            <button class="om-pm-btn-primary" style="width:100%;margin-top:4px;" onclick="window.OMBankCards.addNewCard()">➕ Link New Card & Claim Offers</button>
          </div>
        </div>

        <div class="om-pm-footer">
          <button class="om-pm-btn-secondary" id="om-bcm-cancel">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  class OMBankCardsManager {
    constructor() {
      this.init();
    }

    init() {
      injectGlobalFeatureStyles();
      injectBankCardsModalHTML();
      this.bindEvents();
    }

    bindEvents() {
      const overlay = document.getElementById('om-bankcards-modal-overlay');
      const closeBtn = document.getElementById('om-bcm-close');
      const cancelBtn = document.getElementById('om-bcm-cancel');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.close();
        });
      }
    }

    open() {
      if (!window.location.pathname.toLowerCase().includes('bank-cards.html')) {
        window.location.href = 'bank-cards.html';
        return;
      }
      const overlay = document.getElementById('om-bankcards-modal-overlay');
      if (overlay) overlay.classList.add('active');
    }

    close() {
      const overlay = document.getElementById('om-bankcards-modal-overlay');
      if (overlay) overlay.classList.remove('active');
    }

    addNewCard() {
      const type = document.getElementById('om-bcm-type').value;
      const num = document.getElementById('om-bcm-number').value.trim() || '•••• •••• •••• 5592';
      const holder = document.getElementById('om-bcm-holder').value.trim() || 'Setu Meherunnesa';
      const exp = document.getElementById('om-bcm-exp').value.trim() || '12/29';

      const maskedNum = num.length > 8 ? '•••• ' + num.slice(-4) : num;

      const grid = document.getElementById('om-bcm-card-grid');
      if (grid) {
        const newCardHTML = `
          <div class="om-card-item" style="background:linear-gradient(135deg, #1e1b4b, #4338ca);">
            <div class="om-card-brand">
              <span>${type.toUpperCase()}</span>
              <span class="om-card-badge">NEW CARD</span>
            </div>
            <div class="om-card-num">${maskedNum}</div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;">
              <div>
                <div class="om-card-holder">${holder}</div>
                <div style="font-size:0.65rem;color:#cbd5e1;margin-top:2px;">Exp: ${exp}</div>
              </div>
              <div style="font-size:0.7rem;font-weight:800;color:#c084fc;">12% Extra Discount</div>
            </div>
          </div>
        `;
        grid.insertAdjacentHTML('beforeend', newCardHTML);
      }

      document.getElementById('om-bcm-number').value = '';
      document.getElementById('om-bcm-exp').value = '';

      if (window.OMProfile) window.OMProfile.showToast(`💳 ${type} Linked Successfully!`);
    }
  }


  /* ════════════════════════════════════════════════════════════
     4. REFER & EARN MANAGER
     ════════════════════════════════════════════════════════════ */
  function injectReferralModalHTML() {
    if (document.getElementById('om-referral-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'om-referral-modal-overlay';
    overlay.className = 'om-refmodal-overlay';
    overlay.innerHTML = `
      <div class="om-refmodal-card">
        <div class="om-pm-header">
          <div class="om-pm-header-title">
            🎁 Refer & Earn Rewards
          </div>
          <button class="om-pm-close-btn" id="om-rm-close">✕</button>
        </div>

        <div class="om-pm-body">
          <div class="om-ref-box">
            <div style="font-size:2rem;margin-bottom:4px;">🎉</div>
            <div style="font-size:1.15rem;font-weight:900;color:#111827;">Invite Friends & Earn ৳100 Cashback!</div>
            <div style="font-size:0.8rem;color:#64748b;margin-top:4px;">Share your exclusive referral code. When a friend signs up & completes their 1st purchase, you both get ৳100 credited!</div>

            <div class="om-ref-code-wrap">
              <span class="om-ref-code">SETU2026</span>
              <button class="om-pm-btn-primary" style="padding:6px 14px;font-size:0.78rem;" onclick="window.OMReferral.copyCode('SETU2026')">📋 Copy Code</button>
            </div>

            <div style="display:flex;justify-content:center;gap:8px;">
              <button class="om-pm-btn-secondary" style="font-size:0.78rem;padding:6px 14px;" onclick="window.OMReferral.copyLink('https://offermatrix.bd/ref/SETU2026')">🔗 Copy Invite Link</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-bottom:1.2rem;text-align:center;">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:14px;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Invited</div>
              <div style="font-size:1.1rem;font-weight:900;color:#ff1a6e;">12</div>
            </div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:14px;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Orders</div>
              <div style="font-size:1.1rem;font-weight:900;color:#3b82f6;">8</div>
            </div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:14px;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Total Earned</div>
              <div style="font-size:1.1rem;font-weight:900;color:#22c55e;">৳800</div>
            </div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:14px;">
              <div style="font-size:0.7rem;color:#64748b;font-weight:700;">Available</div>
              <div style="font-size:1.1rem;font-weight:900;color:#8b5cf6;">৳350</div>
            </div>
          </div>

          <button class="om-pm-btn-primary" style="width:100%;background:linear-gradient(135deg, #10b981, #059669);" onclick="window.OMReferral.claimRewards()">💵 Claim ৳350 Rewards to My Wallet</button>
        </div>

        <div class="om-pm-footer">
          <button class="om-pm-btn-secondary" id="om-rm-cancel">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  class OMReferralManager {
    constructor() {
      this.init();
    }

    init() {
      injectGlobalFeatureStyles();
      injectReferralModalHTML();
      this.bindEvents();
    }

    bindEvents() {
      const overlay = document.getElementById('om-referral-modal-overlay');
      const closeBtn = document.getElementById('om-rm-close');
      const cancelBtn = document.getElementById('om-rm-cancel');

      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.close();
        });
      }
    }

    open() {
      const overlay = document.getElementById('om-referral-modal-overlay');
      if (overlay) overlay.classList.add('active');
    }

    close() {
      const overlay = document.getElementById('om-referral-modal-overlay');
      if (overlay) overlay.classList.remove('active');
    }

    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        if (window.OMProfile) window.OMProfile.showToast(`📋 Referral Code ${code} Copied!`);
      }).catch(() => {
        if (window.OMProfile) window.OMProfile.showToast(`📋 Referral Code: ${code}`);
      });
    }

    copyLink(link) {
      navigator.clipboard.writeText(link).then(() => {
        if (window.OMProfile) window.OMProfile.showToast('🔗 Referral Link Copied!');
      }).catch(() => {
        if (window.OMProfile) window.OMProfile.showToast('🔗 Referral Link Copied!');
      });
    }

    claimRewards() {
      const claimOrder = {
        id: 'REF-CLAIM-' + Math.floor(100000 + Math.random() * 900000),
        items: 'Referral Reward Bonus Claimed',
        title: 'Referral Reward Bonus Claimed',
        store: 'OfferMatrix Rewards',
        category: 'food',
        total: 0,
        oldPrice: 350,
        cashback: 350,
        status: 'completed',
        statusText: 'Completed',
        date: 'Just now',
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200'
      };

      if (window.OMStore && window.OMStore.state && window.OMStore.state.orders) {
        window.OMStore.state.orders.unshift(claimOrder);
        window.OMStore.saveState();
        window.OMStore.updateBadges();
      }

      this.close();
      if (window.OMProfile) window.OMProfile.showToast('🎉 ৳350 Referral Rewards Credited to My Wallet!');
    }
  }


  /* ════════════════════════════════════════════════════════════
     INITIALIZATION & GLOBAL BINDING
     ════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    window.OMProfile = new OMProfileManager();
    window.OMWallet = new OMWalletManager();
    window.OMBankCards = new OMBankCardsManager();
    window.OMReferral = new OMReferralManager();

    // Attach click handlers to any explicit sidebar buttons or inline triggers across all pages
    document.querySelectorAll('.sb-item').forEach(item => {
      const txt = item.textContent.toLowerCase();
      if (txt.includes('wallet')) {
        item.onclick = (e) => { e.preventDefault(); window.OMWallet.open(); };
      } else if (txt.includes('bank cards')) {
        item.onclick = (e) => { e.preventDefault(); window.OMBankCards.open(); };
      } else if (txt.includes('refer')) {
        item.onclick = (e) => { e.preventDefault(); window.OMReferral.open(); };
      }
    });

    document.querySelectorAll('.btn-invite').forEach(btn => {
      btn.onclick = (e) => { e.preventDefault(); window.OMReferral.open(); };
    });
  });
})();
