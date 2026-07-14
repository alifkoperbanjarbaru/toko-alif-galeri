const produk = [
    {
        nama: "Contoh Koper",
        ukuran: "20 inch",
        warna: "Hitam",
        harga: "Rp290.000",
        status: "Stok"
    },
    {
        nama: "Contoh Koper 2",
        ukuran: "24 inch",
        warna: "Biru",
        harga: "Rp350.000",
        status: "Stok"
    }
];


let tampilan = "";

produk.forEach(item => {

    tampilan += `
    <div class="kartu">
        <h3>${item.nama}</h3>
        <p>Ukuran: ${item.ukuran}</p>
        <p>Warna: ${item.warna}</p>
        <p class="harga">${item.harga}</p>
        <p>Status: ${item.status}</p>
    </div>
    `;

});


document.getElementById("produk").innerHTML = tampilan;
