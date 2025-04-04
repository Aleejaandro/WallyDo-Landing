document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const steps = form.querySelectorAll('.form-step');
    const nextButtons = form.querySelectorAll('.next-btn');
    const prevButtons = form.querySelectorAll('.prev-btn');
    const thanksMessage = document.getElementById('thanks-message');
    let currentFormStep = 0;

    // Configuración del slider de características
    const slides = document.querySelectorAll('.description-slide');
    const dots = document.querySelectorAll('.nav-dot');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
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
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Inicializar el primer slide
    showSlide(0);

    // Añadir funcionalidad al scroll indicator
    const scrollIndicator = document.querySelector('.hero .scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.cursor = 'pointer';
        scrollIndicator.addEventListener('click', () => {
            const formSection = document.querySelector('.form-section');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
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

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        currentFormStep = stepIndex;

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

    function validateStep(stepIndex) {
        const currentStep = steps[stepIndex];
        let isValid = true;

        // Limpiar errores previos
        currentStep.querySelectorAll('.question-group').forEach(group => {
            group.classList.remove('error');
            const errorDiv = group.querySelector('.required-error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        });

        // Validar grupos con asterisco rojo
        currentStep.querySelectorAll('.question-group').forEach(group => {
            const hasRedAsterisk = group.querySelector('label span[style*="color: red"]');
            if (!hasRedAsterisk) return;

            let groupIsValid = false;

            // Validar radio buttons
            const radioInputs = group.querySelectorAll('input[type="radio"]');
            if (radioInputs.length > 0) {
                groupIsValid = Array.from(radioInputs).some(input => input.checked);
            }

            // Validar checkboxes
            const checkboxInputs = group.querySelectorAll('input[type="checkbox"]');
            if (checkboxInputs.length > 0) {
                groupIsValid = Array.from(checkboxInputs).some(input => input.checked);
            }

            // Validar campos de texto y textarea
            const textInputs = group.querySelectorAll('input[type="text"]:not(.otro-input), textarea');
            if (textInputs.length > 0) {
                groupIsValid = Array.from(textInputs).every(input => 
                    input.disabled || input.value.trim()
                );
            }

            // Si el grupo no es válido, mostrar error
            if (!groupIsValid) {
                isValid = false;
                group.classList.add('error');
                const errorDiv = group.querySelector('.required-error');
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                }
            }
        });

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
            if (validateStep(currentFormStep)) {
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
            if (!validateStep(i)) {
                console.log(`Validación fallida en paso ${i}`);
                isValid = false;
                showStep(i);
                scrollToForm();
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

        if (thanksMessage) {
            console.log('Mostrando mensaje de gracias');
            thanksMessage.style.display = 'block';
            thanksMessage.style.position = 'fixed';
            thanksMessage.style.top = '50%';
            thanksMessage.style.left = '50%';
            thanksMessage.style.transform = 'translate(-50%, -50%)';
            thanksMessage.style.zIndex = '1000';
            thanksMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            thanksMessage.style.padding = '30px';
            thanksMessage.style.borderRadius = '15px';
            thanksMessage.style.width = '90%';
            thanksMessage.style.maxWidth = '600px';
            thanksMessage.style.textAlign = 'center';
            thanksMessage.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        } else {
            console.log('No se encontró el elemento thanks-message');
        }

        localStorage.setItem('wallydo_form_data', JSON.stringify(formData));
        localStorage.setItem('wallydo_form_submitted', new Date().toISOString());

        // Enviar a Google Sheets
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

        setTimeout(() => {
            console.log('Timeout ejecutado');
            if (thanksMessage) {
                thanksMessage.style.display = 'none';
            }
            form.reset();
            showStep(0);
            currentFormStep = 0;
            document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });

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
                }
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

    function validateQuestionGroup(group) {
        let isValid = false;
        const radioInputs = group.querySelectorAll('input[type="radio"]');
        const checkboxInputs = group.querySelectorAll('input[type="checkbox"]');
        const textInputs = group.querySelectorAll('input[type="text"]:not(.otro-input), textarea');

        if (radioInputs.length > 0) {
            isValid = Array.from(radioInputs).some(input => input.checked);
        } else if (checkboxInputs.length > 0) {
            isValid = Array.from(checkboxInputs).some(input => input.checked);
        } else if (textInputs.length > 0) {
            isValid = Array.from(textInputs).every(input => 
                input.disabled || input.value.trim()
            );
        }

        const errorDiv = group.querySelector('.required-error');
        if (errorDiv) {
            errorDiv.style.display = isValid ? 'none' : 'block';
        }
        group.classList.toggle('error', !isValid);

        return isValid;
    }

    showStep(currentFormStep);
});
