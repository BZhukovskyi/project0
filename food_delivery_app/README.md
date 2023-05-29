# Delivery App
The Delivery app allows users to choose a store, add products to their cart, and submit orders. It provides a convenient way to browse and purchase products from different stores.

## Installation
1. Install Django by running the following command:
```
python -m pip install Django
```
2. Navigate to the folder where manage.py is located.
3. Run the following commands to set up the app:
```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
4. Access the app through a web browser at http://localhost:8000/.

## Usage
1. Browse the "Shop" page to select a store.
2. Choose products from the selected store and add them to your cart.
3. Visit the "Cart" page to review and modify the selected products.
4. Adjust the quantity or remove products from the cart.
5. Submit the order by filling out the required information.
6. Upon submission, the order is processed and the user receives confirmation.

## Features
* Store selection: Choose a store to browse its available products.
* Cart management: Add, remove, and modify quantities of products in the cart.
* Order submission: Fill out necessary details and submit the order.
* User-friendly interface: Intuitive design and easy navigation.

## Technologies Used
* Python
* Django framework
* JavaScript (JS)
* Bootstrap
* HTML

## App Structure
* **food_delivery_project**: Main folder containing project settings.
* **delivery_app/models.py**: Defines the database structure and models.
* **delivery_app/views.py**: Handles HTTP requests and renders the appropriate templates.
* **delivery_app/admin.py**: Configuration for managing models in the admin site.
* **static**: Directory for JavaScript files.
* **templates**: Directory for HTML templates.

## Contributing
Contributions to the app are welcome. If you encounter any issues or have feature suggestions, please submit a bug report or feature request.