/**
 * OfferMatrix Global User Profile & Membership Manager (om-profile.js)
 * Enables opening, viewing, editing profile details, avatar upload, and membership tier selection.
 */
(function() {
  // Preset Avatars for quick selection
  const PRESET_AVATARS = [
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200'
  ];

  function injectProfileStyles() {
    if (document.getElementById('om-profile-styles')) return;
    const style = document.createElement('style');
    style.id = 'om-profile-styles';
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

      /* PROFILE MODAL OVERLAY */
      .om-pmodal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(8px);
        z-index: 99999;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      .om-pmodal-overlay.active {
        display: flex;
        opacity: 1;
      }

      .om-pmodal-card {
        background: #ffffff;
        width: 100%;
        max-width: 520px;
        border-radius: 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        transform: translateY(20px) scale(0.96);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        color: #111827;
        border: 1px solid #f1f5f9;
      }
      .om-pmodal-overlay.active .om-pmodal-card {
        transform: translateY(0) scale(1);
      }

      /* MODAL HEADER */
      .om-pm-header {
        background: linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%);
        padding: 1.5rem 1.8rem;
        position: relative;
        border-bottom: 1px solid #fce7f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .om-pm-header-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #111827;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .om-pm-close-btn {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid #fbcfe8;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.1rem;
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
        padding: 1.5rem 1.8rem;
        max-height: 80vh;
        overflow-y: auto;
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

      /* MEMBERSHIP LEVEL SELECTOR */
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
        padding: 1rem 1.8rem 1.4rem;
        border-top: 1px solid #f1f5f9;
        display: flex;
        gap: 0.75rem;
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
    `;
    document.head.appendChild(style);
  }

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
          <!-- AVATAR SECTION -->
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
                <img src="${url}" class="om-pm-preset-img" data-url="${url}" alt="Preset ${idx+1}" onclick="window.OMProfile.selectPreset('${url}')" />
              `).join('')}
            </div>
          </div>

          <!-- USER INFO FIELDS -->
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

          <!-- MEMBERSHIP TIER SELECTION -->
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

    // Toast Container
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
      injectProfileStyles();
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

      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.save());
      }

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

      // Attach click handlers to topbar user triggers across all pages
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.tb-user, .tb-avatar, .tb-uname, #tb-name');
        if (trigger && !e.target.closest('#om-profile-modal-overlay')) {
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

      this.showToast();
      this.close();
    }

    showToast() {
      const toast = document.getElementById('om-profile-toast');
      if (toast) {
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.OMProfile = new OMProfileManager();
  });
})();
