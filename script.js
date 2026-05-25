document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on reload and prevent scroll restoration
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
    
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
    
    // New spec selector chips
    const specChips = document.querySelectorAll('.spec-chip');
    
    // Sticky bottom bar
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const stickyPlanLabel = document.getElementById('sticky-plan-label');
    const stickyPriceLabel = document.getElementById('sticky-price-label');

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
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
            
            if (window.scrollY > heroHeight && window.scrollY < (checkoutOffsetTop - 200)) {
                stickyCtaBar.classList.add('visible');
            } else {
                stickyCtaBar.classList.remove('visible');
            }
        }
    });

    // ==========================================================================
    // PLAN SELECTION LOGIC (Spec Chips & Single Card Selector)
    // ==========================================================================
    const planConfigs = {
        experience: {
            normalPrice: 1480,
            couponPrice: 640,
            name: "體驗組",
            fullName: "【體驗組】不油自主 BÜLIO 油切發泡錠 (1管/14錠)",
            specText: "1管（共14錠）",
            badge: "✨ 入門首選",
            image: "product-1tube.jpg",
            shortLabel: "體驗組 (1管)",
            features: [
                "適合首次入手體驗",
                "隨身攜帶，無負擔嘗試",
                "均價 NT$ 1,480 / 管"
            ]
        },
        popular: {
            normalPrice: 2860,
            couponPrice: 1180,
            name: "熱銷組",
            fullName: "【熱銷組】不油自主 BÜLIO 油切發泡錠 (2管/28錠)",
            specText: "2管（共28錠）",
            badge: '<i class="fa-solid fa-crown"></i> 熱銷首選',
            image: "product-2tube.jpg",
            shortLabel: "熱銷組 (2管)",
            features: [
                "日常體態管理首選",
                "完整週期，解膩油感",
                "均價 NT$ 1,430 / 管"
            ]
        },
        stockpile: {
            normalPrice: 8380,
            couponPrice: 3340,
            name: "囤貨組",
            fullName: "【囤貨組】不油自主 BÜLIO 油切發泡錠 (6管/84錠)",
            specText: "6管（共84錠）",
            badge: "📦 超值囤貨",
            image: "product-6tube.jpg",
            shortLabel: "囤貨組 (6管)",
            features: [
                "長效常備，全家分享",
                "性價比最高，現省最多",
                "均價 NT$ 1,397 / 管"
            ]
        }
    };

    let isCouponApplied = false;
    let currentPlanId = 'popular';
    let currentQty = 1;

    function selectPlan(planId) {
        currentPlanId = planId;
        const config = planConfigs[planId];
        if (!config) return;

        // 1. Update spec chips active class
        specChips.forEach(chip => {
            if (chip.getAttribute('data-plan') === planId) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        // 2. Update image display with fade animation
        const mainImg = document.getElementById('main-product-img');
        if (mainImg) {
            mainImg.classList.add('switching');
            setTimeout(() => {
                mainImg.src = config.image;
                mainImg.alt = config.fullName;
                mainImg.classList.remove('switching');
            }, 150); // Matches transition duration
        }

        // 3. Update badge
        const productBadge = document.getElementById('product-badge');
        if (productBadge) {
            productBadge.innerHTML = config.badge;
            if (planId === 'popular') {
                productBadge.classList.add('featured-badge');
            } else {
                productBadge.classList.remove('featured-badge');
            }
        }

        // 4. Update texts
        const planName = document.getElementById('dynamic-plan-name');
        if (planName) planName.textContent = config.name;

        const planSpec = document.getElementById('dynamic-plan-spec');
        if (planSpec) planSpec.textContent = config.specText;

        // 5. Update features list
        const featuresList = document.getElementById('dynamic-features-list');
        if (featuresList) {
            featuresList.innerHTML = '';
            config.features.forEach(feat => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${feat}`;
                featuresList.appendChild(li);
            });
        }

        // 6. Update pricing text
        const originalPriceEl = document.getElementById('dynamic-original-price');
        const couponPriceEl = document.getElementById('dynamic-coupon-price');

        if (originalPriceEl) {
            originalPriceEl.textContent = `NT$ ${(config.normalPrice * currentQty).toLocaleString('en-US')}`;
        }
        if (couponPriceEl) {
            couponPriceEl.setAttribute('data-coupon-price', `NT$ ${(config.couponPrice * currentQty).toLocaleString('en-US')}`);
            if (isCouponApplied) {
                couponPriceEl.textContent = `NT$ ${(config.couponPrice * currentQty).toLocaleString('en-US')}`;
            }
        }

        // 7. Update sticky bar
        const finalPrice = isCouponApplied ? config.couponPrice : config.normalPrice;
        if (stickyPlanLabel) stickyPlanLabel.textContent = `${config.shortLabel} x ${currentQty}`;
        if (stickyPriceLabel) stickyPriceLabel.textContent = `NT$ ${(finalPrice * currentQty).toLocaleString('en-US')}`;
    }

    function updateDiscountOverlays() {
        const planSelector = document.getElementById('plan-selector');
        if (planSelector) {
            if (isCouponApplied) {
                planSelector.classList.add('coupon-active');
            } else {
                planSelector.classList.remove('coupon-active');
            }
        }

        // Fill in coupon prices from data-coupon-price attribute
        const couponPriceEl = document.getElementById('dynamic-coupon-price');
        if (couponPriceEl) {
            couponPriceEl.textContent = couponPriceEl.getAttribute('data-coupon-price') || '';
        }

        // Update active card sticky bar price
        selectPlan(currentPlanId);
    }

    // Set click handlers on spec chips
    // Quantity Selector Action Handlers
    const qtyInput = document.getElementById('qty-input');
    const qtyMinusBtn = document.getElementById('qty-minus-btn');
    const qtyPlusBtn = document.getElementById('qty-plus-btn');

    if (qtyInput && qtyMinusBtn && qtyPlusBtn) {
        qtyMinusBtn.addEventListener('click', () => {
            if (currentQty > 1) {
                currentQty--;
                qtyInput.value = currentQty;
                selectPlan(currentPlanId);
            }
        });

        qtyPlusBtn.addEventListener('click', () => {
            if (currentQty < 99) {
                currentQty++;
                qtyInput.value = currentQty;
                selectPlan(currentPlanId);
            }
        });
    }

    // Set click handlers on spec chips
    specChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const planId = chip.getAttribute('data-plan');
            selectPlan(planId);
        });
    });

    // Mock checkout button action
    const checkoutActionBtn = document.getElementById('checkout-action-btn');
    if (checkoutActionBtn) {
        checkoutActionBtn.addEventListener('click', () => {
            const config = planConfigs[currentPlanId];
            alert(`感謝您的選購！您已選擇：${config.fullName}，數量：${currentQty} 組，正在為您引導至安全結帳頁面...`);
        });
    }

    // Initialize with Popular plan
    selectPlan('popular');

    // ==========================================================================
    // COUPON CODE HANDLERS
    // ==========================================================================
    const couponInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponMsg = document.getElementById('coupon-msg');
    const promoCodeClick = document.getElementById('promo-code-click');

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim();
            if (code === '000491') {
                isCouponApplied = true;
                if (couponMsg) {
                    couponMsg.textContent = '已成功套用優惠碼 000491，價格已折抵！';
                    couponMsg.className = 'coupon-message success';
                }
                updateDiscountOverlays();
            } else if (code === '') {
                isCouponApplied = false;
                if (couponMsg) {
                    couponMsg.textContent = '';
                    couponMsg.className = 'coupon-message';
                }
                updateDiscountOverlays();
            } else {
                isCouponApplied = false;
                if (couponMsg) {
                    couponMsg.textContent = '優惠碼無效';
                    couponMsg.className = 'coupon-message error';
                }
                updateDiscountOverlays();
            }
        });

        couponInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCouponBtn.click();
            }
        });

        if (promoCodeClick) {
            promoCodeClick.addEventListener('click', () => {
                couponInput.value = '000491';
                applyCouponBtn.click();
            });
        }
    }

    // ==========================================================================
    // SOCIAL PROOF NOTIFICATION SYSTEM
    // ==========================================================================
    const toast = document.getElementById('social-proof-toast');
    const toastBuyer = document.getElementById('toast-buyer');
    const toastAction = document.getElementById('toast-action');
    const toastTime = document.getElementById('toast-time');
    const toastClose = document.getElementById('toast-close');

    const cities = [
        '台北', '新北', '桃園', '台中', '台南', '高雄',
        '新竹', '嘉義', '彰化', '屏東', '宜蘭', '花蓮',
        '基隆', '苗栗', '南投', '雲林', '台東', '澎湖'
    ];

    const lastNames = [
        '陳', '林', '黃', '張', '李', '王', '吳', '劉',
        '蔡', '楊', '許', '鄭', '謝', '郭', '洪', '曾',
        '邱', '廖', '賴', '周', '徐', '蘇', '葉', '莊'
    ];

    const firstNameChars = [
        '萱', '芳', '婷', '雅', '惠', '玲', '怡', '君',
        '蓉', '琪', '庭', '瑜', '欣', '宜', '佳', '真',
        '珊', '筠', '涵', '晴', '霖', '翔', '宇', '傑',
        '明', '豪', '偉', '志', '文', '威', '軒', '瑋'
    ];

    const plans = [
        { name: '體驗組', qty: '1管' },
        { name: '熱銷組', qty: '2管' },
        { name: '囤貨組', qty: '6管' }
    ];

    // Weighted random — Popular and Experience appear more often
    const planWeights = [3, 5, 2]; // experience: 30%, popular: 50%, stockpile: 20%

    function getWeightedPlan() {
        const totalWeight = planWeights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < plans.length; i++) {
            random -= planWeights[i];
            if (random <= 0) return plans[i];
        }
        return plans[1]; // fallback to popular
    }

    function generateNotification() {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const firstName = firstNameChars[Math.floor(Math.random() * firstNameChars.length)];
        const plan = getWeightedPlan();
        const minutesAgo = Math.floor(Math.random() * 15) + 1;

        return {
            buyer: `${city} ${lastName}Ｏ${firstName}`,
            action: `剛剛購買了 <strong>${plan.name}</strong>`,
            time: `${minutesAgo} 分鐘前`
        };
    }

    let toastTimer = null;
    let isToastPaused = false;

    function showToast() {
        if (!toast || isToastPaused) return;

        const notif = generateNotification();
        if (toastBuyer) toastBuyer.textContent = notif.buyer;
        if (toastAction) toastAction.innerHTML = notif.action;
        if (toastTime) toastTime.textContent = notif.time;

        toast.classList.add('visible');

        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 4000);
    }

    function startToastCycle() {
        // First notification after 8 seconds
        toastTimer = setTimeout(() => {
            showToast();
            // Then repeat every 12-18 seconds
            toastTimer = setInterval(() => {
                showToast();
            }, 12000 + Math.random() * 6000);
        }, 8000);
    }

    // Close button pauses notifications for this session
    if (toastClose) {
        toastClose.addEventListener('click', (e) => {
            e.stopPropagation();
            toast.classList.remove('visible');
            isToastPaused = true;
            if (toastTimer) {
                clearInterval(toastTimer);
                clearTimeout(toastTimer);
            }
        });
    }

    // Start the notification cycle
    startToastCycle();

    // ==========================================================================
    // CAROUSEL NAVIGATION (Prev/Next buttons)
    // ==========================================================================
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const planSelector = document.getElementById('plan-selector');

    if (prevBtn && nextBtn && planSelector) {
        prevBtn.addEventListener('click', () => {
            const card = planSelector.querySelector('.plan-card-v2');
            if (card) {
                const cardWidth = card.offsetWidth + 16; // width + gap
                planSelector.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });

        nextBtn.addEventListener('click', () => {
            const card = planSelector.querySelector('.plan-card-v2');
            if (card) {
                const cardWidth = card.offsetWidth + 16; // width + gap
                planSelector.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });
    }

    // ==========================================================================
    // BACK TO TOP BUTTON
    // ==========================================================================
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
