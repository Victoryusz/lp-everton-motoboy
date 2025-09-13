/**
 * 📧 SCRIPT DO FORMULÁRIO DE CONTATO
 * Integração com Google Sheets + E-mail automático
 */

// ⚠️ IMPORTANTE: Substitua pela sua URL do Google Apps Script
const FORMULARIO_CONFIG = {
  SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbyCMf_p7CafIVVerVbRsvFo9-WcZf2euGGOou5rTnYqbqwKi4qJ0B-9BnKTywEuBjmM_Q/exec",
  TIMEOUT: 15000, // 15 segundos de timeout
};

/**
 * 🚀 Inicialização quando a página carregar
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("📋 Sistema de formulário carregado");

  // Elementos do DOM
  const form = document.getElementById("formContato");
  const btnEnviar = document.getElementById("btnEnviar");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const mensagemErro = document.getElementById("mensagemErro");

  // Validação inicial
  if (!form) {
    console.error('❌ Formulário não encontrado! Verifique o ID "formContato"');
    return;
  }

  // Event listener para submit do formulário
  form.addEventListener("submit", enviarFormulario);

  /**
   * 📤 Função principal para enviar formulário
   */
  async function enviarFormulario(evento) {
    evento.preventDefault();

    // Verificar se a URL foi configurada
    if (FORMULARIO_CONFIG.SCRIPT_URL.includes("SUA_URL_AQUI")) {
      mostrarErro("⚙️ Configure a URL do Google Apps Script primeiro!");
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

      if (resultado.status === "sucesso") {
        mostrarSucesso();
        form.reset();
      } else {
        throw new Error(resultado.mensagem || "Erro desconhecido");
      }
    } catch (erro) {
      console.error("❌ Erro ao enviar formulário:", erro);

      // Mostrar opção de fallback para WhatsApp
      mostrarErroComFallback(
        "Erro ao enviar formulário. Clique no botão abaixo para enviar via WhatsApp:",
        dados
      );
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
    console.log("📋 Dados coletados:", dados);

    return dados;
  }

  /**
   * ✅ Validar dados antes do envio
   */
  function validarDados(dados) {
    if (!dados.nome) {
      mostrarErro("Por favor, preencha seu nome.");
      return false;
    }

    if (!dados.telefone) {
      mostrarErro("Por favor, preencha seu telefone.");
      return false;
    }

    if (!dados.servico) {
      mostrarErro("Por favor, selecione um serviço.");
      return false;
    }

    // Validação básica de telefone brasileiro
    const telefoneNumeros = dados.telefone.replace(/\D/g, "");
    if (telefoneNumeros.length < 10) {
      mostrarErro("Por favor, digite um telefone válido.");
      return false;
    }

    return true;
  }

  /**
   * 🚀 Enviar dados para Google Apps Script
   */
  async function enviarParaGoogle(dados) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      FORMULARIO_CONFIG.TIMEOUT
    );

    try {
      // Usar FormData para evitar problemas de CORS
      const formData = new FormData();
      Object.keys(dados).forEach((key) => {
        formData.append(key, dados[key]);
      });

      const response = await fetch(FORMULARIO_CONFIG.SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Modo no-cors para evitar problemas de CORS
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Com no-cors, não conseguimos verificar response.ok ou response.json()
      // Assumimos sucesso se não houve erro de rede
      return { status: "sucesso", mensagem: "Formulário enviado com sucesso!" };
    } catch (erro) {
      clearTimeout(timeoutId);

      if (erro.name === "AbortError") {
        throw new Error("Timeout: A solicitação demorou muito para responder.");
      }

      // Se falhar, tentar método alternativo via JSONP
      return await tentarEnvioAlternativo(dados);
    }
  }

  /**
   * 🔄 Método alternativo de envio usando JSONP
   */
  async function tentarEnvioAlternativo(dados) {
    return new Promise((resolve, reject) => {
      // Criar parâmetros para URL
      const params = new URLSearchParams();
      Object.keys(dados).forEach((key) => {
        params.append(key, dados[key]);
      });

      // Criar script tag para JSONP
      const script = document.createElement("script");
      const callbackName = "callback_" + Date.now();

      // Configurar callback global
      window[callbackName] = function (result) {
        document.head.removeChild(script);
        delete window[callbackName];
        resolve(result);
      };

      // Configurar script
      script.src = `${
        FORMULARIO_CONFIG.SCRIPT_URL
      }?${params.toString()}&callback=${callbackName}`;
      script.onerror = function () {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error("Falha no envio alternativo"));
      };

      document.head.appendChild(script);

      // Timeout para o método alternativo
      setTimeout(() => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
          delete window[callbackName];
          reject(new Error("Timeout no método alternativo"));
        }
      }, 10000);
    });
  }

  /**
   * 🎨 Funções para manipular UI
   */
  function mostrarLoading() {
    if (btnEnviar) {
      btnEnviar.disabled = true;
      btnEnviar.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
    }
  }

  function restaurarBotao() {
    if (btnEnviar) {
      btnEnviar.disabled = false;
      btnEnviar.innerHTML =
        '<i class="fas fa-paper-plane"></i> <span>Enviar Mensagem</span>';
    }
  }

  function mostrarSucesso() {
    if (mensagemSucesso) {
      mensagemSucesso.style.display = "block";
      rolarParaMensagem(mensagemSucesso);
    }
  }

  function mostrarErro(mensagem) {
    if (mensagemErro) {
      // Atualizar texto se necessário
      const textoErro = mensagemErro.querySelector("strong + br").nextSibling;
      if (textoErro) {
        textoErro.textContent = mensagem;
      }

      mensagemErro.style.display = "block";
      rolarParaMensagem(mensagemErro);
    }

    // Usar sistema de notificações global
    Utils.showNotification(mensagem, "error");
    console.warn("⚠️ Erro exibido:", mensagem);
  }

  function mostrarErroComFallback(mensagem, dados) {
    if (mensagemErro) {
      // Criar mensagem com botão de fallback
      const mensagemCompleta = `
        <div style="text-align: center;">
          <p><strong>⚠️ ${mensagem}</strong></p>
          <br>
          <a href="${gerarLinkWhatsApp(dados)}" 
             target="_blank" 
             style="display: inline-block; 
                    background-color: #25D366; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    margin-top: 10px;">
            📱 Enviar via WhatsApp
          </a>
        </div>
      `;

      mensagemErro.innerHTML = mensagemCompleta;
      mensagemErro.style.display = "block";
      rolarParaMensagem(mensagemErro);
    }

    // Usar sistema de notificações global
    Utils.showNotification(mensagem, "error");
    console.warn("⚠️ Erro exibido com fallback:", mensagem);
  }

  function gerarLinkWhatsApp(dados) {
    const numeroWhatsApp = "5541996137339"; // ⚠️ CONFIGURE: Substitua pelo número real do Everton
    const mensagem = `Olá! Gostaria de solicitar um serviço de motoboy.

Nome: ${dados.nome}
Telefone: ${dados.telefone}
Serviço: ${dados.servico}
Mensagem: ${dados.mensagem || "Sem mensagem adicional"}`;

    return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  }

  function ocultarMensagens() {
    if (mensagemSucesso) mensagemSucesso.style.display = "none";
    if (mensagemErro) mensagemErro.style.display = "none";
  }

  function rolarParaMensagem(elemento) {
    setTimeout(() => {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }

  /**
   * 🎭 Máscara para telefone (opcional)
   */
  const inputTelefone = form?.querySelector('input[name="telefone"]');
  if (inputTelefone) {
    inputTelefone.addEventListener("input", function (e) {
      e.target.value = Utils.formatPhone(e.target.value);
    });
  }

  console.log("✅ Formulário de contato configurado com sucesso!");
});
