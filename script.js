document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    
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
                }, 3500); // Tiempo suficiente para leer el mensaje
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
                    // Si estamos en form-light.html, navegar a index-light.html
                    window.location.href = "index-light.html";
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
    
    // Código para manejar elementos que podrían estar en cualquier página
    // ...
});
  