const contenido = document.getElementById("contenido");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");
const showAlert = document.getElementById("showAlert");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const filtroInput = document.getElementById("filtroInput");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let data; // Variable para almacenar los productos originales

const getProductos = async () => {
  const response = await fetch("./db/productos.json");
  data = await response.json();

  mostrarProductos(data);

  // Filtro por input del usuario
  filtroInput.addEventListener("keyup", (e) => {
    const filtroTexto = e.target.value.toLowerCase();

    // Filtrar productos en función del texto de búsqueda
    const productosFiltrados = data.filter((producto) =>
      producto.nombre.toLowerCase().includes(filtroTexto)
    );

    // Limpiar el contenido actual y mostrar los productos filtrados
    contenido.innerHTML = "";
    mostrarProductos(productosFiltrados);
  });
};

const mostrarProductos = (productos) => {
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
          cantidad: product.cantidad,
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

getProductos();

const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
