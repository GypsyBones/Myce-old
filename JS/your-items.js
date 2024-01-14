const addProductButton = document.getElementById('add-product');
const deleteBtn = document.getElementById('delete-btn');
const productTable = document.getElementById('product-table');
const productTableBody = document.querySelector('#product-table tbody');
const inputProductName = document.getElementById('productName');
const inputProductDesc = document.getElementById('productDescription');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');
const checkBox = document.getElementById('checkbox');

const url_endpoint = "https://65a096c3600f49256fb0123d.mockapi.io/api/v1/Communities";


addProductButton.addEventListener('click', (e) => {
    e.preventDefault(); // literally just copy-pasted a row below and put in the value constants
    const row = createHTMLElement(`
    <tr>
        <td>
            <div class="img"></div>
        </td>
        <td>
            <div class="Name">
                <span><b>${inputProductName.value}</b></span><br>
                <span><small>${inputProductDesc.value}</small></span>
            </div>
        </td>
        <td>$${inputPrice.value}</td>
        <td class="quantity">
            <span><b>${inputQuantity.value}</b></span>
        </td>
        <td>$${inputPrice.value * inputQuantity.value}</td>
        <td>
            <button id="delete-btn" class="btn btn-dark text-danger">Delete</button>
        </td>
    </tr>`)
    console.log(row)
    productTableBody.append(row);
    inputProductName.value = ''      // making sure that the inputs go back to nothing when adding the product
    inputProductDesc.value = ''
    inputPrice.value = ''
    inputQuantity.value = ''
})

//tried to utilize the deleteBtn query selector but it would only delete the first row. I even put a console.log
//      on there to see if it was even registering the click, but it wasn't?? 
//deleteBtn.addEventListener('click', (e) => {
//    let row = e.target.closest('tr');
//    console.log(e.target)
//    row.remove();
//})

//This is the click to delete function that was presented at class on Thursday.
productTable.addEventListener('click', (e) => {
    let row = e.target.closest('tr');
    console.log(e.target)
    row.remove();
})


function createHTMLElement(innerHTML) {
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    return template.content.firstElementChild;
}