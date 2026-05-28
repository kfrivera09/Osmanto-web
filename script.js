const NUMERO_WHATSAPP = "573001234567";
const productosPorPagina = 20;

let todosLosPerfumes = []; // Base de datos maestra
let perfumesFiltrados = []; // Base de datos actual según filtro
let paginaActual = 1;

const grid = document.getElementById('catalog-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const controls = document.getElementById('pagination-controls');

// 1. Carga inicial desde JSON
async function cargarCatalogo() {
    try {
        const response = await fetch('perfumes.json');
        todosLosPerfumes = await response.json();
        perfumesFiltrados = todosLosPerfumes;
        renderizarCatalogo(perfumesFiltrados, 1);
    } catch (error) {
        console.error("Error al cargar los perfumes:", error);
        grid.innerHTML = '<div class="no-results">Error al cargar el catálogo. Intente de nuevo.</div>';
    }
}

// 2. Función maestra de renderizado con paginación
function renderizarCatalogo(lista, pagina) {
    paginaActual = pagina;
    grid.innerHTML = '';

    const inicio = (pagina - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = lista.slice(inicio, fin);

    if (lista.length === 0) {
        grid.innerHTML = '<div class="no-results">No se encontraron fragancias en esta categoría.</div>';
        controls.innerHTML = '';
        return;
    }

    productosPagina.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const msg = `Hola, deseo encargar la fragancia ${p.name} de ${p.brand}.`;

        card.innerHTML = `
            <img src="imagenes/${p.name}.webp" 
                 alt="${p.name}" 
                 class="product-img" 
                 onerror="this.src='imagenes/default.jpg'">

            <div class="product-info">
                <p class="product-brand">${p.brand}</p>
                <h3 class="product-name">${p.name}</h3>
                
                <p class="product-notes"><strong>Notas:</strong> ${p.notes}.</p>
                
                <div class="product-climate">
                    <strong>Clima:</strong><br>${p.clima}
                </div>
                
                <div class="product-price" style="color: var(--gold-accent); margin: 10px 0;">
                    <strong>${p.precio_colombia}</strong>
                </div>

                <div class="tags">
                    <span class="badge">${p.line}</span>
                    <span class="badge">${p.gender}</span>
                </div>
                
                <a href="${getWaLink(msg)}" class="btn-luxury" target="_blank">Solicitar Pedido</a>
            </div>
        `;
        grid.appendChild(card);
    });

    renderizarPaginacion(lista.length);
}

// 3. Generar botones de paginación
function renderizarPaginacion(totalProductos) {
    controls.innerHTML = '';
    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === paginaActual ? 'active' : ''}`;
        btn.onclick = () => {
            renderizarCatalogo(perfumesFiltrados, i);
            window.scrollTo({ top: document.getElementById('filters').offsetTop, behavior: 'smooth' });
        };
        controls.appendChild(btn);
    }
}

// 4. Lógica de Filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');

        // Busca esta parte en tu script.js y cámbiala por esto:

        perfumesFiltrados = todosLosPerfumes.filter(p => {
            if (filterValue === 'todos') return true;

            // Convertimos ambos lados a minúsculas y eliminamos tildes para comparar
            const lineaNormalizada = p.line.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const filtroNormalizado = filterValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            return lineaNormalizada === filtroNormalizado ||
                p.gender.toLowerCase() === filterValue ||
                p.clima.toLowerCase().includes(filterValue);
        });

        renderizarCatalogo(perfumesFiltrados, 1);
    });
});

function getWaLink(message) {
    return `https://wa.me/${333281176}?text=${encodeURIComponent(message)}`;
}

// Inicializar
cargarCatalogo();

// Enlaces estáticos
document.getElementById('btn-custom-order').href = getWaLink("Hola, busco una fragancia específica. ¿Podrían ayudarme a conseguirla?");
document.getElementById('btn-inspiration').href = getWaLink("Hola, me interesa conocer la Línea de Inspiración Premium.");