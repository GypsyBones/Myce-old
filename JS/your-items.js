/* 
   lit-html snippet - Begin
   Add to the top of your code. Works with html or jsx!
   Formats html in a template literal  using the lit-html library 
   Syntax: html`<div> html or jsx here! variable </div>`
*/
//lit-html snippet - Begin
let html = (strings, ...values) => {
    let str = "";
    strings.forEach((string, i) => {
      str += string + (values[i] || "");
    });
    return str;
  };
  //lit-html snippet - End


const addProductButton = document.getElementById('addProductBtn');
const productTable = document.getElementById('product-table');
const productTableBody = document.querySelector('#product-table tbody');


const endpoint_Communities = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Communities";
const endpoint_Users = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Users";
const endpoint_Posts = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/posts";
const endpoint_Products = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/products";
const endpoint_Events = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Events";
//TODO - make separate pages for the other endpoints, also, add comments to the posts from both users and communities
//configure other datapoints needed (a lot) 

// NOTE: below - creating a class for the products that list all the parameters needed to interact with the mockapi
class Products {
    constructor(title, description, price, qty) {
        this.name = title;
        this.description = description;
        this.price = price;
        this.qty = qty;
    }
}


//NOTE: below - preoduct service filters out and interacts with the information at the API end of the code
class ProductService {
    static getAllProducts() {
        return $.get(endpoint_Products);
    }

    static getProduct(id) {
        return $.get(endpoint_Products + `/${id}`);
    }

    static createProduct(product) {
        return $.post(endpoint_Products, product);
    }

    static updateProduct(productId, productData) {
        console.log(`this is the productServiceUpdate for product`, productId)
        return $.ajax({
            url: endpoint_Products + `/${productId}`,
            dataType: 'json',
            data: JSON.stringify(productData),
            contentType: 'application/json',
            type: 'PUT',
        });
    }

    static deleteProduct(id) {
        console.log(id);
        $.ajax(`${endpoint_Products}` + `/${id}`, {
            type: "DELETE",
        });
//NOTE: The code below gets the individual row and removes it, that way the page updates when the API call goes out. 
        let row = document.getElementById(`${id}-row`);
        row.parentNode.removeChild(row);
    }
}

/*NOTE: below - domManager holds a majority of the directing of the code, calling on the various statics of the 
ProductService class to filter the information, where the DOMManager then determines how the information will 
be handled.
*/
class DOMManager {
    static products;

    static getAllProducts() {
        ProductService.getAllProducts().then(products => this.render(products));
    }
//NOTE: above - grabbing the information through the ProductService class and then rendering the products where they are called.

//NOTE: below - clearing out the table body, then getting the products from the api endpoint, then taking the data and mapping
//it out at the table body in a prepend position (latest first). 
    static render(products) {
        this.products = products;
        $('#productTableBody').empty();
        $.get(endpoint_Products).then(data => {
            data.map(products => {
                $("#productTableBody").prepend(
                  $(html`
<!--NOTE: Added Products.id-row to identify the row to remove-->
                    <tr id="${products.id}-row">
                        <td>
                            <div class="id" >
                                <span><b>${products.id}<b><span>
                            </div>
                        </td>
                        <td>
                            <div class="Name">
                                <span><b>${products.name}</b></span><br>
                                <span><small>${products.description}</small></span>
                            </div>
                        </td>
                        <td>$${products.price}</td>
                        <td class="quantity">
                            <span><b>${products.qty}</b></span>
                        </td>
                        <td>$${products.price * products.qty}</td>
                        <td>
                            <button class="btn btn-dark text-danger" onclick="DOMManager.deleteProduct('${products.id}')">
                                Delete</button>
                        </td>
                        <td>
                            <button class="btn btn-dark text-primary" data-bs-toggle="collapse" 
                                data-bs-target="#collapseUpdate-${products.id}" type="button" aria-expanded="false" 
                                aria-controls="collapseUpdate-${products.id}">Edit</button>
                        </td>
                    </tr>
                    <tr class="collapse" id="collapseUpdate-${products.id}">
//TODO push the current information of the product into the input fields for the collapsible update form for usability
                        <form>
                            <td>
                                <div class="id">
                                    <span><b>${products.id}<b><span>
                                </div>
                            </td>
                            <td>
                                <label for="updateName-${products.id}" class="form-label">Product Name</label>
                                <input type="text" style="width: 250px" class="form-control col" 
                                    id="updateName-${products.id}" placeholder="Words">
                            </td>
                            <td>
                                <label for="updatePrice-${products.id}" class="form-label">Price</label>
                                <input type="number" style="width: 100px" step="0.01" class="form-control col" 
                                    id="updatePrice-${products.id}" placeholder="$0.00">
                            </td>
                            <td>
                                <label for="updateQuantity-${products.id}" class="form-label">Quantity</label>
                                <input type="number" style="width: 65px" class="form-control col" 
                                    id="updateQuantity-${products.id}" placeholder="42">
                            </td>
                            <td>
                                <label for="updateDescription-${products.id}" 
                                    class="form-label col">Product Description</label>
                                <input type="text" class="form-control" colspan="2" 
                                    id="updateDescription-${products.id}" placeholder="Describe your Product">
                            </td>
                            <td>
                                &nbsp;
                            </td>
                            <td>
                                <button class="btn btn-dark text-primary" id="" 
                                    onclick="DOMManager.updateProduct('${products.id}')">Done</button>
                            </td>
                        </form>    
                    </tr>
                    `)
                );
            })
        })
    }

//NOTE: below - consoles for debugging, takes the id that is filtered through the parameter to identify and call upon the 
//productService classed version of the deleteproduct to interact with the API. Then we return the getAllProducts and 
//rerenders the refreshed textbody without the deleted item
    static deleteProduct(id) {
        console.log(`this is the id: ${id} in the deleted product`)
        ProductService.deleteProduct(id).then(() => {
            return ProductService.getAllProducts();
        }).then((products) => this.render(products));
    }

//NOTE: below - logged to the console for debugging, placed const queries with a .value to get the value ahead of the code
// consts had to be initialized within this function for them to work within the productData area, which is crucial for 
//connection and interactability with the MockAPI
//Then filtered it to the productService versioned function with the productData variable that wa created, 
//then returned the products and rendered them again.
    static createProduct() {
        console.log(`createProduct ran`)
        
        const inputProductName = document.getElementById('productName').value;
        const inputProductDesc = document.getElementById('productDescription').value;
        const inputPrice = document.getElementById('price').value;
        const inputQuantity = document.getElementById('quantity').value;

        let productData = {
            name: inputProductName,
            description: inputProductDesc,
            price: inputPrice,
            qty: inputQuantity,
        }

        ProductService.createProduct(productData) 
        .then(() => {
            return ProductService.getAllProducts;
        })
        .then((products) => this.render(products));
    }


//NOTE: utilized much of the same code as createProduct function, which was to initialize the variables 
//within the function, get the value from the input fields, order it through the productData variable that 
//was created within the function, and then send that out to the ProductService's function. Then get and render.
    static updateProduct(id) {
        console.log(`this ${id} is updated`)
        
        const updateName = document.getElementById(`updateName-${id}`).value;
        const updateDesc = document.getElementById(`updateDescription-${id}`).value;
        const updatePrice = document.getElementById(`updatePrice-${id}`).value;
        const updateQty  = document.getElementById(`updateQuantity-${id}`).value;

        let productData = {
            name: updateName,
            description: updateDesc,
            price: updatePrice,
            qty: updateQty,
        }

        ProductService.updateProduct(id, productData)
        .then(() => {
            return ProductService.getAllProducts();
        })
        .then((products) => this.render(products));
    }
}

//NOTE: just the coding that calls up the createProduct function from the appropriate button
$('#addProductBtn').on('click', function(){
    DOMManager.createProduct();
});


DOMManager.getAllProducts();

