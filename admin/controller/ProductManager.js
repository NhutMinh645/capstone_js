

import Product from '../model/Product.js';

const apiUrl = 'https://672df5b3fd89797156446d13.mockapi.io/Products';
export default class ProductManager {
    loadProducts() {
        return axios.get(apiUrl);
    }
    
    addProduct(product) {
        return axios.post(apiUrl, product);
    }

    updateProduct(id, product) {
        return axios.put(`${apiUrl}/${id}`, product);
    }

    deleteProduct(id) {
        return axios.delete(`${apiUrl}/${id}`);
    }

    searchProduct(name) {
        return axios.get(`${apiUrl}?search=${name}`);
    }

    sortProducts(order) {
        return this.loadProducts().then(response => {
            let products = response.data;
            if (order === 'asc') {
                products.sort((a, b) => a.price - b.price);
            } else if (order === 'desc') {
                products.sort((a, b) => b.price - a.price);
            }
            return products;
        });
    }

    
}