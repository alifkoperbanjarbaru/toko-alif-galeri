const sheetID = "1KWbsQSVUH-1veZiySoeP5VG5CW2ItdVdMkS7sxjc7TM";

const url =
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=Katalog`;

const produkDiv = document.getElementById("produk");

fetch(url)
.then(res => res.text())
.then(data => {

    const json = JSON.parse(
        data.substring(47).slice(0,-2)
    );

    const rows = json.table.rows;

    let html = "";

    rows.forEach(item=>{

        const foto = item.c[0]?.v || "";
        const merek = item.c[1]?.v || "";
        const bahan = item.c[2]?.v || "";
        const ukuran = item.c[3]?.v || "";
        const warna = item.c[4]?.v || "";
        const harga = item.c[5]?.v || "";
        const status = item.c[6]?.v || "";
        const deskripsi = item.c[7]?.v || "";

        html += `
        <div class="kartu">

            <img src="${foto}" alt="${merek}">

            <div class="info">

                <h3>${merek}</h3>

                <p>${bahan}</p>

                <p>Ukuran : ${ukuran}</p>

                <p>Warna : ${warna}</p>

                <p class="harga">${harga}</p>

                <span class="status">${status}</span>

                <p>${deskripsi}</p>

            </div>

        </div>
        `;

    });

    produkDiv.innerHTML = html;

});

const search = document.getElementById("search");

search.addEventListener("keyup",function(){

    const keyword = this.value.toLowerCase();

    document.querySelectorAll(".kartu").forEach(card=>{

        const text = card.innerText.toLowerCase();

        card.style.display =
        text.includes(keyword)
        ? "block"
        : "none";

    });

});
