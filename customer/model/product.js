
export default class Product {
    constructor(id, name, price, img, screen, backCamera, frontCamera, desc, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.screen = screen;
        this.backCamera = backCamera;
        this.frontCamera = frontCamera;
        this.desc = desc;
        this.type = type;
    }
}