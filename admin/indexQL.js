
import  Product  from './model/Product.js';
import  ProductManager  from './controller/ProductManager.js';
import  Validation from './controller/productValidation.js';
const productManager = new ProductManager();

$(document).ready(function () {
    loadProducts();

    $('#sortPrice').on('change', function () {
        const order = $(this).val();
        productManager.sortProducts(order).then(sortedProducts => {
            renderProducts(sortedProducts);
        });
    });

    $('#btnThem').on('click', function () {
        clearForm();
        hideErrorMessage();
        $('#myModal').show();
        $('#header-title').text('Thêm sản phẩm');
        $('#btnAddProduct').show();
        $('#btnUpdateProduct').hide();
    });

    $('#btnAddProduct').on('click', function () {
        const product = getProductFormData();
        const { isValid, errors } = Validation.validateProduct(product); 
    
       
        if (!isValid) {
            $('#error-productName').text(errors.name || '');
            $('#error-productPrice').text(errors.price || '');
            $('#error-productImg').text(errors.img || '');
            $('#error-productScreen').text(errors.screen || '');
            $('#error-productBackCamera').text(errors.backCamera || '');
            $('#error-productFrontCamera').text(errors.frontCamera || '');
            $('#error-productDesc').text(errors.desc || '');
            $('#error-productType').text(errors.type || '');
          
        } else {
            productManager.addProduct(product).then(() => {
                loadProducts();
                closeModal();
            });
        }
    });

    $('#btnUpdateProduct').on('click', function () {
        const productId = $(this).data('id');
        const product = getProductFormData();
    
        
        const { isValid, errors } = Validation.validateProduct(product);
        
        
        if (!isValid) {
            $('#error-productName').text(errors.name || '');
            $('#error-productPrice').text(errors.price || '');
            $('#error-productImg').text(errors.img || '');
            $('#error-productScreen').text(errors.screen || '');
            $('#error-productBackCamera').text(errors.backCamera || '');
            $('#error-productFrontCamera').text(errors.frontCamera || '');
            $('#error-productDesc').text(errors.desc || '');
            $('#error-productType').text(errors.type || '');
            return; 
        }
    
        
        productManager.updateProduct(productId, product).then(() => {
            loadProducts();
            closeModal();
            
        });
    });
    
    $('#btnClose').on('click', closeModal);

    $('#btnTimSP').on('click', function () {
        const searchName = $('#searchName').val().trim();
        productManager.searchProduct(searchName).then(response => renderProducts(response.data));
    });
});
function loadProducts() {
    productManager.loadProducts()
        .then(response => renderProducts(response.data))
        .catch(error => console.error('Error loading products:', error));
}

function renderProducts(products) {
    const tableBody = $('#tableDanhSach');
    tableBody.empty();
    if (products.length === 0) {
        tableBody.append('<tr><td colspan="4" class="text-center">Không có sản phẩm nào.</td></tr>');
    } else {
        products.forEach(product => {
            tableBody.append(`
                <tr class="hover:bg-gray-100">
                    <td class="border px-4 py-2"><img src="${product.img}" alt="${product.name}" class="mx-auto w-24 h-auto rounded-md"></td>
                    <td class="border px-4 py-2">${product.name}</td>
                    <td class="border px-4 py-2">$${product.price}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="editProduct(${product.id})">Sửa</button>
                        <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteProduct(${product.id})">Xóa</button>
                    </td>
                </tr>
            `);
        });
    }
}

function editProduct(id) {
    productManager.loadProducts().then(response => {     
        
        const product = response.data.find(p => p.id == id); 
        if (product) {
            fillFormWithProductData(product);
            $('#myModal').show();
            $('#header-title').text('Cập nhật sản phẩm');
            $('#btnUpdateProduct').data('id', id).show();
            $('#btnAddProduct').hide();
        } 
    });
}



function deleteProduct(id) {
        productManager.deleteProduct(id).then(() => loadProducts());
}

function fillFormWithProductData(product) {
    $('#productName').val(product.name);
    $('#productPrice').val(product.price);
    $('#productScreen').val(product.screen);
    $('#productBackCamera').val(product.backCamera);
    $('#productFrontCamera').val(product.frontCamera);
    $('#productImg').val(product.img);
    $('#productDesc').val(product.desc);
    $('#productType').val(product.type);
}

function getProductFormData() {
    return new Product(
        $('#productName').val(), 
        $('#productPrice').val(), 
        $('#productScreen').val(),
        $('#productBackCamera').val(),
        $('#productFrontCamera').val(),
        $('#productImg').val(),
        $('#productDesc').val(),
        $('#productType').val()
    );
}




function closeModal() {
    $('#myModal').hide();
    clearForm();
}


function clearForm() {  
    $('#productName').val(''); 
    $('#productPrice').val(''); 
    $('#productScreen').val(''); 
    $('#productBackCamera').val(''); 
    $('#productFrontCamera').val(''); 
    $('#productImg').val(''); 
    $('#productDesc').val(''); 
    $('#productType').val(''); 

    $('#error-productName').text('');
    $('#error-productPrice').text('');
    $('#error-productImg').text('');
    $('#error-productScreen').text('');
    $('#error-productBackCamera').text('');
    $('#error-productFrontCamera').text('');
    $('#error-productDesc').text('');
    $('#error-productType').text('');
}

function hideErrorMessage() {
    
}
window.closeModal = closeModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;