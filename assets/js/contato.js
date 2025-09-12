/**
 * 📧 SCRIPT DO FORMULÁRIO DE CONTATO
 * Integração com Google Sheets + E-mail automático
 */

// ⚠️ IMPORTANTE: Substitua pela sua URL do Google Apps Script
const FORMULARIO_CONFIG = {
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzt31YO3EZPPD315sqaW2Wwz5SZC4qxr3woGGrutEVhwAVcjI8RrZUdzP2ht1aJfQZmrg/exec',
    TIMEOUT: 15000 // 15 segundos de timeout
};

/**
 * 🚀 Inicialização quando a página carregar
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Sistema de formulário carregado');
    
    // Elementos do DOM
    const form = document.getElementById('formContato');
    const btnEnviar = document.getElementById('btnEnviar');
    const mensagemSucesso = document.getElementById('mensagemSucesso');
    const mensagemErro = document.getElementById('mensagemErro');
    
    // Validação inicial
    if (!form) {
        console.error('❌ Formulário não encontrado! Verifique o ID "formContato"');
        return;
    }
    
    // Event listener para submit do formulário
    form.addEventListener('submit', enviarFormulario);
    
    /**
     * 📤 Função principal para enviar formulário
     */
    async function enviarFormulario(evento) {
        evento.preventDefault();
        
        // Verificar se a URL foi configurada
        if (FORMULARIO_CONFIG.SCRIPT_URL.includes('SUA_URL_AQUI')) {
            mostrarErro('⚙️ Configure a URL do Google Apps Script primeiro!');
            return;
        }
        
        // Ocultar mensagens anteriores
        ocultarMensagens();
        
        // Mostrar estado de loading
        mostrarLoading();
        
        try {
            // Coletar dados do formulário
            const dados = coletarDadosFormulario();
            
            // Validar dados
            if (!validarDados(dados)) {
                return;
            }
            
            // Enviar para Google Apps Script
            const resultado = await enviarParaGoogle(dados);
            
            if (resultado.status === 'sucesso') {
                mostrarSucesso();
                form.reset();
            } else {
                throw new Error(resultado.mensagem || 'Erro desconhecido');
            }
            
        } catch (erro) {
            console.error('❌ Erro ao enviar formulário:', erro);
            mostrarErro('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
        } finally {
            restaurarBotao();
        }
    }
    
    /**
     * 📊 Coletar dados do formulário
     */
    function coletarDadosFormulario() {
        const formData = new FormData(form);
        const dados = {};
        
        formData.forEach((value, key) => {
            dados[key] = value.trim();
        });
        
        // Log para debug (removido em produção)
        console.log('📋 Dados coletados:', dados);
        
        return dados;
    }
    
    /**
     * ✅ Validar dados antes do envio
     */
    function validarDados(dados) {
        if (!dados.nome) {
            mostrarErro('Por favor, preencha seu nome.');
            return false;
        }
        
        if (!dados.telefone) {
            mostrarErro('Por favor, preencha seu telefone.');
            return false;
        }
        
        if (!dados.servico) {
            mostrarErro('Por favor, selecione um serviço.');
            return false;
        }
        
        // Validação básica de telefone brasileiro
        const telefoneNumeros = dados.telefone.replace(/\D/g, '');
        if (telefoneNumeros.length < 10) {
            mostrarErro('Por favor, digite um telefone válido.');
            return false;
        }
        
        return true;
    }
    
    /**
     * 🚀 Enviar dados para Google Apps Script
     */
    async function enviarParaGoogle(dados) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FORMULARIO_CONFIG.TIMEOUT);
        
        try {
            const response = await fetch(FORMULARIO_CONFIG.SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const resultado = await response.json();
            return resultado;
            
        } catch (erro) {
            clearTimeout(timeoutId);
            
            if (erro.name === 'AbortError') {
                throw new Error('Timeout: A solicitação demorou muito para responder.');
            }
            
            throw erro;
        }
    }
    
    /**
     * 🎨 Funções para manipular UI
     */
    function mostrarLoading() {
        if (btnEnviar) {
            btnEnviar.disabled = true;
            btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        }
    }
    
    function restaurarBotao() {
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Enviar Mensagem</span>';
        }
    }
    
    function mostrarSucesso() {
        if (mensagemSucesso) {
            mensagemSucesso.style.display = 'block';
            rolarParaMensagem(mensagemSucesso);
        }
    }
    
    function mostrarErro(mensagem) {
        if (mensagemErro) {
            // Atualizar texto se necessário
            const textoErro = mensagemErro.querySelector('strong + br').nextSibling;
            if (textoErro) {
                textoErro.textContent = mensagem;
            }
            
            mensagemErro.style.display = 'block';
            rolarParaMensagem(mensagemErro);
        }
        
        console.warn('⚠️ Erro exibido:', mensagem);
    }
    
    function ocultarMensagens() {
        if (mensagemSucesso) mensagemSucesso.style.display = 'none';
        if (mensagemErro) mensagemErro.style.display = 'none';
    }
    
    function rolarParaMensagem(elemento) {
        setTimeout(() => {
            elemento.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
    
    /**
     * 🎭 Máscara para telefone (opcional)
     */
    const inputTelefone = form?.querySelector('input[name="telefone"]');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length <= 11) {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                valor = valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
                valor = valor.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
                valor = valor.replace(/^(\d{2})$/, '($1');
            }
            
            e.target.value = valor;
        });
    }
    
    console.log('✅ Formulário de contato configurado com sucesso!');
});