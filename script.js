const produk = [
    {
        nama: "Koper Contoh",
        ukuran: "20 inch",
        warna: "Hitam",
        harga: "Rp290.000",
        status: "Stok",
        foto: "https://drive.google.com/uc?export=view&id=1a97DY1_pI-jhnWAV9TlkNkdnpSrFqRF8"
    },
    {
        nama: "Koper Contoh 2",
        ukuran: "24 inch",
        warna: "Biru",
        harga: "Rp350.000",
        status: "Stok",
        foto: "https://drive.google.com/uc?export=view&id=1a97DY1_pI-jhnWAV9TlkNkdnpSrFqRF8"
    }
];


let tampilan = "";

produk.forEach(item => {

    tampilan += `
    <div class="kartu">
        <img src="${item.foto}">
        <h3>${item.nama}</h3>
        <p>Ukuran: ${item.ukuran}</p>
        <p>Warna: ${item.warna}</p>
        <p class="harga">${item.harga}</p>
        <p>Status: ${item.status}</p>
    </div>
    `;

});


document.getElementById("produk").innerHTML = tampilan;
