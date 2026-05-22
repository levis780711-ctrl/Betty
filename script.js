document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
    
    const planCards = document.querySelectorAll('.plan-card');
    
    // Sticky bottom bar
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const stickyPlanLabel = document.getElementById('sticky-plan-label');
    const stickyPriceLabel = document.getElementById('sticky-price-label');

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    // Toggle Mobile Menu
    if (mobileMenuToggle && mobileNavOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileNavOverlay.classList.contains('open');
            if (isOpen) {
                mobileNavOverlay.classList.remove('open');
                mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            } else {
                mobileNavOverlay.classList.add('open');
                mobileMenuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }
        });
    }

    // Close mobile menu on nav link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
            if (mobileMenuToggle) mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // Header scroll background effect
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ==========================================================================
    // STICKY BOTTOM BAR VISIBILITY
    // ==========================================================================
    window.addEventListener('scroll', () => {
        const heroSection = document.getElementById('hero');
        const checkoutSection = document.getElementById('checkout-section');
        if (heroSection && checkoutSection && stickyCtaBar) {
            const heroHeight = heroSection.offsetHeight;
            const checkoutOffsetTop = checkoutSection.offsetTop;
            
            // Show sticky bar only after scrolling past the first section,
            // and hide it when the user reaches the checkout section
            if (window.scrollY > heroHeight && window.scrollY < (checkoutOffsetTop - 200)) {
                stickyCtaBar.classList.add('visible');
            } else {
                stickyCtaBar.classList.remove('visible');
            }
        }
    });

    // ==========================================================================
    // PLAN SELECTION LOGIC
    // ==========================================================================
    // Pricing configurations
    const planConfigs = {
        experience: {
            normalPrice: 1480,
            couponPrice: 640,
            originalNormal: 1480,
            originalCoupon: 1480,
            name: "【體驗組】不油自主 BÜLIO 油切發泡錠 (1管/14錠)",
            shortLabel: "體驗組 (1管)",
            avgNormal: 1480,
            avgCoupon: 640
        },
        popular: {
            normalPrice: 2860,
            couponPrice: 1180,
            originalNormal: 2860,
            originalCoupon: 2860,
            name: "【熱銷組】不油自主 BÜLIO 油切發泡錠 (2管/28錠)",
            shortLabel: "熱銷組 (2管)",
            avgNormal: 1430,
            avgCoupon: 590
        },
        stockpile: {
            normalPrice: 8380,
            couponPrice: 3340,
            originalNormal: 8380,
            originalCoupon: 8380,
            name: "【囤貨組】不油自主 BÜLIO 油切發泡錠 (6管/84錠)",
            shortLabel: "囤貨組 (6管)",
            avgNormal: 1397,
            avgCoupon: 557
        }
    };

    let isCouponApplied = false;

    function selectPlan(cardElement) {
        // Remove active class from all cards
        planCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        cardElement.classList.add('active');
        
        // Read data attributes
        const planId = cardElement.getAttribute('data-plan');
        const config = planConfigs[planId];
        const finalPrice = isCouponApplied ? config.couponPrice : config.normalPrice;
        
        // Format price with comma
        const formattedPrice = finalPrice.toLocaleString('en-US');
        
        // Update Sticky bottom bar info
        if (stickyPlanLabel) stickyPlanLabel.textContent = config.shortLabel;
        if (stickyPriceLabel) stickyPriceLabel.textContent = `NT$ ${formattedPrice}`;
    }

    function updatePricingUI() {
        planCards.forEach(card => {
            const planId = card.getAttribute('data-plan');
            const config = planConfigs[planId];
            
            const origSpan = card.querySelector('.original-price');
            const priceSpan = card.querySelector('.price .num');
            const avgSpan = card.querySelector('.plan-features span');
            const badge = card.querySelector('.plan-badge');

            if (isCouponApplied) {
                if (origSpan) {
                    origSpan.textContent = `原價 NT$ ${config.originalCoupon.toLocaleString('en-US')}`;
                    origSpan.style.textDecoration = 'line-through';
                    origSpan.style.display = 'inline';
                }
                if (priceSpan) {
                    priceSpan.textContent = config.couponPrice.toLocaleString('en-US');
                }
                if (avgSpan) {
                    avgSpan.textContent = config.avgCoupon.toLocaleString('en-US');
                }
                card.classList.add('discount-active');
                if (planId === 'popular') {
                    badge.textContent = `熱銷首選 (現省$1,680)`;
                } else if (planId === 'stockpile') {
                    badge.textContent = `超值囤貨 (現省$5,040)`;
                }
            } else {
                if (origSpan) {
                    origSpan.style.display = 'none';
                }
                if (priceSpan) {
                    priceSpan.textContent = config.normalPrice.toLocaleString('en-US');
                }
                if (avgSpan) {
                    avgSpan.textContent = config.avgNormal.toLocaleString('en-US');
                }
                card.classList.remove('discount-active');
                if (planId === 'popular') {
                    badge.textContent = `熱銷首選`;
                } else if (planId === 'stockpile') {
                    badge.textContent = `超值囤貨`;
                }
            }
        });

        // Update active card selections
        const activeCard = document.querySelector('.plan-card.active');
        if (activeCard) {
            selectPlan(activeCard);
        }
    }

    // Set click handlers on cards
    planCards.forEach(card => {
        card.addEventListener('click', () => {
            selectPlan(card);
        });
    });

    // Initialize with Featured plan (Popular / index 1)
    if (planCards.length > 1) {
        selectPlan(planCards[1]);
    }

    // Coupon Code handlers
    const couponInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponMsg = document.getElementById('coupon-msg');

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim();
            if (code === '000491') {
                isCouponApplied = true;
                if (couponMsg) {
                    couponMsg.textContent = '已成功套用優惠碼 000491，價格已折抵！';
                    couponMsg.className = 'coupon-message success';
                }
                updatePricingUI();
            } else if (code === '') {
                isCouponApplied = false;
                if (couponMsg) {
                    couponMsg.textContent = '';
                    couponMsg.className = 'coupon-message';
                }
                updatePricingUI();
            } else {
                isCouponApplied = false;
                if (couponMsg) {
                    couponMsg.textContent = '優惠碼無效';
                    couponMsg.className = 'coupon-message error';
                }
                updatePricingUI();
            }
        });

        couponInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCouponBtn.click();
            }
        });
    }
});
