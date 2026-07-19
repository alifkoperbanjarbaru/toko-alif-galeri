const sheetID = "1KWbsQSVUH-1veZiySoeP5VG5CW2ItdVdMkS7sxjc7TM";
const sheetName = "Katalog";

const url =
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

const produkDiv = document.getElementById("produk");
const searchInput = document.getElementById("search");

let semuaProduk = [];

fetch(url)
.then(response => {

    if(!response.ok){

        throw new Error("Gagal mengambil data Google Sheets");

    }

    return response.text();

})

.then(text => {

    const json = JSON.parse(

        text.substring(47).slice(0,-2)

    );

    semuaProduk = json.table.rows.map(row => {

        let foto = row.c[0]?.v || "";

        // Konversi link Google Drive
        if(foto.includes("/file/d/")){

            const id = foto.match(/\/d\/([^/]+)/);

            if(id){

                foto =
                `https://drive.google.com/thumbnail?id=${id[1]}&sz=w800`;

            }

        }

        return{

            foto:foto,

            merek:row.c[1]?.v || "",

            bahan:row.c[2]?.v || "",

            ukuran:row.c[3]?.v || "",

            warna:row.c[4]?.v || "",

            harga:row.c[5]?.v || "",

            status:row.c[6]?.v || "",

            deskripsi:row.c[7]?.v || ""

        };

    });

    tampilkanProduk(semuaProduk);

}
.catch(error => {

    console.error(error);

    produkDiv.innerHTML = `
        <div class="loading">
            ❌ Gagal mengambil data Google Sheets
        </div>
    `;

});

function tampilkanProduk(data){

    if(data.length===0){

        produkDiv.innerHTML=`
            <div class="loading">
                Produk tidak ditemukan
            </div>
        `;

        return;

    }

    let html="";

    data.forEach(item=>{

        const pesan = encodeURIComponent(
`Halo Toko Alif Koper,

Saya tertarik dengan produk berikut.

Merek : ${item.merek}
Bahan : ${item.bahan}
Ukuran : ${item.ukuran}
Warna : ${item.warna}
Harga : ${item.harga}

Apakah produk ini masih tersedia?`
        );

        html += `
        <div class="kartu">

            <img src="${item.foto}" alt="${item.merek}" loading="lazy">

            <div class="info">

                <h3>${item.merek}</h3>

                <p><b>Bahan :</b> ${item.bahan}</p>

                <p><b>Ukuran :</b> ${item.ukuran}</p>

                <p><b>Warna :</b> ${item.warna}</p>

                <p class="harga">${item.harga}</p>

                <span class="status">${item.status}</span>

                <p>${item.deskripsi}</p>

                <a
                    class="wa-btn"
                    href="https://wa.me/6289652488295?text=${pesan}"
                    target="_blank">

                    🟢 Chat WhatsApp

                </a>

            </div>

        </div>
        `;

    });

    produkDiv.innerHTML = html;

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const keyword = this.value.trim().toLowerCase();

        const hasil = semuaProduk.filter(item => {

            return (
                (item.merek || "").toLowerCase().includes(keyword) ||
                (item.bahan || "").toLowerCase().includes(keyword) ||
                (item.ukuran || "").toLowerCase().includes(keyword) ||
                (item.warna || "").toLowerCase().includes(keyword) ||
                (item.harga || "").toLowerCase().includes(keyword) ||
                (item.deskripsi || "").toLowerCase().includes(keyword)
            );

        });

        tampilkanProduk(hasil);

    });

}
