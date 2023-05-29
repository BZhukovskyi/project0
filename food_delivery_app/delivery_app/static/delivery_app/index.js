document.addEventListener('DOMContentLoaded', () => {
    // Check if there is any products in local storage 
    const cardItems = JSON.parse(localStorage.getItem('cardItems')) || [];
    let storedId = null;
    if(cardItems.length > 0) {
        storedId = cardItems[0].shopId;
    }

    // If there is, we will show only 1 store, else - all
    if (storedId) {
        showShop(storedId)
    } else {
        showAllShops()
    }
    
});
  

// Show all shops
function showAllShops(){
    const shopElements = document.querySelectorAll('.list-group-item.list-group-item-action.py-3.lh-sm');
    shopElements.forEach((shopElement) => {
        const shopId = shopElement.getAttribute('data-shop-id');

        shopElement.addEventListener('click', () => {    
            fetch(`api/products/?shop=${shopId}`)  
                .then(response => response.json())
                .then(data => {
                    createProductCard(data)
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        });
    });
}


// Create product card from all data from store
function createProductCard(data){
    const productsContainer = document.getElementById('product-container');
    productsContainer.innerHTML = '';

    // Loop through the products and create HTML elements to display them
    data.forEach(product => {
        
        // Main container of product
        const productElement = document.createElement('div');
        productElement.className = "card col-sm-6 mb-4";

        // Body of product with id
        const cardBody = document.createElement('div');
        cardBody.className = "card-body";
        cardBody.id = `product-${product.id}`;
        productElement.appendChild(cardBody);

        // Title of product 
        const productName = document.createElement('h5');
        productName.className = "card-title";
        productName.textContent = product.name;
        cardBody.appendChild(productName);

        // Image of product
        const productImage = document.createElement('img');
        productImage.classList.add('card-img-top');
        productImage.src = product.image;
        productImage.alt = 'Product Image';
        cardBody.appendChild(productImage);

        // Description of product
        const productDescription = document.createElement('p');
        productDescription.className = "card-text";
        productDescription.textContent = product.description;
        cardBody.appendChild(productDescription);

        // Price product 
        const productPrice = document.createElement('p');
        productPrice.className = "card-text";
        productPrice.textContent = `${product.price}$`;
        cardBody.appendChild(productPrice);

        // Place for future alert message
        const alertMessage = document.createElement('div');
        alertMessage.id = `liveAlertPlaceholder-${product.id}`;
        cardBody.appendChild(alertMessage);

        // "Add to Cart" button
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.className = "btn btn-primary";
        addToCartButton.type = 'button';
        addToCartButton.id = `liveAlertBtn-${product.id}`;
        
        // Call the add to card function and pass the product ID and shop ID, show alert message
        addToCartButton.addEventListener('click', () => {
            addToCart(product);
            alertMessageButton(product.id);
            showShop(product.shop_id);
        });

        // Append product element and "Add to Cart" button to the container
        productElement.appendChild(addToCartButton);
        productsContainer.appendChild(productElement);        
    })
}


//Alert function to create a message about added to the card product 
function alertMessageButton(productId){

    // Get Placeholder and clean all inside
    const alertPlaceholder = document.getElementById(`liveAlertPlaceholder-${productId}`)
    alertPlaceholder.innerHTML = '';

    // Create alert message
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
    <div class="alert alert-success d-flex align-items-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" class="bi  flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        <div>
            The product is added
        </div>
    </div>
    `;
    alertPlaceholder.append(wrapper);


    // Set a timer to close the alert after 10 seconds
    setTimeout(() => {
        wrapper.remove();
    }, 2500);
}


// Add to card
function addToCart(product) {
    // Retrieve existing card items from local storage (if any)
    const cardItems = JSON.parse(localStorage.getItem('cardItems')) || [];

    // Check if the product already exists in the card
    const existingCartItem = cardItems.find(item => item.id === product.id && item.shopId === product.shop_id);
    
    if (existingCartItem) {
        // Product already exists, update the quantity
        existingCartItem.quantity += 1;
    } else {
        // Product does not exist, add it to the card
        const newCartItem = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            shopId: product.shop_id,
            quantity: 1,
            image: product.image,
        };
        cardItems.push(newCartItem);
    }
  
    // Update the card items in local storage
    localStorage.setItem('cardItems', JSON.stringify(cardItems));
}

  
// Show only one shop if there is any product in local storage
function showShop(shopId) {

    // First hide all shops
    hideOtherShops();

    // Get specific shop and show only it
    const shopElement = document.querySelector(`[data-shop-id='${shopId}']`);
    if (shopElement) {
      shopElement.style.display = 'block';
      shopElement.addEventListener('click', () => {    
        fetch(`api/products/?shop=${shopId}`)  
            .then(response => response.json())
            .then(data => {
                createProductCard(data)
            })
            .catch(error => {
                console.log('Error:', error);
            });
    });
};
}


// Hide other shops
function hideOtherShops() {

    // Get all shops and for each set display none
    const shopElements = document.querySelectorAll('.list-group-item.list-group-item-action.py-3.lh-sm');
    shopElements.forEach((shopElement) => {
        shopElement.style.display = 'none';
      });
}