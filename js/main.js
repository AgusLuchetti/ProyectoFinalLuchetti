const contenido = document.getElementById("contenido");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const showAlert = document.getElementById("showAlert");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const filtroInput = document.getElementById("filtroInput");
const mayorPrecioBtn = document.getElementById("mayor__precio");
const menorPrecioBtn = document.getElementById("menor__precio");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosEnStock = [];

const cargarProductosDesdeJSON = async () => {
  try {
    const response = await fetch("./db/productos.json");
    const data = await response.json();
    productosEnStock = data;
    return data;
  } catch (error) {
    console.error("Error al cargar los productos desde el JSON:", error);
    return [];
  }
};

const mostrarProductosEnPagina = (productos) => {
  contenido.innerHTML = "";

  productos.forEach((product) => {
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
      <img src="${product.img}">
      <h3>${product.nombre}</h3>
      <p class="price">${product.precio} $</p>
    `;

    contenido.append(content);

    let comprar = document.createElement("button");
    comprar.innerText = "Agregar al Carrito";
    comprar.className = "Agregar al carrito";

    content.append(comprar);

    comprar.addEventListener("click", () => {
      const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);

      if (repeat) {
        carrito.map((prod) => {
          if (prod.id === product.id) {
            prod.cantidad++;
          }
        });
      } else {
        carrito.push({
          id: product.id,
          img: product.img,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: product.cantidad || 1,
        });

        console.log(carrito);
        console.log(carrito.length);
        carritoCounter();
        saveLocal();

        Toastify({
          text: "Producto agregado al carrito",
          duration: 3000,
          close: false,
          gravity: "bottom",
          position: "left",
          stopOnFocus: true,
          onClick: function () {}
        }).showToast();
      }
    });
  });
};

const cargarYMostrarProductos = async () => {
  const productos = await cargarProductosDesdeJSON();
  mostrarProductosEnPagina(productos);
};

filtroInput.addEventListener("keyup", (e) => {
  const filtroTexto = e.target.value.toLowerCase();

  const productosFiltrados = productosEnStock.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtroTexto)
  );

  mostrarProductosEnPagina(productosFiltrados);
});

const ordenarPorPrecioAscendente = () => {
  const productosOrdenados = productosEnStock.slice().sort((a, b) => a.precio - b.precio);
  mostrarProductosEnPagina(productosOrdenados);
};

const ordenarPorPrecioDescendente = () => {
  const productosOrdenados = productosEnStock.slice().sort((a, b) => b.precio - a.precio);
  mostrarProductosEnPagina(productosOrdenados);
};

mayorPrecioBtn.addEventListener("click", ordenarPorPrecioDescendente);
menorPrecioBtn.addEventListener("click", ordenarPorPrecioAscendente);

const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

cargarYMostrarProductos();
