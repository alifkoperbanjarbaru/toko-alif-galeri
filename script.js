*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial,sans-serif;
    background:#f5f5f5;
    color:#333;
}

/* Header */
.header{
    background:#0d6efd;
    color:#fff;
    text-align:center;
    padding:20px;
}

.header h1{
    font-size:28px;
}

.header p{
    margin-top:8px;
    opacity:.9;
}

/* Search */
.search-box{
    padding:15px;
    background:#fff;
    position:sticky;
    top:0;
    z-index:100;
}

.search-box input{
    width:100%;
    padding:12px;
    border-radius:10px;
    border:1px solid #ddd;
    font-size:16px;
}

/* Produk */
.produk{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
    gap:16px;
    padding:16px;
}

/* Card */
.kartu{
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 3px 10px rgba(0,0,0,.12);
    transition:.25s;
}

.kartu:hover{
    transform:translateY(-4px);
}

.kartu img{
    width:100%;
    height:220px;
    object-fit:cover;
}

.info{
    padding:12px;
}

.info h3{
    font-size:18px;
    margin-bottom:8px;
}

.info p{
    margin:4px 0;
    font-size:14px;
}

.harga{
    color:#198754;
    font-size:20px;
    font-weight:bold;
    margin-top:8px;
}

.status{
    display:inline-block;
    margin-top:10px;
    padding:5px 10px;
    border-radius:20px;
    background:#198754;
    color:white;
    font-size:12px;
    font-weight:bold;
}

.loading{
    grid-column:1/-1;
    text-align:center;
    padding:40px;
        }
