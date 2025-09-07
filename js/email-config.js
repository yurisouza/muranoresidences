// Configuração do EmailJS
// Para usar este sistema, você precisa:
// 1. Criar uma conta gratuita no https://www.emailjs.com/
// 2. Criar um serviço de e-mail (Gmail, Outlook, etc.)
// 3. Criar um template de e-mail
// 4. Substituir as configurações abaixo pelas suas

const EMAIL_CONFIG = {
    // Sua chave pública do EmailJS
    PUBLIC_KEY: '_bCANl4PsaWeqSZX1',
    
    // ID do seu serviço de e-mail no EmailJS
    SERVICE_ID: 'service_osasmw7',
    
    // ID do template de e-mail no EmailJS
    TEMPLATE_ID: 'template_vb22iqd',
    
    // E-mail de destino
    TO_EMAIL: 'psouza.yuri@gmail.com'
};

// Inicializar EmailJS com a configuração
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    }
})();

// Template de e-mail sugerido para o EmailJS:
/*
Assunto: Novo Lead - Murano Residences

Corpo do e-mail:
Novo lead recebido através do site Murano Residences:

Nome: {{from_name}}
E-mail: {{from_email}}
Telefone: {{telefone}}

Data: {{current_date}}

---
Este e-mail foi enviado automaticamente pelo site.
*/
