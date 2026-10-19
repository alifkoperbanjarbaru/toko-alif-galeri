
const sheetID = "1KWbsQSVUH-1veZiySoeP5VG5CW2ItdVdMkS7sxjc7TM";
const sheetName = "Katalog";
const nomorWA = "6289652488295";

const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

const halamanUkuran = document.getElementById("halaman-ukuran");
const halamanProduk = document.getElementById("halaman-produk");
const pilihanUkuran = document.getElementById("pilihan-ukuran");
const produkDiv = document.getElementById("produk");
const searchInput = document.getElementById("search");
const tombolKembali = document.getElementById("tombol-kembali");
const judulKatalog = document.getElementById("judul-katalog");
const deskripsiKatalog = document.getElementById("deskripsi-katalog");
const subjudul = document.getElementById("subjudul");

let semuaProduk = [];
let ukuranAktif = "";

// Mengamankan teks untuk HTML
function aman(teks) {
  return String(teks ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

// Membaca isi sel Google Sheets
function nilai(row, index) {
  const cell = row.c?.[index];
  return cell ? String(cell.f ?? cell.v ?? "").trim() : "";
}

// Mengubah tautan Google Drive menjadi URL foto
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

// Memuat data katalog
async function muatKatalog() {
  pilihanUkuran.innerHTML =
    '<p class="loading">Memuat pilihan ukuran...</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengakses Google Sheets.");

    const text = await response.text();
    const awal = text.indexOf("{");
    const akhir = text.lastIndexOf(")");

    if (awal < 0 || akhir < awal) {
      throw new Error("Format data tidak valid.");
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
    })).filter(item => item.ukuran);

    tampilkanPilihanUkuran();
    bukaHalamanSesuaiURL();

  } catch (error) {
    console.error(error);
    pilihanUkuran.innerHTML =
      '<p class="loading">Katalog gagal dimuat. Periksa koneksi dan akses Google Sheets, lalu muat ulang halaman.</p>';
  }
}

// Menampilkan ukuran yang benar-benar tersedia
function tampilkanPilihanUkuran() {
  const daftar = [...new Set(
    semuaProduk.map(item => item.ukuran)
  )].sort((a, b) => {
    const angkaA = parseFloat(a.replace(",", "."));
    const angkaB = parseFloat(b.replace(",", "."));

    if (Number.isFinite(angkaA) && Number.isFinite(angkaB)) {
      return angkaA - angkaB;
    }

    return a.localeCompare(b, "id");
  });

  if (!daftar.length) {
    pilihanUkuran.innerHTML =
      '<p class="loading">Belum ada produk dengan ukuran yang tercatat.</p>';
    return;
  }

  pilihanUkuran.innerHTML = daftar.map(ukuran => {
    const jumlah = semuaProduk.filter(
      item => item.ukuran === ukuran
    ).length;

    const foto = semuaProduk.find(
      item => item.ukuran === ukuran && item.foto
    )?.foto || "";

    return `
      <a class="kartu-ukuran"
         href="?ukuran=${encodeURIComponent(ukuran)}"
         data-ukuran="${aman(ukuran)}">
        ${
          foto
            ? `<img src="${aman(foto)}" alt="Koper ${aman(ukuran)}" loading="lazy">`
            : `<div class="foto-kosong">🧳</div>`
        }
        <div class="info-ukuran">
          <h3>${aman(ukuran)} inci</h3>
          <p>${jumlah} produk tersedia</p>
          <span>Lihat Produk →</span>
        </div>
      </a>
    `;
  }).join("");

  pilihanUkuran.querySelectorAll(".kartu-ukuran").forEach(kartu => {
    kartu.addEventListener("click", event => {
      event.preventDefault();
      bukaUkuran(kartu.dataset.ukuran);
    });
  });
}

// Membuka halaman ukuran tertentu
function bukaUkuran(ukuran) {
  ukuranAktif = ukuran;

  const alamat = new URL(window.location.href);
  alamat.searchParams.set("ukuran", ukuran);
  history.pushState({ ukuran }, "", alamat);

  tampilkanHalamanProduk();
}

// Menampilkan halaman sesuai alamat URL
function bukaHalamanSesuaiURL() {
  const params = new URLSearchParams(window.location.search);
  const ukuran = params.get("ukuran");

  if (ukuran && semuaProduk.some(item => item.ukuran === ukuran)) {
    ukuranAktif = ukuran;
    tampilkanHalamanProduk();
  } else {
    tampilkanHalamanUtama();
  }
}

// Halaman utama
function tampilkanHalamanUtama() {
  ukuranAktif = "";
  halamanUkuran.hidden = false;
  halamanProduk.hidden = true;
  tombolKembali.hidden = true;
  subjudul.textContent = "Temukan koper yang cocok untuk perjalananmu";
  document.title = "Katalog Toko Alif Koper";
  window.scrollTo(0, 0);
}

// Halaman khusus ukuran
function tampilkanHalamanProduk() {
  halamanUkuran.hidden = true;
  halamanProduk.hidden = false;
  tombolKembali.hidden = false;

  judulKatalog.textContent = `Koper ukuran ${ukuranAktif} inci`;
  deskripsiKatalog.textContent = "Pilih merek dan model favoritmu.";
  subjudul.textContent = `Koleksi koper ukuran ${ukuranAktif} inci`;
  document.title = `Koper ${ukuranAktif} inci - Toko Alif Koper`;

  if (searchInput) searchInput.value = "";

  tampilkanProduk(
    semuaProduk.filter(item => item.ukuran === ukuranAktif)
  );

  window.scrollTo(0, 0);
}

// Tombol kembali
tombolKembali.addEventListener("click", event => {
  event.preventDefault();

  const alamat = new URL(window.location.href);
  alamat.searchParams.delete("ukuran");
  history.pushState({}, "", alamat);

  tampilkanHalamanUtama();
});

// Mendukung tombol kembali browser HP
window.addEventListener("popstate", bukaHalamanSesuaiURL);

// Menampilkan produk
function tampilkanProduk(data) {
  if (!data.length) {
    produkDiv.innerHTML =
      '<p class="loading">Produk tidak ditemukan.</p>';
    return;
  }

  produkDiv.innerHTML = data.map(item => {
    const terjual = item.status.toLowerCase().includes("terjual");

    const pesan = [
      "Halo Toko Alif Koper, saya tertarik dengan produk:",
      `Merek: ${item.merek}`,
      `Ukuran: ${item.ukuran} inci`,
      `Warna: ${item.warna}`,
      `Harga: ${item.harga}`,
      "Apakah produk ini masih tersedia?"
    ].join("\n");

    const linkWA =
      `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

    return `
      <article class="kartu">
        ${
          item.foto
            ? `<img class="foto-produk" src="${aman(item.foto)}" alt="${aman(item.merek)}" loading="lazy">`
            : `<div class="foto-kosong">🧳</div>`
        }
        <div class="info">
          <h3>${aman(item.merek || "Koper")}</h3>
          <p>Bahan: ${aman(item.bahan || "-")}</p>
          <p>Ukuran: ${aman(item.ukuran)} inci</p>
          <p>Warna: ${aman(item.warna || "-")}</p>
          <p class="harga">${aman(item.harga || "-")}</p>
          <span class="status ${terjual ? "terjual" : "stok"}">${aman(item.status || "Stok")}</span>
          <p>${aman(item.deskripsi || "")}</p>
          <a class="wa-btn" href="${linkWA}" target="_blank" rel="noopener noreferrer">💬 Tanya via WhatsApp</a>
        </div>
      </article>
    `;
  }).join("");

  // Foto bisa diperbesar
  produkDiv.querySelectorAll(".foto-produk").forEach(img => {
    img.addEventListener("click", () => {
      const latar = document.createElement("div");
      latar.className = "pembesar-foto";

      const foto = document.createElement("img");
      foto.src = img.src;
      foto.alt = img.alt;

      latar.appendChild(foto);
      latar.addEventListener("click", () => latar.remove());
      document.body.appendChild(latar);
    });
  });
}

// Pencarian hanya di kelompok ukuran aktif
searchInput.addEventListener("input", function () {
  const kata = this.value.toLowerCase().trim();

  const hasil = semuaProduk.filter(item =>
    item.ukuran === ukuranAktif &&
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

// Mulai
muatKatalog();
