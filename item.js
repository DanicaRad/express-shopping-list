const items = require('./fakeDb')

class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;

        items.push(this);
    }

    static findAll() {
        return items;
    }

    static find(name) {
        let foundItem = items.find(i => i.name === name);
        if(foundItem === undefined) {
            throw {message: "Not Found", status: 400};
        }
        return foundItem
    }

    static update(name, data) {
        let foundItem = Item.find(name);
        if(foundItem === undefined) {
            throw {message: "Not Found", status: 400}
        }
        foundItem.name = data.name;
        foundItem.price = data.price;

        return foundItem;
    }

    static delete(name) {
        let itemIdx = items.findIndex(i => i.name === name);
        if(itemIdx === -1) {
            throw {message: "Not Found", status: 404}
        }
        items.splice(itemIdx, 1);
    }
}

module.exports = Item;