const addProductButton = document.getElementById('addProductBtn');
const productTable = document.getElementById('product-table');
const productTableBody = document.querySelector('#product-table tbody');

const inputProductName = document.getElementById('productName');
const inputProductDesc = document.getElementById('productDescription');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');

const updateName = document.getElementById('updateName');
const updateDesc = document.getElementById('updateDescription');
const updatePrice = document.getElementById('updatePrice');
const updateQty  = document.getElementById('updateQuantity');


const endpoint_Communities = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Communities";
const endpoint_Users = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Users";
const endpoint_Posts = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/posts";
const endpoint_Products = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/products";
const endpoint_Events = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Events";


class Products {
    constructor(title, description, price, qty) {
        this.name = title;
        this.description = description;
        this.price = price;
        this.qty = qty;
    }
}

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

    static updateProduct(product) {
        return $.ajax({
            url: endpoint_Products + `/${product.id}`,
            dataType: 'json',
            data: JSON.stringify(product),
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


class DOMManager {
    static products;

    static getAllProducts() {
        ProductService.getAllProducts().then(products => this.render(products));
    }

    static render(products) {
        this.products = products;
        $('#productTableBody').empty();
        $.get(endpoint_Products).then(data => {
            data.map(products => {
                $("#productTableBody").prepend(
                  $(`
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
                                <span><small>${
                                  products.description
                                }</small></span>
                            </div>
                        </td>
                        <td>$${products.price}</td>
                        <td class="quantity">
                            <span><b>${products.qty}</b></span>
                        </td>
                        <td>$${products.price * products.qty}</td>
                        <td>
                            <button class="btn btn-dark text-danger" onclick="DOMManager.deleteProduct(${
                              products.id
                            })">Delete</button>
                        </td>
                        <td>
                            <button class="btn btn-dark text-primary" data-bs-toggle="collapse" data-bs-target="#collapseUpdate-${
                              products.id
                            }" type="button" aria-expanded="false" aria-controls="collapseUpdate-${
                    products.id
                  }">Edit</button>
                        </td>
                    </tr>
                    <tr class="collapse" id="collapseUpdate-${products.id}">
                        <form>
                            <td>
                                <div class="id">
                                    <span><b>${products.id}<b><span>
                                </div>
                            </td>
                            <td>
                                <label for="updateName-${
                                  products.id
                                }" class="form-label">Product Name</label>
                                <input type="text" style="width: 250px" class="form-control col" id="updateName-${
                                  products.id
                                }" placeholder="Words">
                            </td>
                            <td>
                                <label for="updatePrice-${
                                  products.id
                                }" class="form-label">Price</label>
                                <input type="number" style="width: 100px" step="0.01" class="form-control col" id="updatePrice-${
                                  products.id
                                }" placeholder="$0.00">
                            </td>
                            <td>
                                <label for="updateQuantity-${
                                  products.id
                                }" class="form-label">Quantity</label>
                                <input type="number" style="width: 65px" class="form-control col" id="updateQuantity-${
                                  products.id
                                }" placeholder="42">
                            </td>
                            <td>
                                <label for="updateDescription-${
                                  products.id
                                }" class="form-label col">Product Description</label>
                                <input type="text" class="form-control" colspan="2" id="updateDescription-${
                                  products.id
                                }" placeholder="Describe your Product">
                            </td>
                            <td>
                                &nbsp;
                            </td>
                            <td>
                                <button class="btn btn-dark text-primary" id="" onclick="DOMManager.updateProduct('${
                                  products.id
                                }})">Done</button>
                            </td>
                        </form>    
                    </tr>
                    `)
                );
            })
        })
    }

    static deleteProduct(id) {
        console.log(`this is the id: ${id} in the deleted product`)
        ProductService.deleteProduct(id).then(() => {
            return ProductService.getAllProducts();
        }).then((products) => this.render(products));
    }

    static createProduct() {
        console.log(`createProduct ran`)
        let newProduct = new Products(inputProductName.val(), Intl.NumberFormat().format(inputProductDesc.val()), inputPrice.val(), inputQuantity.val())
        ProductService.updateProduct(newProduct) 
        .then(() => {
            return ProductService.getAllProducts;
        })
        .then((products) => this.render(products));
    }

    static updateProduct(id) {
        ProductService.updateProduct(id)
        .then(() => {
            return ProductService.getAllProducts();
        })
        .then((products) => this.render(products));
    }
}


$('#addProductBtn').on('click', function(){
    DOMManager.createProduct(inputProductName).val();
    inputProductName.val('');
});


DOMManager.getAllProducts();





/*

async function getProducts() {
    fetch(endpoint_Products)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error))
}



$.get(endpoint_Products).then(data => {
    data.map(products => {
        $('tbody').append(
            $(`
            <tr>
                <td>
                    <div class="id">
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
                    <button class="btn btn-dark text-danger" onclick="deleteProduct(${products.id})">Delete</button>
                </td>
            </tr>
            `)
        )
    })
})

function deleteProduct(id) {
    $.ajax(`${endpoint_Products}` + `/${id}`, {
        type: "DELETE",
    })
    console.log(id)
    location.reload()
}

static deleteProduct(id) {
    $.ajax(`${endpoint_Products}` + `/${id}`, {
        type: "DELETE",
    })
    console.log(id)
    DOMManager.render()


//let productPrice = Intl.NumberFormat('en-US').format($('#price').val())

*/


