document.addEventListener('DOMContentLoaded', () => {
    getCartItems()
    displayCartItems();

    // Send submitted form to the server
    document.getElementById('order-form').addEventListener('submit', function(event) {
        event.preventDefault();
        

        // Get form that submit user and create FormData
        const form = event.target;
        const formData = new FormData(form);
        

        // Get from local storage products and total price 
        const selectedProducts = JSON.parse(localStorage.getItem('cardItems')) || [];
        const totalPrice = selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
        formData.append('cardItems', JSON.stringify(selectedProducts));
        formData.append('total_price', totalPrice);
     

        // Send the form data to the server
        fetch('', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Redirect the user to the index page, clean local storage and alert about success
                localStorage.removeItem('cardItems');
                alert("You're order is submit")
                window.location.href = 'http://127.0.0.1:8000/delivery/';
            } else {
                alert("Try again")
            }
        })
    });
});


// Retrieve card items from local storage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cardItems')) || [];
}


// Display card items on the page
function displayCartItems() {
    const cardItems = getCartItems();
    const cardItemsContainer = document.getElementById('card-items-container');

    // Clear the existing card items
    cardItemsContainer.innerHTML = '';

    // Loop through the card items and create HTML elements to display them
    cardItems.forEach(item => {

        // Main container
        const cardColContainer = document.createElement('div');
        cardColContainer.classList.add('col', 'mb-3');
        
        // Card
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');
        
        // Image for card
        const cardImage = document.createElement('img');
        cardImage.classList.add('card-img-top');
        cardImage.src = item.image;
        cardImage.alt = 'Product Image';
        
        // Body of card
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        
        // Title card
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = item.name;
        
        // Description of card
        const cardDescription = document.createElement('p');
        cardDescription.classList.add('card-text');
        cardDescription.textContent = `${item.price}$`;

        // Input group container
        const containerQuantityAndDelete = document.createElement('div');
        containerQuantityAndDelete.className = 'input-group mb-3';

        // Quantity
        const quantityInput = document.createElement('input');
        quantityInput.setAttribute('type', 'number');
        quantityInput.setAttribute('value', item.quantity);
        quantityInput.setAttribute('min', '1');
        quantityInput.className = 'form-control';

        // Event to change number quantity
        quantityInput.addEventListener('change', () => {
            updateQuantity(item.id, quantityInput.value);
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList = ('btn btn-outline-danger');
        deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
        </svg>
        Delete
        `;
        // Event for delete
        deleteButton.addEventListener('click', () => {
            deleteItem(item.id);
        });
        
        
        // Append the elements to their respective containers
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDescription);
        containerQuantityAndDelete.appendChild(quantityInput);
        containerQuantityAndDelete.appendChild(deleteButton);
        cardBody.appendChild(containerQuantityAndDelete);
        cardContainer.appendChild(cardImage);
        cardContainer.appendChild(cardBody);
        cardColContainer.appendChild(cardContainer);

        // Append the card container to the card items container
        cardItemsContainer.appendChild(cardColContainer);
    });

    // If there is no product, no total price
    if(cardItemsContainer.innerHTML === ""){
        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.remove();
    } else {
        totalPrice();
    }
}


// Total price
function totalPrice(){
    // Retrieve cardItems from local storage
    const cardItems = getCartItems();
    const totalPrice = cardItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const formattedTotalPrice = totalPrice.toFixed(2);

    // Update the HTML element with the total price
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = `Total price: ${formattedTotalPrice}$`;
}


// Update quantity
function updateQuantity(itemId, newQuantity) {
    const cardItems = getCartItems();
  
    // Find the item in the card
    const item = cardItems.find((item) => item.id === itemId);
    
    if (item) {
      // Update the quantity
      item.quantity = parseInt(newQuantity);
  
      // Update the card items in local storage
      localStorage.setItem('cardItems', JSON.stringify(cardItems));
    }
    // Call the totalPrice function to update the total price
    totalPrice();
}
 

// Delete product
function deleteItem(itemId) {
    const cardItems = getCartItems();
  
    // Find the index of the item in the card
    const itemIndex = cardItems.findIndex((item) => item.id === itemId);
    
    if (itemIndex !== -1) {
      // Remove the item from the card
      cardItems.splice(itemIndex, 1);
  
      // Update the card items in local storage
      localStorage.setItem('cardItems', JSON.stringify(cardItems));
    }
    // Call the totalPrice function to update the total price
    displayCartItems()
}

