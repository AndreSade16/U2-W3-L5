const form = document.getElementById("form");
const nameInput = document.getElementById("name-input");
const descriptionInput = document.getElementById("description-input");
const brandInput = document.getElementById("brand-input");
const imageInput = document.getElementById("image-input");
const priceInput = document.getElementById("price-input");
const messageDisplay = document.getElementById("message-display");
const deleteBtn = document.getElementById("delete-btn");
const updateBtn = document.getElementById("update-btn");
const submitBtn = document.getElementById("submit-btn");
const deleteConfirmBtn = document.getElementById("delete-confirm-btn");
const updateConfirmBtn = document.getElementById("update-confirm-btn");
const footerYear = document.getElementById("footer-year");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentYear = new Date().getFullYear();
footerYear.innerText = currentYear;
const apiLink = "https://striveschool-api.herokuapp.com/api/product/";
const adminToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZWIzNjczOWY4NzAwMTU3YWIwOTEiLCJpYXQiOjE3NzY0MTM0OTQsImV4cCI6MTc3NzYyMzA5NH0.H7h900XS4WLbLkRxdvx1TeDXRnyq5hq9Vqgs82h4lRQ";
let fetchedProduct = {};

class Product {
  constructor(_name, _description, _brand, _image, _price) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.imageUrl = _image;
    this.price = _price;
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  location.assign(`./backoffice.html?id=${searchInput.value.trim()}`);
});

const productID = new URLSearchParams(location.search).get("id");

const deleteProduct = () => {
  fetch(apiLink + productID, {
    method: "DELETE",
    headers: {
      Authorization: adminToken,
    },
  })
    .then((res) => {
      if (res.ok) {
        messageDisplay.innerText = `Product deleted succesfully!`;
      } else {
        messageDisplay.innerText = `Failed to delete resource...`;
        throw new Error("Failed to delete product", res.status);
      }
    })
    .catch((err) => {
      alert("Failed to delete resource.", err);
    });
};
const updateProduct = () => {
  const product = new Product(
    nameInput.value,
    descriptionInput.value,
    brandInput.value,
    imageInput.value,
    priceInput.value,
  );
  fetch(apiLink + productID, {
    method: "PUT",
    headers: {
      Authorization: adminToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((res) => {
      if (res.ok) {
        messageDisplay.innerText = `Product updated succesfully!`;
      } else {
        messageDisplay.innerText = `Failed to updated resource...`;
        throw new Error("Failed to update product", res.status);
      }
    })
    .catch((err) => {
      alert("Failed to update resource.", err);
    });
};

if (productID) {
  deleteBtn.classList.remove("d-none");
  updateBtn.classList.remove("d-none");
  submitBtn.classList.add("d-none");
  fetch(apiLink + productID, {
    headers: {
      Authorization: adminToken,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to fetch product data");
      }
    })
    .then((data) => {
      fetchedProduct = data;
      nameInput.value = data.name;
      descriptionInput.value = data.description;
      brandInput.value = data.brand;
      imageInput.value = data.imageUrl;
      priceInput.value = data.price;
    })
    .catch((err) => {
      alert("ID not found", err);
      location.assign("./backoffice.html");
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const product = new Product(
    nameInput.value,
    descriptionInput.value,
    brandInput.value,
    imageInput.value,
    priceInput.value,
  );
  fetch(apiLink, {
    method: "POST",
    headers: {
      Authorization: adminToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((res) => {
      if (res.ok) {
        messageDisplay.style.color = "green";
        messageDisplay.innerText = "Product correctly registered!";
        setTimeout(() => {
          messageDisplay.style.color = "white";
          messageDisplay.innerText = "";
        }, 5000);
        form.reset();
      } else {
        throw new Error("Failed to send data to server.", res.status);
      }
    })
    .catch((err) => {
      messageDisplay.innerText = `Error: ${err}`;
    });
});

deleteConfirmBtn.addEventListener("click", deleteProduct);

updateConfirmBtn.addEventListener("click", updateProduct);
