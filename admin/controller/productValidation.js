
export default class Validation {
    static validateProduct(product) {
        let isValid = true;
        const errors = {};

        // Kiểm tra tên sản phẩm
        if (!product.name) {
            errors.name = 'Tên sản phẩm không được để trống.';
            isValid = false;
        }

        // Kiểm tra giá
        if (!product.price || product.price <= 0) {
            errors.price = 'Giá sản phẩm phải lớn hơn 0.';
            isValid = false;
        }
        if (!product.price) {
            errors.price = 'Giá không được để trống.';
            isValid = false;
        }
       
        if (!product.img) {
            errors.img = 'Hình ảnh không được để trống.';
            isValid = false;
        }
        if (!product.desc) {
            errors.desc = 'Mô tả không được để trống.';
            isValid = false;
        }
        if (!product.type) {
            errors.type = 'Loại sản phẩm không được để trống.';
            isValid = false;
        }
        if (!product.frontCamera) {
            errors.frontCamera = 'Camera trước không được để trống.';
            isValid = false;
        }
        if (!product.backCamera) {
            errors.backCamera = 'Camera sau không được để trống.';
            isValid = false;
        }
        if (!product.screen) {
            errors.screen = 'Màn hình không được để trống.';
            isValid = false;
        }

        return { isValid, errors };
    }
}

