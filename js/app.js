
const RR_WA = "6282231683399";
let rrProducts = [];

const waUrl = (message = "Halo RR Flowers, saya ingin bertanya tentang pilihan bunga.") =>
  `https://wa.me/${RR_WA}?text=${encodeURIComponent(message)}`;

function setWhatsAppLinks() {
  document.querySelectorAll("[data-wa]").forEach(link => {
    const isCorporate = link.hasAttribute("data-wa-corporate");
    link.href = waUrl(isCorporate
      ? "Halo RR Flowers, saya ingin bertanya tentang kebutuhan bunga untuk perusahaan/acara.\n\nNama perusahaan:\nJenis kebutuhan:\nTanggal dibutuhkan:\nJumlah:\nAnggaran:\nLokasi pengiriman:\n\nMohon dibantu pilihan yang sesuai."
      : undefined);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function money(value, label) {
  if (label) return label;
  if (typeof value !== "number") return "Tanya harga";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function safeImage(path) {
  return path || "assets/images/placeholder.svg";
}

function productCard(p) {
  const price = p.price_label || money(p.price);
  const occasion = Array.isArray(p.occasion) ? p.occasion.slice(0, 2).join(" · ") : (p.occasion || p.category || "Untuk berbagai momen");
  return `<article class="product-card">
    <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-image">
      <img src="${safeImage(p.image)}" alt="${p.name || "Produk RR Flowers"}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
      ${p.featured ? '<span class="product-badge"><svg class="badge-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8Z"/></svg> Best Seller</span>' : ""}
    </a>
    <div class="product-info">
      <h3>${p.name || "Rangkaian bunga RR Flowers"}</h3>
      <p class="product-occasion">${occasion}</p>
      <div class="product-price">${price}</div>
      <div class="product-bottom"><a class="product-link" href="product.html?id=${encodeURIComponent(p.id)}">Lihat detail ↗</a></div>
    </div>
  </article>`;
}

async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    if (!response.ok) throw new Error("Katalog tidak dapat dimuat.");
    rrProducts = await response.json();
  } catch (error) {
    console.error(error);
    rrProducts = [];
    document.querySelectorAll("#featured, #grid").forEach(el => {
      el.innerHTML = '<p class="loading-note">Katalog belum bisa dimuat. Jalankan website lewat server (misalnya GitHub Pages atau Codespaces), bukan membuka file HTML langsung.</p>';
    });
  }
}

function initHome() {
  const target = document.querySelector("#featured");
  if (!target) return;
  const featured = rrProducts.filter(p => p.featured && p.status !== "inactive").slice(0, 4);
  target.innerHTML = (featured.length ? featured : rrProducts.slice(0, 4)).map(productCard).join("");
}

function initCatalog() {
  const grid = document.querySelector("#grid");
  if (!grid) return;

  const search = document.querySelector("#search");
  const chips = document.querySelector("#chips");
  const count = document.querySelector("#result-count");
  const empty = document.querySelector("#empty-state");
  const categories = ["Semua", ...new Set(rrProducts.map(p => p.category).filter(Boolean))];
  let activeCategory = "Semua";

  chips.innerHTML = categories.map((category, i) =>
    `<button type="button" class="chip ${i === 0 ? "active" : ""}" data-category="${category.replace(/"/g, "&quot;")}">${category}</button>`
  ).join("");

  const params = new URLSearchParams(location.search);
  const requestedOccasion = (params.get("occasion") || "").toLowerCase();
  if (requestedOccasion) search.value = requestedOccasion === "personal" ? "hand bouquet" : requestedOccasion;

  function draw() {
    const query = search.value.trim().toLowerCase();
    const filtered = rrProducts.filter(p => {
      const categoryMatch = activeCategory === "Semua" || p.category === activeCategory;
      const text = [p.name, p.category, p.size, ...(Array.isArray(p.occasion) ? p.occasion : [p.occasion || ""])].join(" ").toLowerCase();
      return categoryMatch && (!query || text.includes(query)) && p.status !== "inactive";
    });
    grid.innerHTML = filtered.map(productCard).join("");
    count.textContent = `${filtered.length} produk ditemukan`;
    empty.hidden = filtered.length > 0;
    grid.hidden = filtered.length === 0;
  }

  chips.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    chips.querySelectorAll(".chip").forEach(chip => chip.classList.toggle("active", chip === button));
    draw();
  });
  search.addEventListener("input", draw);
  document.querySelector("#clear-filters").addEventListener("click", () => {
    activeCategory = "Semua";
    search.value = "";
    chips.querySelectorAll(".chip").forEach((chip, i) => chip.classList.toggle("active", i === 0));
    draw();
  });
  draw();
}

function initProduct() {
  const target = document.querySelector("#detail");
  if (!target) return;
  const id = new URLSearchParams(location.search).get("id");
  const product = rrProducts.find(p => p.id === id) || rrProducts[0];
  if (!product) {
    target.innerHTML = '<div class="empty-state"><h2>Produk belum ditemukan.</h2><p>Coba kembali ke katalog dan pilih produk lain.</p><a class="button button-dark" href="katalog.html">Kembali ke katalog ↗</a></div>';
    return;
  }
  const occasions = Array.isArray(product.occasion) ? product.occasion.join(" · ") : (product.occasion || product.category || "Berbagai momen");
  const message = `Halo RR Flowers, saya tertarik dengan ${product.name || "produk bunga RR Flowers"}.\nHarga: ${money(product.price, product.price_label)}${product.size ? `\nUkuran: ${product.size}` : ""}\n\nTanggal dibutuhkan:\nLokasi pengiriman:\nTulisan pada bunga:\n\nMohon dibantu konfirmasi ketersediaan dan detail pemesanan.`;
  target.innerHTML = `<div class="detail-layout">
    <div class="detail-image"><img src="${safeImage(product.image)}" alt="${product.name || "Produk RR Flowers"}" onerror="this.onerror=null;this.src='assets/images/placeholder.svg'"></div>
    <div class="detail-copy">
      <p class="eyebrow">${product.category || "KOLEKSI RR FLOWERS"}</p>
      <h1>${product.name || "Rangkaian bunga RR Flowers"}</h1>
      <p class="detail-price">${money(product.price, product.price_label)}</p>
      <p class="detail-description">${product.description || "Rangkaian bunga untuk membantu menyampaikan pesan di momen penting. Hubungi RR Flowers untuk memastikan detail, ketersediaan, dan penyesuaian sesuai kebutuhanmu."}</p>
      <div class="detail-meta"><div><span>Jenis kebutuhan</span><b>${occasions}</b></div><div><span>Ukuran</span><b>${product.size || "Konfirmasi via WhatsApp"}</b></div></div>
      <div class="detail-actions"><a class="button button-dark" href="${waUrl(message)}" target="_blank" rel="noopener">Tanya & pesan via WhatsApp ↗</a><a class="text-link" href="katalog.html">Lihat produk lain →</a></div>
      <p class="detail-hint">Harga dan ketersediaan akan dikonfirmasi sebelum pesanan diproses.</p>
    </div>
  </div>`;
  document.title = `${product.name || "Detail Produk"} — RR Flowers Surabaya`;
}

function initMobileMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    button.textContent = isOpen ? "×" : "☰";
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "☰";
  }));
}

async function initRRFlowers() {
  setWhatsAppLinks();
  initMobileMenu();
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
  if (document.querySelector("#featured") || document.querySelector("#grid") || document.querySelector("#detail")) {
    await loadProducts();
    initHome();
    initCatalog();
    initProduct();
  }
}
document.addEventListener("DOMContentLoaded", initRRFlowers);
