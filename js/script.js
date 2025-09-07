// Função auxiliar para gerar dados de data e hora
function generateDateTimeData() {
    const now = new Date();
    const currentDate = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const currentTime = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const leadId = 'L' + now.getFullYear() + 
                   String(now.getMonth() + 1).padStart(2, '0') + 
                   String(now.getDate()).padStart(2, '0') + 
                   String(now.getHours()).padStart(2, '0') + 
                   String(now.getMinutes()).padStart(2, '0');
    
    return {
        currentDate,
        currentTime,
        leadId
    };
}

// Função para enviar e-mail usando mailto: (solução nativa)
function sendEmailNative(formData) {
    // Gerar dados de data e hora
    const { currentDate, currentTime, leadId } = generateDateTimeData();

    const subject = encodeURIComponent(`🏠 Novo Lead - Murano Residences | ${formData.nome}`);
    const body = encodeURIComponent(
        `═══════════════════════════════════════════════════════════════\n` +
        `🏠 MURANO RESIDENCES - NOVO LEAD\n` +
        `═══════════════════════════════════════════════════════════════\n\n` +
        `📋 DADOS DO INTERESSADO\n` +
        `───────────────────────────────────────────────────────────────\n` +
        `👤 Nome: ${formData.nome}\n` +
        `📧 E-mail: ${formData.email}\n` +
        `📱 Telefone: ${formData.telefone}\n\n` +
        `📊 INFORMAÇÕES DO LEAD\n` +
        `───────────────────────────────────────────────────────────────\n` +
        `🌐 Origem: Site Murano Residences\n` +
        `📅 Data: ${currentDate}\n` +
        `⏰ Horário: ${currentTime}\n` +
        `🆔 ID do Lead: #${leadId}\n\n` +
        `═══════════════════════════════════════════════════════════════\n` +
        `📍 MURANO RESIDENCES\n` +
        `Rua Hermida Cerbino - Nova Iguaçu, RJ\n` +
        `Empreendimento de Alto Padrão\n\n` +
        `Este e-mail foi enviado automaticamente pelo sistema do site.`
    );
    
    const mailtoUrl = `mailto:psouza.yuri@gmail.com?subject=${subject}&body=${body}`;
    
    // Abrir cliente de e-mail padrão
    window.open(mailtoUrl, '_blank');
    
    return Promise.resolve();
}

// Função para enviar e-mail usando EmailJS (API externa)
function sendEmailAPI(formData) {
    // Gerar dados de data e hora
    const { currentDate, currentTime, leadId } = generateDateTimeData();

    // Gerar link do WhatsApp com o telefone do interessado
    const whatsappMessage = encodeURIComponent(
        `Olá! Recebi seu interesse no Murano Residences. Vamos conversar?`
    );
    const whatsappLink = `https://wa.me/55${formData.telefone.replace(/\D/g, '')}?text=${whatsappMessage}`;

    const templateParams = {
        from_name: formData.nome,
        from_email: formData.email,
        telefone: formData.telefone,
        to_email: EMAIL_CONFIG.TO_EMAIL,
        current_date: currentDate,
        current_time: currentTime,
        lead_id: leadId,
        whatsapp_link: whatsappLink,
        message: `Novo lead do site Murano Residences:\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}\n\nData: ${currentDate}\nHorário: ${currentTime}\nID: ${leadId}`
    };

    return emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams);
}

// Função para redirecionar para WhatsApp
function sendToWhatsApp(formData) {
    // Gerar dados de data e hora
    const { currentDate, currentTime, leadId } = generateDateTimeData();

    const message = encodeURIComponent(
        `🏠 *MURANO RESIDENCES* - Novo Lead\n\n` +
        `📋 *Dados do Interessado:*\n` +
        `👤 Nome: ${formData.nome}\n` +
        `📧 E-mail: ${formData.email}\n` +
        `📱 Telefone: ${formData.telefone}\n\n` +
        `📊 *Informações do Lead:*\n` +
        `📅 Data: ${currentDate}\n` +
        `⏰ Horário: ${currentTime}\n` +
        `🆔 ID: #${leadId}\n\n` +
        `Gostaria de mais informações sobre o empreendimento!`
    );
    
    const whatsappUrl = `https://wa.me/5521987476244?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    return Promise.resolve();
}

// Função para mostrar feedback visual
function showMessage(message, isError = false) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    
    // Adicionar estilos
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ${isError ? 'background-color: #e74c3c;' : 'background-color: #27ae60;'}
    `;

    document.body.appendChild(messageDiv);

    // Remover mensagem após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Função para validar formulário
function validateForm(formData) {
    if (!formData.nome || formData.nome.trim().length < 2) {
        showMessage('Por favor, insira um nome válido (mínimo 2 caracteres).', true);
        return false;
    }

    if (!formData.email || !isValidEmail(formData.email)) {
        showMessage('Por favor, insira um e-mail válido.', true);
        return false;
    }

    if (!formData.telefone || !isValidPhone(formData.telefone)) {
        showMessage('Por favor, insira um telefone válido (10 ou 11 dígitos).', true);
        return false;
    }

    return true;
}

// Função para validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para aplicar máscara de telefone brasileiro
function applyPhoneMask(value) {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara baseada no tamanho
    if (numbers.length <= 2) {
        return numbers;
    } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
}

// Função para formatar telefone (remove máscara)
function formatPhone(phone) {
    return phone.replace(/\D/g, '');
}

// Função para validar telefone brasileiro
function isValidPhone(phone) {
    const numbers = formatPhone(phone);
    return numbers.length >= 10 && numbers.length <= 11;
}

// Função para aplicar máscara de e-mail (validação em tempo real)
function validateEmailInput(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

// Event listener para o formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Aplicar máscara de telefone em tempo real
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                const cursorPosition = e.target.selectionStart;
                const oldValue = e.target.value;
                const newValue = applyPhoneMask(e.target.value);
                
                e.target.value = newValue;
                
                // Ajustar posição do cursor
                const newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            });

            // Limitar entrada apenas a números
            telefoneInput.addEventListener('keypress', function(e) {
                if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        }

        // Validação de e-mail em tempo real
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function(e) {
                if (e.target.value) {
                    if (validateEmailInput(e.target.value)) {
                        e.target.classList.remove('error');
                        e.target.classList.add('valid');
                    } else {
                        e.target.classList.remove('valid');
                        e.target.classList.add('error');
                    }
                } else {
                    e.target.classList.remove('error', 'valid');
                }
            });

            emailInput.addEventListener('input', function(e) {
                if (e.target.classList.contains('error')) {
                    e.target.classList.remove('error');
                }
            });
        }

        // Validação de nome em tempo real
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.addEventListener('blur', function(e) {
                if (e.target.value) {
                    if (e.target.value.trim().length >= 2) {
                        e.target.classList.remove('error');
                        e.target.classList.add('valid');
                    } else {
                        e.target.classList.remove('valid');
                        e.target.classList.add('error');
                    }
                } else {
                    e.target.classList.remove('error', 'valid');
                }
            });

            nomeInput.addEventListener('input', function(e) {
                if (e.target.classList.contains('error')) {
                    e.target.classList.remove('error');
                }
            });
        }

        // Validação de telefone em tempo real
        if (telefoneInput) {
            telefoneInput.addEventListener('blur', function(e) {
                if (e.target.value) {
                    if (isValidPhone(e.target.value)) {
                        e.target.classList.remove('error');
                        e.target.classList.add('valid');
                    } else {
                        e.target.classList.remove('valid');
                        e.target.classList.add('error');
                    }
                } else {
                    e.target.classList.remove('error', 'valid');
                }
            });

            telefoneInput.addEventListener('input', function(e) {
                if (e.target.classList.contains('error')) {
                    e.target.classList.remove('error');
                }
            });
        }

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                nome: form.nome.value.trim(),
                email: form.email.value.trim(),
                telefone: formatPhone(form.telefone.value)
            };

            // Validar formulário
            if (!validateForm(formData)) {
                return;
            }

            // Mostrar loading no botão
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>ENVIANDO...</span>';
            submitButton.disabled = true;

            try {
                // Verificar se EmailJS está configurado
                const isEmailJSConfigured = EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && 
                                          EMAIL_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' && 
                                          EMAIL_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
                
                if (isEmailJSConfigured) {
                    // Usar EmailJS se estiver configurado
                    await sendEmailAPI(formData);
                    showMessage('Dados enviados com sucesso! Entraremos em contato em breve.');
                } else {
                    // Usar solução nativa (mailto:)
                    await sendEmailNative(formData);
                    showMessage('Cliente de e-mail aberto! Complete o envio e entraremos em contato em breve.');
                }
                
                form.reset();
                
            } catch (error) {
                console.error('Erro ao enviar e-mail:', error);
                
                // Fallback: tentar solução nativa
                try {
                    await sendEmailNative(formData);
                    showMessage('Cliente de e-mail aberto! Complete o envio e entraremos em contato em breve.');
                    form.reset();
                } catch (fallbackError) {
                    // Último recurso: WhatsApp
                    sendToWhatsApp(formData);
                    showMessage('Redirecionando para WhatsApp. Entre em contato conosco!');
                    form.reset();
                }
            } finally {
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
});

// Função alternativa usando Formspree (sem configuração)
function sendEmailFormspree(formData) {
    // Usar um endpoint público do Formspree para demonstração
    // Em produção, você deve criar sua própria conta no Formspree
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formspree.io/f/xpwgkqyz'; // Endpoint público para teste
    
    const fields = {
        'name': formData.nome,
        'email': formData.email,
        'phone': formData.telefone,
        'message': `Novo lead do site Murano Residences:\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}\n\nData: ${new Date().toLocaleString('pt-BR')}`,
        '_subject': 'Novo Lead - Murano Residences',
        '_replyto': formData.email
    };

    Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return Promise.resolve();
}

// Função para enviar dados via fetch (solução moderna)
async function sendEmailFetch(formData) {
    // Esta é uma solução que requer um backend, mas mostra como seria
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: 'psouza.yuri@gmail.com',
            subject: 'Novo Lead - Murano Residences',
            name: formData.nome,
            email: formData.email,
            phone: formData.telefone,
            message: `Novo lead do site Murano Residences:\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}\n\nData: ${new Date().toLocaleString('pt-BR')}`
        })
    });
    
    if (!response.ok) {
        throw new Error('Erro ao enviar e-mail');
    }
    
    return response.json();
}
