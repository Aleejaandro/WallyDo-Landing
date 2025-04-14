document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    
    // Código para el menú hamburguesa en dispositivos móviles
    const hamburgerButton = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', function() {
            this.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
        });

        // También cerrar el menú cuando se hace clic en un enlace del menú móvil
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerButton.classList.remove('is-active');
                mobileMenu.classList.remove('is-active');
            });
        });
    }
    
    // NUEVO: Configuración del carrusel de comparativa
    function setupComparisonCarousel() {
        const comparisonGrid = document.querySelector('.comparison-grid');
        if (!comparisonGrid) return;
        
        const comparisonSection = document.querySelector('.comparison-section');
        const cards = comparisonGrid.querySelectorAll('.comparison-card');
        const comparisonBackground = document.querySelector('.comparison-background');
        
        if (cards.length <= 0) return;
        
        // Determinar si estamos en móvil
        const isMobile = window.innerWidth <= 768;
        
        // Asegurarse de que el fondo tenga la imagen correcta
        if (comparisonBackground && !comparisonBackground.style.backgroundImage) {
            comparisonBackground.style.backgroundImage = 'url("assets/img/comparison-bg.jpg")';
        }
        
        if (!isMobile) return;
        
        // Añadir fondo personalizado a la sección
        if (comparisonSection) {
            // Aplicar estilo para el fondo
            comparisonSection.style.position = 'relative';
            comparisonSection.style.zIndex = '1';
            
            // Comprobar si ya existe un fondo
            if (!document.querySelector('.comparison-background')) {
                // Crear elemento de fondo
                const backgroundElement = document.createElement('div');
                backgroundElement.className = 'comparison-background';
                backgroundElement.style.position = 'absolute';
                backgroundElement.style.top = '0';
                backgroundElement.style.left = '0';
                backgroundElement.style.width = '100%';
                backgroundElement.style.height = '100%';
                backgroundElement.style.zIndex = '-1';
                backgroundElement.style.opacity = '0.15';
                backgroundElement.style.backgroundSize = 'cover';
                backgroundElement.style.backgroundPosition = 'center';
                backgroundElement.style.backgroundRepeat = 'no-repeat';
                backgroundElement.style.backgroundImage = 'url("assets/img/comparison-bg.jpg")';
                
                // Insertar antes del primer hijo
                comparisonSection.insertBefore(backgroundElement, comparisonSection.firstChild);
            }
        }
        
        // Destacar la tarjeta de WallyDo
        cards.forEach(card => {
            if (card.querySelector('.product-name')?.textContent.includes('WallyDo')) {
                card.classList.add('wallydo');
            }
        });
        
        // Crear indicadores de carrusel
        let indicatorsHTML = '';
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'comparison-carousel-indicators';
        
        cards.forEach((_, index) => {
            indicatorsHTML += `<div class="comparison-indicator ${index === 0 ? 'active' : ''}"></div>`;
        });
        
        indicatorsContainer.innerHTML = indicatorsHTML;
        
        // Verificar si ya existe un contenedor de indicadores
        const existingIndicators = comparisonSection.querySelector('.comparison-carousel-indicators');
        if (!existingIndicators) {
            if (comparisonSection) {
                comparisonSection.appendChild(indicatorsContainer);
            } else if (comparisonGrid.parentNode) {
                comparisonGrid.parentNode.appendChild(indicatorsContainer);
            }
        }
        
        // Agregar eventos a los indicadores
        const indicators = document.querySelectorAll('.comparison-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Calcular posición a desplazar
                const cardWidth = cards[0].offsetWidth;
                const margin = parseInt(window.getComputedStyle(cards[0]).marginRight) || 0;
                const scrollPosition = (cardWidth + margin) * index;
                
                // Desplazar al elemento correcto con animación suave
                comparisonGrid.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar indicador activo
                indicators.forEach(ind => ind.classList.remove('active'));
                indicator.classList.add('active');
            });
        });
        
        // Actualizar indicador activo al desplazarse
        comparisonGrid.addEventListener('scroll', () => {
            // Usar debounce para mejor rendimiento
            clearTimeout(comparisonGrid.scrollTimeout);
            comparisonGrid.scrollTimeout = setTimeout(() => {
                const scrollPosition = comparisonGrid.scrollLeft;
                const cardWidth = cards[0].offsetWidth;
                const margin = parseInt(window.getComputedStyle(cards[0]).marginRight) || 0;
                
                // Calcular qué tarjeta es más visible
                const currentIndex = Math.round(scrollPosition / (cardWidth + margin));
                
                if (currentIndex >= 0 && currentIndex < indicators.length) {
                    indicators.forEach((ind, i) => {
                        ind.classList.toggle('active', i === currentIndex);
                    });
                }
            }, 50);
        });
        
        // Animación del indicador al cargar la página
        if (comparisonSection) {
            // Ocultar después de 3 segundos (la primera vez)
            setTimeout(() => {
                comparisonSection.style.setProperty('--indicator-opacity', '0');
            }, 3000);
        }
    }
    
    // Llamar a la función cuando la página esté lista
    setupComparisonCarousel();
    
    // Volver a configurar al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        setTimeout(setupComparisonCarousel, 200);
    });
    
    // Mobile Popups para la sección "Cómo funciona"
    document.addEventListener('DOMContentLoaded', function() {
        // Solo aplicar en dispositivos móviles
        const isMobile = window.innerWidth < 992;
        
        if (isMobile) {
            setupMobilePopup();
            
            // Actualizar cuando cambie el tamaño de la ventana
            window.addEventListener('resize', function() {
                const newIsMobile = window.innerWidth < 992;
                
                if (newIsMobile !== isMobile) {
                    location.reload(); // Recargar para aplicar los cambios correctamente
                }
            });
        }
        
        function setupMobilePopup() {
            // Crear el overlay y popup solo si aún no existen
            if (!document.querySelector('.popup-overlay')) {
                const popupOverlay = document.createElement('div');
                popupOverlay.className = 'popup-overlay';
                document.body.appendChild(popupOverlay);
                
                const mobilePopup = document.createElement('div');
                mobilePopup.className = 'mobile-popup';
                mobilePopup.innerHTML = `
                    <button class="popup-close">&times;</button>
                    <div class="popup-icon"></div>
                    <h3 class="popup-title"></h3>
                    <p class="popup-description"></p>
                `;
                document.body.appendChild(mobilePopup);
                
                // Agregar evento para cerrar el popup
                const closeBtn = mobilePopup.querySelector('.popup-close');
                closeBtn.addEventListener('click', closePopup);
                
                // Cerrar el popup cuando se hace clic en el overlay
                popupOverlay.addEventListener('click', closePopup);
                
                // Manejar tecla ESC para cerrar el popup
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && document.querySelector('.popup-overlay.active')) {
                        closePopup();
                    }
                });
            }
            
            // Agregar eventos a los pasos del timeline
            const timelineSteps = document.querySelectorAll('.timeline-step');
            
            timelineSteps.forEach(step => {
                const stepIcon = step.querySelector('.step-icon');
                const stepTitle = step.querySelector('.step-title');
                const stepDescription = step.querySelector('.step-description');
                
                if (stepIcon) {
                    stepIcon.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Obtener contenido del paso
                        const iconImg = stepIcon.querySelector('img');
                        const title = stepTitle ? stepTitle.textContent : '';
                        const description = stepDescription ? stepDescription.textContent : '';
                        
                        // Mostrar popup con el contenido
                        showPopup(iconImg.src, title, description);
                    });
                }
            });
        }
        
        function showPopup(iconSrc, title, description) {
            const popup = document.querySelector('.mobile-popup');
            const overlay = document.querySelector('.popup-overlay');
            const popupIcon = popup.querySelector('.popup-icon');
            const popupTitle = popup.querySelector('.popup-title');
            const popupDescription = popup.querySelector('.popup-description');
            
            // Configurar contenido
            popupIcon.innerHTML = `<img src="${iconSrc}" alt="${title}">`;
            popupTitle.textContent = title;
            popupDescription.textContent = description;
            
            // Activar popup
            popup.classList.add('active');
            overlay.classList.add('active');
            
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
        
        function closePopup() {
            const popup = document.querySelector('.mobile-popup');
            const overlay = document.querySelector('.popup-overlay');
            const closeButton = document.querySelector('.popup-close');
            
            if (closeButton) {
                closeButton.style.transform = 'rotate(90deg)';
                
                setTimeout(() => {
                    if (popup) {
                        popup.style.opacity = '0';
                        popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                    }
                    
                    if (overlay) {
                        overlay.style.opacity = '0';
                    }
                    
                    setTimeout(() => {
                        if (popup) popup.remove();
                        if (overlay) overlay.remove();
                        document.body.style.overflow = 'auto';
                    }, 300);
                }, 150);
            } else {
                if (popup) {
                    popup.style.opacity = '0';
                    popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                }
                
                if (overlay) {
                    overlay.style.opacity = '0';
                }
                
                setTimeout(() => {
                    if (popup) popup.remove();
                    if (overlay) overlay.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        }
    });
    
    // Configuración del carrusel de características
    const featuresGrid = document.querySelector('.features-grid');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    if (featuresGrid && indicatorDots.length > 0) {
        // Variables para detectar el deslizamiento
        let startX, scrollLeft, isDragging = false;
        let itemWidth = 0;
        let totalItems = 0;
        
        // Función para inicializar el carrusel
        function initCarousel() {
            // Obtener el ancho de los elementos y la cantidad
            if (featuresGrid.children.length > 0) {
                const firstItem = featuresGrid.children[0];
                // Calcular el ancho real incluyendo el margen
                const style = window.getComputedStyle(firstItem);
                const marginLeft = parseInt(style.marginLeft) || 0;
                const marginRight = parseInt(style.marginRight) || 0;
                
                itemWidth = firstItem.offsetWidth + marginRight + marginLeft;
                totalItems = featuresGrid.children.length;
                
                console.log('Ancho calculado del elemento:', itemWidth);
                console.log('Total de elementos:', totalItems);
                
                // Eliminar la clase active de todos los indicadores primero
                indicatorDots.forEach(dot => dot.classList.remove('active', 'completed'));
                
                // Asignar active al primer indicador
                if (indicatorDots[0]) {
                    indicatorDots[0].classList.add('active');
                }
            }
        }
        
        // Actualizar el indicador activo según la posición del scroll
        function updateIndicators() {
            if (!featuresGrid || !indicatorDots.length) return;
            
            const scrollPosition = featuresGrid.scrollLeft;
            const containerWidth = featuresGrid.offsetWidth;
            
            console.log('Posición de scroll:', scrollPosition);
            
            // Calcular qué elemento es más visible en el centro del viewport
            const currentIndex = Math.round(scrollPosition / itemWidth);
            
            console.log('Índice calculado:', currentIndex);
            
            // Actualizar los indicadores solo si el índice es válido
            if (currentIndex >= 0 && currentIndex < indicatorDots.length) {
                // Limpiar todas las clases primero
                indicatorDots.forEach((dot, i) => {
                    dot.classList.remove('active', 'completed');
                    
                    if (i < currentIndex) {
                        dot.classList.add('completed');
                    } else if (i === currentIndex) {
                        dot.classList.add('active');
                    }
                });
            }
        }
        
        // Evento de redimensionamiento de ventana
        window.addEventListener('resize', () => {
            // Reinicializar el carrusel si cambia el tamaño de la ventana
            setTimeout(initCarousel, 300);
            setTimeout(updateIndicators, 350);
        });
        
        // Detectar inicio del arrastre
        featuresGrid.addEventListener('touchstart', () => {
            console.log('touchstart detectado');
        }, {passive: true});
        
        // Detectar fin del arrastre
        featuresGrid.addEventListener('touchend', () => {
            console.log('touchend detectado');
            setTimeout(updateIndicators, 150);
        }, {passive: true});
        
        // Detectar movimiento del mouse
        featuresGrid.addEventListener('mouseup', () => {
            setTimeout(updateIndicators, 150);
        });
        
        // Añadir evento para detectar el scroll del carrusel
        featuresGrid.addEventListener('scroll', () => {
            // Usar debounce para no llamar updateIndicators en cada evento scroll
            clearTimeout(featuresGrid.scrollTimeout);
            featuresGrid.scrollTimeout = setTimeout(() => {
                updateIndicators();
            }, 50);
        });
        
        // Permitir hacer clic en los indicadores para navegar
        indicatorDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log('Clic en indicador:', index);
                
                // Calcular la posición exacta a la que se debe desplazar
                const scrollToPosition = index * itemWidth;
                
                // Desplazar el carrusel
                featuresGrid.scrollTo({
                    left: scrollToPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar visualmente los indicadores inmediatamente para feedback
                indicatorDots.forEach((d, i) => {
                    d.classList.remove('active', 'completed');
                    if (i < index) {
                        d.classList.add('completed');
                    } else if (i === index) {
                        d.classList.add('active');
                    }
                });
            });
        });
        
        // Inicializar el carrusel después de cargar la página
        setTimeout(initCarousel, 100);
        
        // Ejecutar updateIndicators después de la carga completa
        window.addEventListener('load', () => {
            setTimeout(updateIndicators, 300);
        });
    }
    
    // Solo continuar con la configuración del formulario si existe
    if (form) {
        const steps = form.querySelectorAll('.form-step');
        const nextButtons = form.querySelectorAll('.next-btn');
        const prevButtons = form.querySelectorAll('.prev-btn');
        const progressSteps = document.querySelectorAll('.progress-step');
        const thanksMessage = document.getElementById('thanks-message');
        let currentFormStep = 0;

        // Configuración del slider de características
        const slides = document.querySelectorAll('.description-slide');
        const dots = document.querySelectorAll('.nav-dot');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');
        
        // Solo configurar el slider si los elementos necesarios existen
        if (slides.length > 0 && prevArrow && nextArrow) {
            let currentSlide = 0;
            const totalSlides = slides.length;

            // Función para mostrar un slide específico
            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                currentSlide = (index + totalSlides) % totalSlides;
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');

                // Actualizar estado de las flechas
                prevArrow.style.opacity = currentSlide === 0 ? '0.3' : '1';
                nextArrow.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
            }

            // Event listeners para las flechas
            prevArrow.addEventListener('click', () => {
                if (currentSlide > 0) {
                    showSlide(currentSlide - 1);
                }
            });

            nextArrow.addEventListener('click', () => {
                if (currentSlide < totalSlides - 1) {
                    showSlide(currentSlide + 1);
                }
            });

            // Event listeners para los puntos de navegación
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        showSlide(index);
                    });
                });
            }

            // Inicializar el primer slide
            showSlide(0);
        }

        // Añadir funcionalidad al scroll indicator
        const scrollIndicator = document.querySelector('.hero .scroll-indicator');
        if (scrollIndicator) {
            // scrollIndicator.style.cursor = 'pointer'; // Ya no es necesario el cursor pointer
        }

        // Añadir funcionalidad al segundo scroll indicator
        const betaScrollIndicator = document.querySelector('.beta-cta .scroll-indicator');
        if (betaScrollIndicator) {
            betaScrollIndicator.style.cursor = 'pointer';
            betaScrollIndicator.addEventListener('click', () => {
                const formSection = document.querySelector('.form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        function updateProgress(step) {
            progressSteps.forEach((progressStep, index) => {
                if (index < step) {
                    progressStep.classList.add('completed');
                    progressStep.classList.remove('active');
                } else if (index === step) {
                    progressStep.classList.add('active');
                    progressStep.classList.remove('completed');
                } else {
                    progressStep.classList.remove('completed', 'active');
                }
            });
        }

        function showStep(stepIndex) {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
                step.style.display = index === stepIndex ? 'block' : 'none';
            });
            currentFormStep = stepIndex;
            updateProgress(stepIndex);

            // Ocultar todos los mensajes de error al cambiar de paso
            const currentStep = steps[stepIndex];
            currentStep.querySelectorAll('.required-error').forEach(error => {
                error.style.display = 'none';
            });
        }

        function scrollToForm() {
            const formSection = document.querySelector('.form-section');
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function validateStep(step) {
            const groups = step.querySelectorAll('.question-group');
            let isValid = true;
            let firstErrorElement = null;

            groups.forEach(group => {
                const hasRedAsterisk = group.querySelector('label span[style*="color: red"]');
                if (hasRedAsterisk) {
                    const isGroupValid = validateQuestionGroup(group);
                    if (!isGroupValid && !firstErrorElement) {
                        firstErrorElement = group;
                    }
                    isValid = isValid && isGroupValid;
                }
            });

            if (!isValid && firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return isValid;
        }

        function validateQuestionGroup(group) {
            const inputs = group.querySelectorAll('input[type="radio"], input[type="checkbox"], textarea');
            const errorMessage = group.querySelector('.required-error');
            let isValid = false;

            // Verificar si el grupo tiene una opción "otro"
            const hasOtroOption = Array.from(inputs).some(input => input.value === 'otro');

            if (inputs[0].type === 'radio') {
                const checkedInput = Array.from(inputs).find(input => input.checked);
                
                // Si no hay ninguna opción seleccionada
                if (!checkedInput) {
                    isValid = false;
                    // No añadir clase error al grupo
                    // group.classList.add('error');
                    if (errorMessage) errorMessage.style.display = 'block';
                } 
                // Si hay una opción seleccionada
                else {
                    if (checkedInput.value === 'otro') {
                        const otroInput = checkedInput.parentElement.querySelector('.otro-input');
                        if (otroInput) {
                            const otroValid = otroInput.value.trim() !== '';
                            otroInput.classList.toggle('error', !otroValid);
                            isValid = otroValid;
                            // Si "otro" está seleccionado pero el texto está vacío
                            if (!otroValid) {
                                // No añadir clase error al grupo
                                // group.classList.add('error');
                                if (errorMessage) errorMessage.style.display = 'block';
                            } else {
                                // group.classList.remove('error');
                                if (errorMessage) errorMessage.style.display = 'none';
                            }
                        }
                    } else {
                        isValid = true;
                        // group.classList.remove('error');
                        if (errorMessage) errorMessage.style.display = 'none';
                        
                        // Resetear error en cualquier campo "otro" que pueda existir
                        const otroInputs = group.querySelectorAll('.otro-input');
                        otroInputs.forEach(input => input.classList.remove('error'));
                    }
                }
            } else if (inputs[0].type === 'checkbox') {
                const checkedInputs = Array.from(inputs).filter(input => input.checked);
                
                // Si no hay ninguna opción seleccionada
                if (checkedInputs.length === 0) {
                    isValid = false;
                    // No añadir clase error al grupo
                    // group.classList.add('error');
                    if (errorMessage) errorMessage.style.display = 'block';
                } else {
                    isValid = true;
                    // group.classList.remove('error');
                    if (errorMessage) errorMessage.style.display = 'none';

                    // Si hay opción "otro" seleccionada, validar su texto
                    const otroChecked = checkedInputs.find(input => input.value === 'otro');
                    if (otroChecked) {
                        const otroInput = otroChecked.parentElement.querySelector('.otro-input');
                        if (otroInput) {
                            const otroValid = otroInput.value.trim() !== '';
                            otroInput.classList.toggle('error', !otroValid);
                            if (!otroValid) {
                                isValid = false;
                                // No añadir clase error al grupo
                                // group.classList.add('error');
                                if (errorMessage) errorMessage.style.display = 'block';
                            }
                        }
                    } else {
                        // Resetear error en cualquier campo "otro" que pueda existir
                        const otroInputs = group.querySelectorAll('.otro-input');
                        otroInputs.forEach(input => input.classList.remove('error'));
                    }
                }
            } else if (inputs[0].nodeName.toLowerCase() === 'textarea') {
                isValid = inputs[0].value.trim() !== '';
                // No añadir o quitar clase error al grupo
                // group.classList.toggle('error', !isValid);
                if (errorMessage) errorMessage.style.display = isValid ? 'none' : 'block';
            }

            return isValid;
        }

        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function getFormData() {
            const formData = {};

            ['edad', 'ocupacion', 'organizacion', 'agobio', 'asistente_opinion', 'personalidad', 'participacion'].forEach(name => {
                const selected = document.querySelector(`input[name="${name}"]:checked`);
                if (selected) {
                    formData[name] = selected.value;
                    if (selected.value === 'otro') {
                        const otroInput = selected.parentElement.querySelector('.otro-input');
                        if (otroInput && otroInput.value) {
                            formData[name] = otroInput.value;
                        }
                    }
                }
            });

            ['herramientas', 'problemas', 'funciones'].forEach(name => {
                const checked = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`));
                formData[name] = checked.map(input => {
                    if (input.value === 'otro') {
                        const otroInput = input.parentElement.querySelector('.otro-input');
                        return otroInput && otroInput.value ? otroInput.value : 'otro';
                    }
                    return input.value;
                });
            });

            ['habitos_cuestan', 'sugerencias'].forEach(name => {
                const textarea = document.querySelector(`textarea[name="${name}"]`);
                if (textarea) {
                    formData[name] = textarea.value;
                }
            });

            const email = document.querySelector('input[type="email"]');
            if (email) {
                formData.email = email.value;
            }

            return formData;
        }

        // Event listeners para los botones de navegación
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = steps[currentFormStep];
                if (validateStep(currentStep)) {
                    showStep(currentFormStep + 1);
                    scrollToForm();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                showStep(currentFormStep - 1);
                scrollToForm();
            });
        });
      
        form.addEventListener('submit', function(e) {
            console.log('Evento submit detectado');
            e.preventDefault();

            // Validar todos los pasos antes de enviar
            let isValid = true;
            for (let i = 0; i < steps.length; i++) {
                console.log(`Validando paso ${i}`);
                if (!validateStep(steps[i])) {
                    console.log(`Validación fallida en paso ${i}`);
                    isValid = false;
                    showStep(i);
                    scrollToForm();
                    
                    // Mostrar mensajes de error para todas las preguntas obligatorias no contestadas
                    const groups = steps[i].querySelectorAll('.question-group');
                    groups.forEach(group => {
                        const hasRedAsterisk = group.querySelector('label span[style*="color: red"]');
                        if (hasRedAsterisk) {
                            validateQuestionGroup(group);
                        }
                    });
                    
                    break;
                }
            }

            if (!isValid) {
                console.log('Validación fallida - formulario no enviado');
                return;
            }

            console.log('Validación exitosa - enviando formulario');
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }

            const formData = getFormData();
            console.log('Datos del formulario:', formData);

            // Mostrar el mensaje de gracias
            if (thanksMessage) {
                console.log('Mostrando mensaje de gracias');
                thanksMessage.classList.add('show');
                
                // Redirigir a la página principal después de unos segundos
                setTimeout(() => {
                    console.log('Redirigiendo a la página principal');
                    window.location.href = '../index.html';
                }, 5000); // Tiempo suficiente para leer el mensaje
            }

            // Enviar datos a Google Sheets
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzm2inGDocC8b7582kfY5n_fuN4AZMvwAThFKquj3RYWQzWtpA8kp-Qts9AQW6D0VDO/exec';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
            });

            // Guardar en localStorage
            localStorage.setItem('wallydo_form_data', JSON.stringify(formData));
            localStorage.setItem('wallydo_form_submitted', new Date().toISOString());

            // Esperar 7 segundos antes de ocultar el mensaje y redirigir
            setTimeout(() => {
                console.log('Timeout ejecutado');
                if (thanksMessage) {
                    thanksMessage.classList.remove('show');
                }
                
                // Resetear el formulario
                form.reset();
                showStep(0);
                currentFormStep = 0;
                
                // Redirigir al inicio de la página
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = '¡Únete a la Beta!';
                }
            }, 7000);
        });

        // Actualizar el manejo de los campos "otro"
        document.querySelectorAll('.otro-option input[type="radio"], .otro-option input[type="checkbox"]').forEach(input => {
            const otroInput = input.parentElement.querySelector('.otro-input');
            if (otroInput) {
                input.addEventListener('change', () => {
                    otroInput.disabled = !input.checked;
                    if (input.checked) {
                        otroInput.focus();
                        // Si el input está seleccionado pero vacío, mostrar error inmediatamente
                        if (otroInput.value.trim() === '') {
                            otroInput.classList.add('error');
                        } else {
                            otroInput.classList.remove('error');
                        }
                    } else {
                        otroInput.classList.remove('error');
                    }
                    validateQuestionGroup(input.closest('.question-group'));
                });

                // Validar cuando se escribe en el campo de texto
                otroInput.addEventListener('input', () => {
                    const isEmpty = otroInput.value.trim() === '';
                    otroInput.classList.toggle('error', isEmpty);
                    validateQuestionGroup(input.closest('.question-group'));
                });
            }
        });

        // Validación en tiempo real para todos los inputs
        steps.forEach(step => {
            const groups = step.querySelectorAll('.question-group');
            groups.forEach(group => {
                const hasRedAsterisk = group.querySelector('label span[style*="color: red"]');
                if (hasRedAsterisk) {
                    const inputs = group.querySelectorAll('input[type="radio"], input[type="checkbox"], input[type="text"]:not(.otro-input), textarea');
                    inputs.forEach(input => {
                        input.addEventListener('change', () => {
                            validateQuestionGroup(group);
                        });
                    });
                }
            });
        });

        showStep(currentFormStep);

        // Intersection Observer para el efecto de fade-in
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observar todas las secciones
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Navegación suave para los enlaces del toolbar
        const navLinks = document.querySelectorAll('.toolbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                
                // Verificar si estamos en la página del formulario
                const isFormPage = document.body.classList.contains('form-page');
                
                if (isFormPage) {
                    // Si estamos en form-light.html, navegar a index-light.html con el anchor
                    // y un parámetro para indicar que debe centrar la sección
                    const sectionId = targetId.split('#')[1];
                    localStorage.setItem('scrollToSection', sectionId);
                    window.location.href = targetId;
                } else {
                    // Si estamos en la misma página, hacer scroll suave
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // Calcular posición para centrar la sección en la pantalla
                        const windowHeight = window.innerHeight;
                        const sectionHeight = targetSection.offsetHeight;
                        const offsetPosition = targetSection.offsetTop - (windowHeight - sectionHeight) / 2;
                        
                        // Asegurar que no se desplaza demasiado arriba (mantener al menos el toolbar visible)
                        const minOffset = targetSection.offsetTop - 70; // Altura del toolbar
                        const scrollPosition = Math.max(offsetPosition, minOffset);
                        
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Navegación suave para el logo del toolbar
        const logoHomeLink = document.getElementById('logo-home-link');
        if (logoHomeLink) {
            logoHomeLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Verificar si estamos en la página del formulario
                const isFormPage = document.body.classList.contains('form-page');
                
                if (isFormPage) {
                    // Si estamos en form-light.html, navegar a index.html (ruta corregida)
                    window.location.href = "../index.html";
                } else {
                    // Si estamos en la misma página, hacer scroll al inicio
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
    
    // Verificar si hay una sección a la que desplazarse desde localStorage
    const sectionToScroll = localStorage.getItem('scrollToSection');
    if (sectionToScroll) {
        // Limpiar el localStorage para evitar desplazamientos no deseados en futuras cargas
        localStorage.removeItem('scrollToSection');
        
        // Esperar a que la página se cargue completamente
        setTimeout(() => {
            const targetSection = document.getElementById(sectionToScroll);
            if (targetSection) {
                // Calcular posición para centrar la sección en la pantalla
                const windowHeight = window.innerHeight;
                const sectionHeight = targetSection.offsetHeight;
                const offsetPosition = targetSection.offsetTop - (windowHeight - sectionHeight) / 2;
                
                // Asegurar que no se desplaza demasiado arriba (mantener al menos el toolbar visible)
                const minOffset = targetSection.offsetTop - 70; // Altura del toolbar
                const scrollPosition = Math.max(offsetPosition, minOffset);
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }, 500); // Pequeño retraso para asegurar que todos los elementos están cargados
    }

    // Inicializar los popups de la sección Cómo funciona
    function initComoFuncionaPopups() {
        const isMobile = window.innerWidth < 992;
        const timelineSteps = document.querySelectorAll('.timeline-step');
        
        // Verificar si ya existe el popup para evitar duplicados
        let popupOverlay = document.querySelector('.popup-overlay');
        let mobilePopup = document.querySelector('.mobile-popup');
        
        // Crear el popup solo si estamos en vista móvil y no existe aún
        if (isMobile && (!popupOverlay || !mobilePopup)) {
            // Crear overlay del popup
            popupOverlay = document.createElement('div');
            popupOverlay.className = 'popup-overlay';
            document.body.appendChild(popupOverlay);
            
            // Crear el popup
            mobilePopup = document.createElement('div');
            mobilePopup.className = 'mobile-popup';
            mobilePopup.innerHTML = `
                <button class="popup-close">&times;</button>
                <div class="popup-icon"></div>
                <h3 class="popup-title"></h3>
                <p class="popup-description"></p>
            `;
            document.body.appendChild(mobilePopup);
            
            // Evento para cerrar el popup al hacer clic en el overlay
            popupOverlay.addEventListener('click', closePopup);
            
            // Evento para cerrar el popup al hacer clic en el botón de cerrar
            const closeButton = mobilePopup.querySelector('.popup-close');
            closeButton.addEventListener('click', closePopup);
        }
        
        // Agregar eventos de clic a los pasos de la línea de tiempo
        timelineSteps.forEach(step => {
            step.addEventListener('click', function() {
                if (isMobile) {
                    showPopup(this);
                }
            });
        });
        
        // Función para mostrar el popup con la información del paso seleccionado
        function showPopup(step) {
            // Obtener elementos del popup
            const popupIcon = document.querySelector('.popup-icon');
            const popupTitle = document.querySelector('.popup-title');
            const popupDescription = document.querySelector('.popup-description');
            
            // Obtener información del paso
            const stepIcon = step.querySelector('.step-icon');
            const stepTitle = step.querySelector('.step-title');
            const stepDescription = step.querySelector('.step-description');
            
            // Clonar el icono para mantener su estilo
            popupIcon.innerHTML = '';
            const iconClone = stepIcon.querySelector('img').cloneNode(true);
            popupIcon.appendChild(iconClone);
            
            // Actualizar título y descripción
            popupTitle.textContent = stepTitle.textContent;
            popupDescription.textContent = stepDescription.textContent;
            
            // Mostrar el popup y el overlay
            popupOverlay.classList.add('active');
            mobilePopup.classList.add('active');
            
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
        
        // Función para cerrar el popup
        function closePopup() {
            const popupOverlay = document.querySelector('.popup-overlay');
            const mobilePopup = document.querySelector('.mobile-popup');
            
            if (popupOverlay && mobilePopup) {
                popupOverlay.classList.remove('active');
                mobilePopup.classList.remove('active');
                
                // Restaurar scroll del body
                document.body.style.overflow = '';
            }
        }
        
        // Evento para recargar la página si cambia el tamaño de la ventana 
        // entre móvil y desktop para reinicializar correctamente
        let lastIsMobile = isMobile;
        window.addEventListener('resize', function() {
            const currentIsMobile = window.innerWidth < 992;
            if (currentIsMobile !== lastIsMobile) {
                location.reload();
            }
        });
    }

    // Llamar a la función cuando el DOM esté listo
    initComoFuncionaPopups();
});
  