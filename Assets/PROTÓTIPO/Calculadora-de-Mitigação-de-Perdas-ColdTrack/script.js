document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen Logic
    const splash = document.getElementById('splash');
    const mainContent = document.getElementById('main-content');
    const btnSkipSplash = document.getElementById('btn-skip-splash');
    const splashProgress = document.getElementById('splash-progress');
    
    // Simulate loading progress
    setTimeout(() => {
        if(splashProgress) splashProgress.style.width = '100%';
    }, 100);

    let splashTimeout;
    const hideSplash = () => {
        splash.classList.add('fade-out');
        mainContent.classList.add('show-fade');
        clearTimeout(splashTimeout);
    };

    splashTimeout = setTimeout(hideSplash, 1500); // 1.5 seconds

    if(btnSkipSplash) {
        btnSkipSplash.addEventListener('click', hideSplash);
    }
    
    const btnReplaySplash = document.getElementById('btn-replay-splash');
    if(btnReplaySplash) {
        btnReplaySplash.addEventListener('click', () => {
            splash.classList.remove('fade-out');
            mainContent.classList.remove('show-fade');
            if(splashProgress) {
                splashProgress.style.width = '0%';
                setTimeout(() => { splashProgress.style.width = '100%'; }, 100);
            }
            splashTimeout = setTimeout(hideSplash, 1500);
            window.scrollTo(0,0);
        });
    }

    // 2. Header Scroll & Mobile Menu
    const header = document.getElementById('header');
    const btnMenuToggle = document.getElementById('btn-menu-toggle');
    const mobileDropdown = document.getElementById('mobile-dropdown');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if(btnMenuToggle) {
        btnMenuToggle.addEventListener('click', () => {
            mobileDropdown.classList.toggle('hidden');
            btnMenuToggle.textContent = mobileDropdown.classList.contains('hidden') ? '☰' : '✕';
        });
    }

    window.closeMenu = () => {
        mobileDropdown.classList.add('hidden');
        if(btnMenuToggle) btnMenuToggle.textContent = '☰';
    };

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
            }
        });
    });

    // 3. Modals Manager
    const modals = {
        specialist: document.getElementById('modal-specialist'),
        presentation: document.getElementById('modal-presentation'),
        calculator: document.getElementById('modal-calculator'),
        text: document.getElementById('modal-text')
    };

    const openModal = (id) => {
        if (modals[id]) {
            modals[id].classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            closeMenu();
        }
    };

    const closeAllModals = () => {
        Object.values(modals).forEach(m => m && m.classList.add('hidden'));
        document.body.style.overflow = '';
    };

    // Close buttons logic
    document.querySelectorAll('.btn-close, .modal-overlay, .btn-close-text').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Binding buttons to modals
    const bindings = [
        { triggers: ['btn-header-especialista', 'btn-mobile-especialista', 'btn-mobile-specialist-menu', 'btn-footer-especialista'], target: 'specialist' },
        { triggers: ['btn-hero-apresentacao'], target: 'presentation' },
        { triggers: ['btn-open-calc-nav', 'btn-mobile-calc', 'btn-banner-calc', 'btn-slide-calc'], target: 'calculator' }
    ];

    bindings.forEach(bind => {
        bind.triggers.forEach(triggerId => {
            const el = document.getElementById(triggerId);
            if(el) {
                el.addEventListener('click', () => {
                    openModal(bind.target);
                    // Special case for presentation to calc
                    if(triggerId === 'btn-slide-calc') {
                        modals['presentation'].classList.add('hidden');
                    }
                });
            }
        });
    });

    // Text modals binding
    const termsContent = `
        <h4 class="font-bold text-main mb-s">1. Aceitação dos Termos</h4>
        <p class="mb-m">Ao acessar e usar a plataforma IoT Safe Meat, você concorda em cumprir e estar vinculado aos seguintes termos de uso.</p>
        <h4 class="font-bold text-main mb-s">2. Uso do Serviço</h4>
        <p class="mb-m">A plataforma destina-se estritamente ao monitoramento de cargas frigorificadas em ambientes B2B. A precisão dos dados depende da instalação correta dos sensores homologados.</p>
        <h4 class="font-bold text-main mb-s">3. Isenção de Garantias</h4>
        <p>A Safe Meat fornece telemetria e alertas preditivos como meio de apoio à decisão, não substituindo inspeções sanitárias governamentais (MAPA/SIF).</p>
    `;
    const privacyContent = `
        <h4 class="font-bold text-main mb-s">1. Coleta de Dados</h4>
        <p class="mb-m">Coletamos exclusivamente dados de telemetria higrotérmica dos baús frigoríficos, geolocalização da frota e dados corporativos (B2B) para faturamento e login.</p>
        <h4 class="font-bold text-main mb-s">2. Uso e Compartilhamento</h4>
        <p class="mb-m">Os dados sensíveis de temperatura e rota são confidenciais ao cliente. Não vendemos ou compartilhamos dados logísticos com terceiros não autorizados.</p>
        <h4 class="font-bold text-main mb-s">3. Armazenamento Seguro</h4>
        <p>Todos os registros de telemetria são mantidos em banco de dados seguro, com trilhas de auditoria criptografadas que atestam a imutabilidade da informação para fins de compliance sanitário.</p>
    `;

    const openTextModal = (title, content) => {
        document.getElementById('modal-text-title').innerText = title;
        document.getElementById('modal-text-body').innerHTML = content;
        openModal('text');
    };

    document.getElementById('btn-footer-terms')?.addEventListener('click', () => openTextModal('Termos de Uso', termsContent));
    document.getElementById('btn-footer-privacy')?.addEventListener('click', () => openTextModal('Política de Privacidade', privacyContent));

    // Scroll to Top
    document.getElementById('btn-scroll-top')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Specialist Form Logic
    const formSpec = document.getElementById('form-specialist');
    const specSuccess = document.getElementById('specialist-success');
    const btnSpecClose = document.getElementById('btn-specialist-close');

    if(formSpec) {
        formSpec.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('spec-name').value;
            const email = document.getElementById('spec-email').value;
            document.getElementById('success-name').innerText = name.split(' ')[0];
            document.getElementById('success-email').innerText = email;
            
            formSpec.classList.add('hidden');
            specSuccess.classList.remove('hidden');
        });
    }

    if(btnSpecClose) {
        btnSpecClose.addEventListener('click', () => {
            closeAllModals();
            setTimeout(() => {
                formSpec.reset();
                formSpec.classList.remove('hidden');
                specSuccess.classList.add('hidden');
            }, 300);
        });
    }

    // 5. Presentation Carousel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const btnPrevSlide = document.getElementById('btn-prev-slide');
    const btnNextSlide = document.getElementById('btn-next-slide');

    const updateSlides = () => {
        slides.forEach((s, i) => {
            if(i === currentSlide) {
                s.classList.remove('hidden');
            } else {
                s.classList.add('hidden');
            }
        });
        
        dots.forEach((d, i) => {
            if(i === currentSlide) d.classList.add('active');
            else d.classList.remove('active');
        });

        if(btnPrevSlide) btnPrevSlide.disabled = currentSlide === 0;
        if(btnNextSlide) {
            if (currentSlide === slides.length - 1) {
                btnNextSlide.style.display = 'none';
            } else {
                btnNextSlide.style.display = 'block';
            }
        }
    };

    if(btnPrevSlide) {
        btnPrevSlide.addEventListener('click', () => {
            if(currentSlide > 0) { currentSlide--; updateSlides(); }
        });
    }
    if(btnNextSlide) {
        btnNextSlide.addEventListener('click', () => {
            if(currentSlide < slides.length - 1) { currentSlide++; updateSlides(); }
        });
    }
    dots.forEach((d, i) => {
        d.addEventListener('click', () => { currentSlide = i; updateSlides(); });
    });


    // 6. Calculator Logic
    const calcTipoCarne = document.getElementById('calc-tipo-carne');
    const calcTransporte = document.getElementsByName('transporte');
    const calcPesoRange = document.getElementById('calc-peso-range');
    const calcPesoDisplay = document.getElementById('calc-peso-display');
    const calcViagens = document.getElementById('calc-viagens');
    
    const outTotal = document.getElementById('calc-total');
    const outPerdaFrio = document.getElementById('calc-perda-frio');
    const outPerdaAgua = document.getElementById('calc-perda-agua');
    const outMensal = document.getElementById('calc-mensal');
    const outAnual = document.getElementById('calc-anual');
    const viagensLabel = document.getElementById('calc-viagens-label');

    const detailsResfriada = document.getElementById('resfriada-details');
    const detailsCongelada = document.getElementById('congelada-details');

    const formatBRL = (val) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatNum = (val) => {
        return val.toLocaleString('pt-BR');
    };

    const updateCalculator = () => {
        // Obter valores
        let precoBase = 32.0; // Bovina
        const tipoVal = calcTipoCarne.value;
        if(tipoVal === 'Suína') precoBase = 18.0;
        else if(tipoVal === 'Aves') precoBase = 11.0;
        else if(tipoVal === 'Outros') precoBase = 20.0;

        let transporteVal = 'Resfriada';
        for(const radio of calcTransporte) {
            if(radio.checked) transporteVal = radio.value;
        }

        const pesoTotal = parseInt(calcPesoRange.value, 10);
        const viagens = parseInt(calcViagens.value, 10) || 1;

        // Atualizar display do peso
        calcPesoDisplay.innerText = `${formatNum(pesoTotal)} kg`;
        viagensLabel.innerText = viagens;

        // Math
        const valorTotalCarga = pesoTotal * precoBase;
        
        let perdaCadeiaFrio = 0;
        let pesoEvaporadoKg = 0;
        let perdaDesidratacao = 0;

        if (transporteVal === 'Resfriada') {
            perdaCadeiaFrio = valorTotalCarga * 0.12; // 12%
            pesoEvaporadoKg = pesoTotal * 0.02; // 2%
            perdaDesidratacao = pesoEvaporadoKg * precoBase;
            
            detailsResfriada.classList.remove('hidden');
            detailsCongelada.classList.add('hidden');
        } else {
            // Congelada: Perda térmica nula para a simulação original, apenas sublimação leve (2%)
            perdaCadeiaFrio = 0; 
            pesoEvaporadoKg = pesoTotal * 0.02;
            perdaDesidratacao = pesoEvaporadoKg * precoBase;
            
            detailsResfriada.classList.add('hidden');
            detailsCongelada.classList.remove('hidden');
        }

        const totalEvitado = perdaCadeiaFrio + perdaDesidratacao;
        const mensal = totalEvitado * viagens;
        const anual = mensal * 12;

        // Exibir resultados
        outTotal.innerText = formatBRL(totalEvitado);
        outPerdaFrio.innerText = formatBRL(perdaCadeiaFrio);
        outPerdaAgua.innerText = formatBRL(perdaDesidratacao);
        outMensal.innerText = formatBRL(mensal);
        outAnual.innerText = formatBRL(anual);
    };

    // Listeners
    if(calcTipoCarne) calcTipoCarne.addEventListener('change', updateCalculator);
    if(calcPesoRange) calcPesoRange.addEventListener('input', updateCalculator);
    if(calcViagens) calcViagens.addEventListener('input', updateCalculator);
    for(const radio of calcTransporte) {
        radio.addEventListener('change', updateCalculator);
    }

    // Inicializar calculadora
    if(calcTipoCarne) updateCalculator();
});
