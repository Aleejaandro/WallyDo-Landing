document.addEventListener("DOMContentLoaded", () => {
    // Animación de scroll para el formulario
    const formContainer = document.querySelector('.form-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    if (formContainer) {
        observer.observe(formContainer);
    }

    // Scroll suave al hacer clic en la flecha
    const scrollIndicator = document.querySelector('.scroll-arrow');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const formSection = document.querySelector('.form-section');
            formSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const form = document.getElementById("feedback-form");
    const steps = form.querySelectorAll('.form-step');
    const nextButtons = form.querySelectorAll('.next-btn');
    const prevButtons = form.querySelectorAll('.prev-btn');
    let currentStep = 0;
  
    // Manejar campos "Otro"
    document.querySelectorAll('.otro-option input[type="radio"], .otro-option input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const textInput = e.target.parentElement.querySelector('.otro-input');
        textInput.disabled = !e.target.checked;
        if (e.target.checked) {
          textInput.focus();
        }
      });
    });

    document.querySelectorAll('.otro-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const errorMessage = e.target.parentElement.querySelector('.error-message');
        if (e.target.value.trim()) {
          errorMessage.style.display = 'none';
        } else {
          errorMessage.style.display = 'block';
        }
      });
    });

    // Limpiar errores cuando se selecciona una opción
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const questionGroup = input.closest('.question-group');
        if (questionGroup) {
          questionGroup.classList.remove('error');
          const requiredError = questionGroup.querySelector('.required-error');
          if (requiredError) {
            requiredError.style.display = 'none';
          }
        }
      });
    });

    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('input', () => {
        textarea.classList.remove('error');
        const questionGroup = textarea.closest('.question-group');
        if (questionGroup) {
          questionGroup.classList.remove('error');
          const requiredError = questionGroup.querySelector('.required-error');
          if (requiredError) {
            requiredError.style.display = 'none';
          }
        }
      });
    });
  
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        currentStep = stepIndex;
    }
  
    function scrollToForm() {
        const formSection = document.querySelector('.form-section');
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(stepIndex) {
        const currentStep = steps[stepIndex];
        const requiredInputs = currentStep.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        // Limpiar errores anteriores
        currentStep.querySelectorAll('.question-group').forEach(group => {
            group.classList.remove('error');
        });

        // Validar campos de radio y checkbox
        const radioGroups = new Set();
        const checkboxGroups = new Set();
        
        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                radioGroups.add(input.name);
            } else if (input.type === 'checkbox') {
                checkboxGroups.add(input.name);
            }
        });

        // Validar grupos de radio
        radioGroups.forEach(groupName => {
            const checkedInput = currentStep.querySelector(`input[name="${groupName}"]:checked`);
            if (!checkedInput) {
                isValid = false;
                const questionGroup = currentStep.querySelector(`input[name="${groupName}"]`).closest('.question-group');
                questionGroup.classList.add('error');
            }
        });

        // Validar grupos de checkbox
        checkboxGroups.forEach(groupName => {
            const checkedInputs = currentStep.querySelectorAll(`input[name="${groupName}"]:checked`);
            if (checkedInputs.length === 0) {
                isValid = false;
                const questionGroup = currentStep.querySelector(`input[name="${groupName}"]`).closest('.question-group');
                questionGroup.classList.add('error');
            }
        });

        // Validar campos de texto y textarea
        requiredInputs.forEach(input => {
            if (input.type === 'text' || input.type === 'textarea' || input.type === 'email') {
                if (!input.value.trim()) {
                    isValid = false;
                    const questionGroup = input.closest('.question-group');
                    questionGroup.classList.add('error');
                }
            }
        });

        // Validar campos "Otro"
        currentStep.querySelectorAll('.otro-option input[type="radio"]:checked, .otro-option input[type="checkbox"]:checked').forEach(input => {
            const textInput = input.parentElement.querySelector('.otro-input');
            if (textInput && !textInput.disabled && !textInput.value.trim()) {
                isValid = false;
                const questionGroup = input.closest('.question-group');
                questionGroup.classList.add('error');
            }
        });

        // Mostrar mensajes de error
        if (!isValid) {
            currentStep.querySelectorAll('.question-group.error').forEach(group => {
                const errorMessage = group.querySelector('.required-error');
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
            });
        }

        return isValid;
    }
  
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                scrollToForm();
            }
        });
    });
  
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
            scrollToForm();
        });
    });
  
    // Función para recopilar los datos del formulario
    function getFormData() {
        const formData = {};
        
        // Recopilar datos de radio buttons
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
        
        // Recopilar datos de checkboxes
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
        
        // Recopilar datos de textareas
        ['habitos_cuestan', 'sugerencias'].forEach(name => {
            const textarea = document.querySelector(`textarea[name="${name}"]`);
            if (textarea) {
                formData[name] = textarea.value;
            }
        });
        
        // Recopilar email
        const email = document.querySelector('input[type="email"]');
        if (email) {
            formData.email = email.value;
        }
        
        return formData;
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return;
        }
        
        // Mostrar algún indicador de carga
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }
        
        // Recopilar los datos del formulario
        const formData = getFormData();
        
        // URL del Google Apps Script publicado como aplicación web
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzm2inGDocC8b7582kfY5n_fuN4AZMvwAThFKquj3RYWQzWtpA8kp-Qts9AQW6D0VDO/exec';
        
        // Guardar datos en localStorage como respaldo
        localStorage.setItem('wallydo_form_data', JSON.stringify(formData));
        localStorage.setItem('wallydo_form_submitted', new Date().toISOString());
        
        // Mostrar mensaje de gracias inmediatamente para mejor UX
        const thanksMessage = document.getElementById('thanks-message');
        form.style.display = 'none';
        thanksMessage.style.display = 'block';
        
        // Enviar datos a Google Sheets
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).catch(error => {
            console.error('Error al enviar datos:', error);
        }).finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = '¡Únete a la Beta!';
            }
        });
        
        // Scroll al mensaje de agradecimiento
        thanksMessage.scrollIntoView({ behavior: 'smooth' });
    });
  
    // Navegación de los slides de descripción
    const slides = document.querySelectorAll('.description-slide');
    const dots = document.querySelectorAll('.nav-dot');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('active');

        // Actualizar estado de las flechas
        prevArrow.disabled = index === 0;
        nextArrow.disabled = index === slides.length - 1;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    }

    // Event listeners para las flechas
    prevArrow.addEventListener('click', prevSlide);
    nextArrow.addEventListener('click', nextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Inicializar
    showSlide(currentSlide);

    // Manejo del formulario
    const formSteps = document.querySelectorAll('.form-step');
    let currentFormStep = 0;

    // Inicializar el primer paso del formulario
    formSteps[0].classList.add('active');

    function showFormStep(stepIndex) {
        formSteps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        currentFormStep = stepIndex;
    }

    // Event listeners para los botones de navegación del formulario
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentFormStep)) {
                if (currentFormStep < formSteps.length - 1) {
                    showFormStep(currentFormStep + 1);
                }
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (currentFormStep > 0) {
                showFormStep(currentFormStep - 1);
            }
        });
    });

    // Limpiar errores al interactuar con los campos
    form.addEventListener('input', function(e) {
        const questionGroup = e.target.closest('.question-group');
        if (questionGroup) {
            questionGroup.classList.remove('error');
        }
    });
});
  