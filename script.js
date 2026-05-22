document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
    
    const planCards = document.querySelectorAll('.plan-card');
    const orderForm = document.getElementById('order-form');
    const submitBtn = document.getElementById('submit-btn');
    
    // Hidden inputs
    const hiddenPlanId = document.getElementById('selected-plan-id');
    const hiddenPlanName = document.getElementById('selected-plan-name');
    const hiddenPlanPrice = document.getElementById('selected-plan-price');
    
    // Form inputs
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    const emailInput = document.getElementById('customer-email');
    const addressInput = document.getElementById('customer-address');
    const storeNameInput = document.getElementById('store-name');
    const storeTypeSelect = document.getElementById('store-type');
    const notesInput = document.getElementById('customer-notes');
    
    // Dynamic fields groups
    const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
    const addressGroup = document.getElementById('address-group');
    const storeGroup = document.getElementById('store-group');
    
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const creditCardFields = document.getElementById('credit-card-fields');
    const ccNumInput = document.getElementById('cc-num');
    const ccExpiryInput = document.getElementById('cc-expiry');
    const ccCvcInput = document.getElementById('cc-cvc');
    
    // Summary labels
    const summaryProductName = document.getElementById('summary-product-name');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    
    // Sticky bottom bar
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const stickyPlanLabel = document.getElementById('sticky-plan-label');
    const stickyPriceLabel = document.getElementById('sticky-price-label');
    
    // Success Modal elements
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const receiptOrderId = document.getElementById('receipt-order-id');
    const receiptPlan = document.getElementById('receipt-plan');
    const receiptTotal = document.getElementById('receipt-total');
    const receiptName = document.getElementById('receipt-name');
    const receiptPhone = document.getElementById('receipt-phone');
    const receiptAddress = document.getElementById('receipt-address');
    const receiptPayment = document.getElementById('receipt-payment');

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    // Toggle Mobile Menu
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

    // Close mobile menu on nav link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('open');
            mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // Header scroll background effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // STICKY BOTTOM BAR VISIBILITY
    // ==========================================================================
    window.addEventListener('scroll', () => {
        const heroHeight = document.getElementById('hero').offsetHeight;
        const checkoutOffsetTop = document.getElementById('checkout-section').offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Show sticky bar only after scrolling past the first section,
        // and hide it when the user reaches the checkout form
        if (window.scrollY > heroHeight && window.scrollY < (checkoutOffsetTop - 200)) {
            stickyCtaBar.classList.add('visible');
        } else {
            stickyCtaBar.classList.remove('visible');
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
            originalNormal: 1980,
            originalCoupon: 1480,
            name: "【體驗組】不油自主 BÜLIO 油切發泡錠 (1管/14錠)",
            shortLabel: "體驗組 (1管)",
            avgNormal: 1480,
            avgCoupon: 640
        },
        popular: {
            normalPrice: 2860,
            couponPrice: 1180,
            originalNormal: 3960,
            originalCoupon: 2860,
            name: "【熱銷組】不油自主 BÜLIO 油切發泡錠 (2管/28錠)",
            shortLabel: "熱銷組 (2管)",
            avgNormal: 1430,
            avgCoupon: 590
        },
        stockpile: {
            normalPrice: 8380,
            couponPrice: 3340,
            originalNormal: 11880,
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
        
        // Update hidden inputs
        hiddenPlanId.value = planId;
        hiddenPlanName.value = config.name;
        hiddenPlanPrice.value = finalPrice;
        
        // Format price with comma
        const formattedPrice = finalPrice.toLocaleString('en-US');
        
        // Update Order Summary
        summaryProductName.textContent = config.name;
        summaryTotalPrice.textContent = formattedPrice;
        
        // Update Sticky bottom bar info
        stickyPlanLabel.textContent = config.shortLabel;
        stickyPriceLabel.textContent = `NT$ ${formattedPrice}`;
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
                }
                if (priceSpan) {
                    priceSpan.textContent = config.couponPrice.toLocaleString('en-US');
                }
                if (avgSpan) {
                    avgSpan.textContent = config.avgCoupon.toLocaleString('en-US');
                }
                card.classList.add('discount-active');
                if (planId === 'popular') {
                    badge.textContent = `熱銷首選 (現省$2780)`;
                } else if (planId === 'stockpile') {
                    badge.textContent = `超值囤貨 (現省$8540)`;
                }
            } else {
                if (origSpan) {
                    origSpan.textContent = `原價 NT$ ${config.originalNormal.toLocaleString('en-US')}`;
                    origSpan.style.textDecoration = 'line-through';
                }
                if (priceSpan) {
                    priceSpan.textContent = config.normalPrice.toLocaleString('en-US');
                }
                if (avgSpan) {
                    avgSpan.textContent = config.avgNormal.toLocaleString('en-US');
                }
                card.classList.remove('discount-active');
                if (planId === 'popular') {
                    badge.textContent = `熱銷首選 (現省$1100)`;
                } else if (planId === 'stockpile') {
                    badge.textContent = `超值囤貨 (現省$3500)`;
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
    selectPlan(planCards[1]);

    // Coupon Code handlers
    const couponInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponMsg = document.getElementById('coupon-msg');

    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim();
        if (code === '000491') {
            isCouponApplied = true;
            couponMsg.textContent = '已成功套用優惠碼 000491，價格已折抵！';
            couponMsg.className = 'coupon-message success';
            updatePricingUI();
        } else if (code === '') {
            isCouponApplied = false;
            couponMsg.textContent = '';
            couponMsg.className = 'coupon-message';
            updatePricingUI();
        } else {
            isCouponApplied = false;
            couponMsg.textContent = '優惠碼無效';
            couponMsg.className = 'coupon-message error';
            updatePricingUI();
        }
    });

    couponInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyCouponBtn.click();
        }
    });

    // ==========================================================================
    // DYNAMIC SHIPPING & PAYMENT FIELDS
    // ==========================================================================
    // Shipping method toggle
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Update active styling
            shippingRadios.forEach(r => r.closest('.radio-card').classList.remove('active'));
            e.target.closest('.radio-card').classList.add('active');
            
            const method = e.target.value;
            if (method === 'home') {
                addressGroup.classList.remove('hidden');
                addressInput.setAttribute('required', 'required');
                storeGroup.classList.add('hidden');
                storeNameInput.removeAttribute('required');
            } else {
                addressGroup.classList.add('hidden');
                addressInput.removeAttribute('required');
                storeGroup.classList.remove('hidden');
                storeNameInput.setAttribute('required', 'required');
            }
            // Clear validation errors
            clearErrors();
        });
    });

    // Payment method toggle
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Update active styling
            paymentRadios.forEach(r => r.closest('.radio-card').classList.remove('active'));
            e.target.closest('.radio-card').classList.add('active');
            
            const method = e.target.value;
            if (method === 'credit') {
                creditCardFields.classList.remove('hidden');
                ccNumInput.setAttribute('required', 'required');
                ccExpiryInput.setAttribute('required', 'required');
                ccCvcInput.setAttribute('required', 'required');
            } else {
                creditCardFields.classList.add('hidden');
                ccNumInput.removeAttribute('required');
                ccExpiryInput.removeAttribute('required');
                ccCvcInput.removeAttribute('required');
            }
            // Clear validation errors
            clearErrors();
        });
    });

    // Credit Card inputs auto-formatting
    ccNumInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < value.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;
    });

    ccExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < value.length && i < 4; i++) {
            if (i === 2) {
                formatted += '/';
            }
            formatted += value[i];
        }
        e.target.value = formatted;
    });

    ccCvcInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });

    // ==========================================================================
    // FORM VALIDATION & SUBMISSION
    // ==========================================================================
    function clearErrors() {
        const invalidGroups = orderForm.querySelectorAll('.form-group.invalid');
        invalidGroups.forEach(g => g.classList.remove('invalid'));
    }

    function showError(elementId, errorId) {
        const group = document.getElementById(elementId).closest('.form-group');
        group.classList.add('invalid');
    }

    function validateForm() {
        let isValid = true;
        clearErrors();

        // 1. Name Check
        if (!nameInput.value.trim()) {
            showError('customer-name');
            isValid = false;
        }

        // 2. Phone Check (Taiwan cell phone: 09xx-xxx-xxx)
        const phoneRegex = /^09\d{8}$/;
        if (!phoneRegex.test(phoneInput.value.trim().replace(/-/g, ''))) {
            showError('customer-phone');
            isValid = false;
        }

        // 3. Email Check (Optional, but if filled, must be valid)
        if (emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError('customer-email');
                isValid = false;
            }
        }

        // 4. Shipping Check
        const selectedShipping = document.querySelector('input[name="shipping_method"]:checked').value;
        if (selectedShipping === 'home') {
            if (!addressInput.value.trim()) {
                showError('customer-address');
                isValid = false;
            }
        } else {
            if (!storeNameInput.value.trim()) {
                showError('store-name');
                isValid = false;
            }
        }

        // 5. Payment check (Credit card fields)
        const selectedPayment = document.querySelector('input[name="payment_method"]:checked').value;
        if (selectedPayment === 'credit') {
            const ccNum = ccNumInput.value.replace(/\s/g, '');
            const ccExpiry = ccExpiryInput.value;
            const ccCvc = ccCvcInput.value;
            
            if (ccNum.length !== 16 || ccExpiry.length !== 5 || ccCvc.length !== 3) {
                const cardGroup = document.getElementById('credit-card-fields').closest('.form-group');
                cardGroup.classList.add('invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to the first invalid field
            const firstInvalid = orderForm.querySelector('.form-group.invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Form is valid - Start simulation
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 處理訂單中...請稍候';
        
        setTimeout(() => {
            // 1. Generate Order details
            const orderDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            const generatedOrderId = `BL${orderDateStr}${randomDigits}`;
            
            const finalPlanName = hiddenPlanName.value;
            const finalPlanPrice = Number(hiddenPlanPrice.value).toLocaleString('en-US');
            const custName = nameInput.value.trim();
            const custPhone = phoneInput.value.trim();
            
            let finalDest = '';
            const shippingVal = document.querySelector('input[name="shipping_method"]:checked').value;
            if (shippingVal === 'home') {
                finalDest = addressInput.value.trim();
            } else {
                const storeName = storeNameInput.value.trim();
                const storeType = storeTypeSelect.options[storeTypeSelect.selectedIndex].text;
                finalDest = `[${storeType}] ${storeName}`;
            }
            
            let finalPaymentMethod = '';
            const paymentVal = document.querySelector('input[name="payment_method"]:checked').value;
            if (paymentVal === 'cod') finalPaymentMethod = '貨到付款';
            if (paymentVal === 'credit') finalPaymentMethod = '信用卡線上支付 (已授權)';
            if (paymentVal === 'linepay') finalPaymentMethod = 'LINE Pay (已授權)';

            // 2. Populate success modal receipt
            receiptOrderId.textContent = generatedOrderId;
            receiptPlan.textContent = finalPlanName;
            receiptTotal.textContent = `NT$ ${finalPlanPrice}`;
            receiptName.textContent = custName;
            receiptPhone.textContent = custPhone;
            receiptAddress.textContent = finalDest;
            receiptPayment.textContent = finalPaymentMethod;

            // 3. Show Success Modal
            successModal.classList.add('open');
            
            // 4. Reset Button & Form
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> 安全結帳，確認送出訂單';
            orderForm.reset();
            
            // Reset coupon state
            isCouponApplied = false;
            couponInput.value = '';
            couponMsg.textContent = '';
            couponMsg.className = 'coupon-message';
            updatePricingUI();
            
            // Reset to default featured plan
            selectPlan(planCards[1]);
            
            // Trigger radio changes to default views
            document.querySelector('input[name="shipping_method"][value="home"]').click();
            document.querySelector('input[name="payment_method"][value="cod"]').click();
            
        }, 1500);
    });

    // Close Modal Button handler
    modalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('open');
    });

    // Close Modal when clicking backdrop
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('open');
        }
    });
});
