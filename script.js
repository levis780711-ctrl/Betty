document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
    
    // New image-based plan cards
    const planCards = document.querySelectorAll('.plan-card-v2');
    
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
    // PLAN SELECTION LOGIC (Image-based Cards)
    // ==========================================================================
    const planConfigs = {
        experience: {
            normalPrice: 1480,
            couponPrice: 640,
            name: "【體驗組】不油自主 BÜLIO 油切發泡錠 (1管/14錠)",
            shortLabel: "體驗組 (1管)"
        },
        popular: {
            normalPrice: 2860,
            couponPrice: 1180,
            name: "【熱銷組】不油自主 BÜLIO 油切發泡錠 (2管/28錠)",
            shortLabel: "熱銷組 (2管)"
        },
        stockpile: {
            normalPrice: 8380,
            couponPrice: 3340,
            name: "【囤貨組】不油自主 BÜLIO 油切發泡錠 (6管/84錠)",
            shortLabel: "囤貨組 (6管)"
        }
    };

    let isCouponApplied = false;

    function selectPlan(cardElement) {
        planCards.forEach(c => c.classList.remove('active'));
        cardElement.classList.add('active');
        
        const planId = cardElement.getAttribute('data-plan');
        const config = planConfigs[planId];
        const finalPrice = isCouponApplied ? config.couponPrice : config.normalPrice;
        const formattedPrice = finalPrice.toLocaleString('en-US');
        
        if (stickyPlanLabel) stickyPlanLabel.textContent = config.shortLabel;
        if (stickyPriceLabel) stickyPriceLabel.textContent = `NT$ ${formattedPrice}`;
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

        // Update active card sticky bar price
        const activeCard = document.querySelector('.plan-card-v2.active');
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
});
