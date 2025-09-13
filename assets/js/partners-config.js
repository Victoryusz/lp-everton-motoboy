// Configuração dos Parceiros
// Este arquivo contém a lista de parceiros que aparecem no carrossel
// Para adicionar ou remover parceiros, edite o array abaixo

const PARTNERS_CONFIG = [
  {
    name: "DW BURGUERS",
    url: "https://dwburguers.com/",
    image: "assets/images/partners/dw-burguers.webp",
  },
  {
    name: "Pizzaria Betell",
    url: "https://pizzariabetelltopdasgalaxias.com/",
    image: "assets/images/partners/top-galaxias.webp",
  },
];

// Função para inicializar parceiros dinamicamente
function initializePartners() {
  const track = document.querySelector(".partners-track");
  if (!track) return;

  // Limpar conteúdo existente
  track.innerHTML = "";

  // Adicionar cada parceiro duas vezes para criar loop infinito
  PARTNERS_CONFIG.forEach((partner) => {
    // Primeira vez
    addPartnerToTrack(track, partner);
  });

  PARTNERS_CONFIG.forEach((partner) => {
    // Segunda vez para loop infinito
    addPartnerToTrack(track, partner);
  });
}

function addPartnerToTrack(track, partner) {
  const partnerItem = document.createElement("div");
  partnerItem.className = "partner-item";

  const link = document.createElement("a");
  link.href = partner.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", `Visitar site do parceiro ${partner.name}`);

  const img = document.createElement("img");
  img.src = partner.image;
  img.alt = partner.name;
  img.loading = "lazy";

  link.appendChild(img);
  partnerItem.appendChild(link);
  track.appendChild(partnerItem);
}

// A inicialização será feita pelo script.js principal
// document.addEventListener("DOMContentLoaded", initializePartners);
