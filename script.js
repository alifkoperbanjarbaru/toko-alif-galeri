
const sheetID = "1KWbsQSVUH-1veZiySoeP5VG5CW2ItdVdMkS7sxjc7TM";
const sheetName = "Katalog";
const nomorWA = "6289652488295";

const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

const produkDiv = document.getElementById("produk");
const searchInput = document.getElementById("search");

let semuaProduk = [];

// Mengamankan teks dari Google Sheets
function aman(teks) {
  return String(teks ?? "").replace(/[&<>"']/g, karakter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[karakter]);
}

// Mengambil nilai sel Google Sheets
function nilai(row, index) {
  const cell = row.c?.[index];
  return cell ? String(cell.f ?? cell.v ?? "").trim() : "";
}

// Mengubah tautan Google Drive menjadi foto
function urlFoto(link) {
  link = String(link || "").trim();

  if (!link) return "";

  const id = link.match(/\/file\/d\/([^/]+)/)?.[1]
    || link.match(/[?&]id=([^&]+)/)?.[1];

  if (id && link.includes("drive.google.com")) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
  }

  return link;
}

// Memuat katalog dari Google Sheets
async function muatProduk() {
  produkDiv.innerHTML = '<p class="loading">Memuat katalog...</p>';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Google Sheets tidak dapat diakses.");
    }

    const text = await response.text();
    const awal = text.indexOf("{");
    const akhir = text.lastIndexOf(")");

    if (awal < 0 || akhir < awal) {
      throw new Error("Format data Google Sheets tidak valid.");
    }

    const json = JSON.parse(text.slice(awal, akhir));

    semuaProduk = (json.table.rows || []).map(row => ({
      foto: urlFoto(nilai(row, 0)),
      merek: nilai(row, 1),
      bahan: nilai(row, 2),
      ukuran: nilai(row, 3),
      warna: nilai(row, 4),
      harga: nilai(row, 5),
      status: nilai(row, 6),
      deskripsi: nilai(row, 7)
    }));

    tampilkanProduk(semuaProduk);

  } catch (error) {
    console.error(error);
    produkDiv.innerHTML = `
      <p class="loading">
        ❌ Katalog gagal dimuat.<br>
        Periksa koneksi internet dan akses Google Sheets.
        <br><br>
        <button onclick="muatProduk()">Coba lagi</button>
      </p>`;
  }
}

// Menampilkan kartu produk
function tampilkanProduk(data) {
  if (!data.length) {
    produkDiv.innerHTML =
      '<p class="loading">Produk tidak ditemukan.</p>';
    return;
  }

  produkDiv.innerHTML = data.map((item, index) => {
    const status = item.status.toLowerCase();
    const terjual = status.includes("terjual");
    const pesan = [
      "Halo Toko Alif Koper, saya tertarik dengan produk:",
      `Merek: ${item.merek}`,
      `Ukuran: ${item.ukuran}`,
      `Warna: ${item.warna}`,
      `Harga: ${item.harga}`,
      "Apakah produk ini masih tersedia?"
    ].join("\n");

    const linkWA =
      `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

    return `
      <article class="kartu">
        <img
          class="foto-produk"
          src="${aman(item.foto)}"
          alt="${aman(item.merek)}"
          loading="lazy"
          data-index="${index}"
          onerror="this.onerror=null;this.style.display='none';"
        >

        <div class="info">
          <h3>${aman(item.merek || "Koper")}</h3>
          <p>Bahan: ${aman(item.bahan || "-")}</p>
          <p>Ukuran: ${aman(item.ukuran || "-")}</p>
          <p>Warna: ${aman(item.warna || "-")}</p>
          <p class="harga">${aman(item.harga || "-")}</p>

          <span class="status ${terjual ? "terjual" : "stok"}">
            ${aman(item.status || "Stok")}
          </span>

          <p>${aman(item.deskripsi || "")}</p>

          <a
            class="wa-btn"
            href="${linkWA}"
            target="_blank"
            rel="noopener noreferrer"
          >💬 Tanya via WhatsApp</a>
        </div>
      </article>
    `;
  }).join("");

  pasangPembesar();
}

// Pencarian langsung
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const kata = this.value.toLowerCase().trim();

    const hasil = semuaProduk.filter(item =>
      [
        item.merek,
        item.bahan,
        item.ukuran,
        item.warna,
        item.harga,
        item.deskripsi,
        item.status
      ].join(" ").toLowerCase().includes(kata)
    );

    tampilkanProduk(hasil);
  });
}

// Membuat pembesar foto
function pasangPembesar() {
  document.querySelectorAll(".foto-produk").forEach(img => {
    img.addEventListener("click", () => {
      if (!img.src || img.style.display === "none") return;

      const latar = document.createElement("div");
      latar.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.9);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;padding:20px;cursor:zoom-out;
      `;

      const foto = document.createElement("img");
      foto.src = img.src;
      foto.alt = img.alt;
      foto.style.cssText = `
        max-width:100%;max-height:90vh;object-fit:contain;
        border-radius:8px;
      `;

      latar.appendChild(foto);
      latar.addEventListener("click", () => latar.remove());
      document.body.appendChild(latar);
    });
  });
}

// Jalankan katalog
muatProduk();
