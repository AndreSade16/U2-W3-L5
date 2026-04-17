const footerYear = document.getElementById("footer-year");
const currentYear = new Date().getFullYear();
footerYear.innerText = currentYear;
const cartBadge = document.getElementById("cart-badge");
const cardsSpace = document.getElementById("cards-space");
const spinner = document.getElementById("spinner");
const apiLink = "https://striveschool-api.herokuapp.com/api/product/";
const adminToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZWIzNjczOWY4NzAwMTU3YWIwOTEiLCJpYXQiOjE3NzY0MTM0OTQsImV4cCI6MTc3NzYyMzA5NH0.H7h900XS4WLbLkRxdvx1TeDXRnyq5hq9Vqgs82h4lRQ";
let fetchedData = [];
const buyBtn = document.getElementById("buy-btn");
const cartList = document.getElementById("cart-list");
const totalDisplay = document.getElementById("total-display");
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let total = Object.values(cart).reduce(
  (sum, item) => sum + item.price * item.qty,
  0,
);
let numOfCartItems = Object.values(cart).length;

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const updateBadge = () => {
  numOfCartItems = Object.values(cart).length;
  if (numOfCartItems) {
    cartBadge.classList.remove("visually-hidden");
  } else {
    cartBadge.classList.add("visually-hidden");
  }
  cartBadge.innerText = `${numOfCartItems}`;
  return;
};

const displayNewCart = (cart) => {
  numOfCartItems = Object.values(cart).length;
  if (!numOfCartItems) {
    cartList.innerHTML = `
      <h3 class="h3 mt-5">The Cart is empty</h3>
    `;
    totalDisplay.innerText = `CART TOTAL: ${total.toFixed(2)}$`;
    updateBadge();
    saveCart();
    return;
  }
  cartList.innerHTML = "";
  Object.values(cart).forEach((cartItem) => {
    const { _id, name, price, qty } = cartItem;
    const finalPrice = (qty * price).toFixed(2);
    cartList.innerHTML += `
    <li id="cart-${_id}" class="mb-3 border border-1 border-secondary rounded-2 p-2 list-unstyled">
        <div class="row justify-content-between">
            <p class="col-12 fw-bold">${name}</p>
            <div class="d-flex flex-column flex-md-row">
            <p class="col-12 col-md-5">Quantity: ${qty}</p>
            <p class="col-12 col-md-5">${price}$</p>
            </div>
            </div>
            <p class="col-12 col-md-5">Total= ${finalPrice}$</p>
        <button class="btn btn-secondary" onclick="removeFromCart('${_id}')">Remove</button>
    </li>
  `;
  });
  totalDisplay.innerText = `CART TOTAL: ${total.toFixed(2)}$`;
  updateBadge();
  saveCart();
};

const removeFromCart = (_id) => {
  const li = document.getElementById(`cart-${_id}`);
  if (cart[_id].qty === 0) {
    return;
  }
  total -= cart[_id].price;
  if (cart[_id].qty === 1) {
    cart[_id].qty--;
    li.remove();
    delete cart[_id];
    displayNewCart(cart);
    return;
  }
  cart[_id].qty--;
  displayNewCart(cart);
};

const addToCart = (productId) => {
  const product = fetchedData.find((product) => product._id === productId);
  const { _id, name, price } = product;
  total += price;
  if (cart[_id]) {
    cart[_id].qty++;
  } else {
    cart[_id] = { ...product, qty: 1 };
  }
  displayNewCart(cart);
  return;
  const quantity = cart[_id].qty;
  const finalPrice = price * quantity;
  const productLi = document.getElementById(`cart-${_id}`);
  if (productLi) {
    productLi.innerHTML = `
    <li id="cart-${_id}" class="mb-3">
        <div class="row justify-content-between">
            <p class="col-12 col-md-5 fw-bold">${name}</p>
            <div class="d-flex flex-column">
            <p class="col-12 col-md-5">Quantity: ${quantity}</p>
            <p class="col-12 col-md-5">${price}$</p>
            <p class="col-12 col-md-5">Total= ${finalPrice}$</p>
            </div>
        </div>
        <button class="btn btn-secondary" onclick="removeFromCart('${_id}')">Remove</button>
    </li>
  `;
  } else {
    cartList.innerHTML += `
    <li id="cart-${_id}" class="mb-3">
        <div class="row justify-content-between">
            <p class="col-12 col-md-5 fw-bold">${name}</p>
            <div class="d-flex flex-column">
            <p class="col-12 col-md-5">Quantity: ${quantity}</p>
            <p class="col-12 col-md-5">${price}$</p>
            <p class="col-12 col-md-5">Total= ${finalPrice}$</p>
            </div>
        </div>
        <button class="btn btn-secondary" onclick="removeFromCart('${_id}')">Remove</button>
    </li>
  `;
  }
};

const displayCards = (data) => {
  spinner.classList.add("d-none");
  data.forEach((product) => {
    const { _id, name, description, brand, imageUrl, price } = product;
    cardsSpace.innerHTML += `
    <div class="col-12 col-md-4 d-flex mb-4">
        <div class="card w-100 h-100">
            <img src="${imageUrl}" class="card-img-top object-fit-cover" alt="card-image" style="height: 250px">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${description}</p>
                <p class="card-text">${brand}</p>
                <p class="card-text fw-bold mt-auto">${price}$</p>
                <div class="d-flex justify-content-between">
                    <a href="./details.html?id=${_id}" class="btn btn-primary me-4 d-flex align-items-center">Details</a>
                    <button onclick="addToCart('${_id}')" class="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
    </div>
        `;
  });
};

const getProductsData = () => {
  fetch(apiLink, {
    headers: {
      Authorization: adminToken,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        cardsSpace.innerHTML = `
          <h4 class="h4 mt-4 text-center">Oops, something went wrong, try again later.</h4>
      `;
        throw new Error("Failed to fetch data");
      }
    })
    .then((data) => {
      fetchedData = data;
      sessionStorage.setItem("data", JSON.stringify(fetchedData));
      displayCards(fetchedData);
    })
    .catch((err) => {
      cardsSpace.innerHTML = `
          <h4 class="h4 mt-4 text-center">Oops, something went wrong, try again later.
          ${err}</h4>
      `;
      console.log(err);
    });
};

buyBtn.addEventListener("click", () => {
  alert(
    numOfCartItems ? "Thanks for your purchase!" : "Add anything to your cart!",
  );
});

getProductsData();
displayNewCart(cart);
