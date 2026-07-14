const produk = [
    {
        nama: "Koper Contoh",
        merek: "Polo Team",
        ukuran: "20 inch",
        warna: "Hitam",
        harga: "Rp290.000",
        status: "Stok",
        foto: "https://drive.google.com/thumbnail?id=1a97DY1_pI-jhnWAV9TlkNkdnpSrFqRF8&sz=w500"
    }
];


let tampilan = "";

produk.forEach(item => {

    tampilan += `
    <div class="kartu">

        <img src="${item.foto}" alt="${item.nama}">

        <h3>${item.nama}</h3>
        <p>Merek: ${item.merek}</p>
        <p>Ukuran: ${item.ukuran}</p>
        <p>Warna: ${item.warna}</p>
        <p class="harga">${item.harga}</p>
        <p>Status: ${item.status}</p>

    </div>
    `;

});


document.getElementById("produk").innerHTML = tampilan;
