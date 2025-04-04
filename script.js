document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const steps = form.querySelectorAll('.form-step');
    const nextButtons = form.querySelectorAll('.next-btn');
    const prevButtons = form.querySelectorAll('.prev-btn');
    const thanksMessage = document.getElementById('thanks-message');
    let currentFormStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        currentFormStep = stepIndex;
    }

    function scrollToForm() {
        const formSection = document.querySelector('.form-section');
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(stepIndex) {
        const currentStep = steps[stepIndex];
        const requiredInputs = currentStep.querySelectorAll('input[required]:not([type="checkbox"]), textarea[required]');
        let isValid = true;

        currentStep.querySelectorAll('.question-group').forEach(group => {
            group.classList.remove('error');
        });

        const radioGroups = new Set();
        const checkboxGroups = new Set();

        // Recolectar grupos de radio buttons
        currentStep.querySelectorAll('input[type="radio"][required]').forEach(input => {
            radioGroups.add(input.name);
        });

        // Recolectar grupos de checkboxes que necesitan validación
        currentStep.querySelectorAll('input[type="checkbox"]').forEach(input => {
            if (input.closest('.question-group').querySelector('span[style*="color: red"]')) {
                checkboxGroups.add(input.name);
            }
        });

        // Validar radio buttons
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

        return isValid;
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

        console.log('Validando paso:', currentFormStep);
        if (!validateStep(currentFormStep)) {
            console.log('Validación fallida');
            return;
        }
        console.log('Validación exitosa');

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

    showStep(currentFormStep);
});
