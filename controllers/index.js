//import the array of object form the Items file
var items = require('../Items');

const { v4 : uuidv4 } = require('uuid');

//import the array of object from the Quantity file
var defaultQuantity = require('../Quantity');

//Initializing the required variables
var total_cash = 0;
var total_items = 0;
var transaction = [];
var i=1;
var t=[];

//Displaying all the Items in the vending machine
exports.displayItems = (req, res) => {
    res.json(items);
}

//Purchasing the Items
//gets the name, quantity, and amount from the client and return the item and balance if any.
exports.order = (req, res) => {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var amount = req.body.amount;
    var total=0,quarter=0,dime=0,nickel=0,penny=0;
    for(let i in amount)
        total += (i * amount[i]);
    const found = items.some(item=>item.name === name);
    if(found){
        items.forEach(item =>{
            if(item.name === name) {
                var price = item.price * quantity;
                if(item.quantity>=quantity && total>=price) {
                    total=total-price;
                    item.quantity=item.quantity-quantity;
                    var obj = {
                        "transaction_id" : uuidv4(),
                        "name" : item.name,
                        "quantity" : quantity,
                        "price" : price
                    }
                    transaction.push(obj);
                    var change = total;
                    total_cash += price;
                    total_items += quantity;
                    //calculating the change in quarters, dime, nickel, penny
                    while(total>0) {
                        if(total >= 25) {
                            quarter++;
                            total-=25;
                            continue;
                        }
                        if(total >= 10) {
                            dime++;
                            total-=10;
                            continue;
                        }
                        if(total >= 5) {
                            nickel++;
                            total-=5;
                            continue;
                        }
                        if(total >= 1) {
                            penny++;
                            total-=1;
                            continue;
                        }
                    }
                    res.json({msg:`${item.name} is delivered and the balance is ${change}`, quarter : `${quarter}`, dime : `${dime}`, nickel : `${nickel}`, penny : `${penny}`});
                } else {
                    res.status(400).send("Insufficient Balance");
                }
            }
        });
    } else {
        res.status(400).json({msg : `No such item`});
    }
}

//Adding new Items in the machine
exports.addItem = (req, res) => {
    var newItem = {
        "name" : req.body.name,
        "price" : req.body.price,
        "quantity" : req.body.quantity
    }

    const found=items.some(item=> item.name === newItem.name);
    if(found)
        return res.status(400).json({msg:`There is already item in this name`})
    if(newItem == null) 
        return res.status(400).json({msg:`The field is empty`})
    items.push(newItem);
    return res.status(200).json({msg: "Item Added"});
}

//deleting the items in the machine
exports.deleteItem = (req, res) => {
    var name =req.body.name;
    const found = items.some(item=> item.name === name);
    if(found){
        items = items.filter(item=> item.name !== name);
        res.status(200).json({
            msg : `Member Deleted`,
            Items : items.filter(item => item.name !== name)
        });
    } else {
        res.json({msg: "No such item name"});
    }
}

//Displaying the total amount earned and total items sold
exports.totalAmount = (req, res) => {
    res.status(200).json({msg:`Total Cash Earned : ${total_cash} Total Items Sold : ${total_items}`,Remaining_Items : items});
}

//Displaying the transaction summary
exports.transactionSummary = (req, res) => {
    res.status(200).json({msg : `Transaction Summary`, Transation : transaction});
}

//cancelling the order 
exports.cancel = (req, res) => {
    var id = req.params.id;
    var foundItem = false;
    for(let i in transaction) {
        if(id == transaction[i].transaction_id) {
            for(let j in items) {
                if(items[j].name == transaction[i].name) {
                    items[j].quantity += transaction[i].quantity;
                    var amt_rt = transaction[i].quantity*items[j].price;
                    res.json({msg : `${transaction[i].name} is canceled and cash of ${amt_rt} is returned.`})
                    t.push(transaction[i]);
                    total_cash -= amt_rt;
                    total_items -= transaction[i].quantity; 
                    foundItem=true;
                    break;
                }
            }
        }
    }
    if(!foundItem)
        res.json({msg : `No such transaction`})
    transaction = transaction.filter( tran => tran.id != id);
}

//Displays the canceled order 
exports.canceledOrders = (req, res) => {
    res.json({msg :`Cancelled Orders`, Summary : t})
}


//Reseting the machine which reset the machine to default quantity
exports.resetQuantity = (req, res) => {
    for(let i in items) {
        for(let j in defaultQuantity) {
            if(items[i].name === defaultQuantity[j].name) {
                items[i].quantity = defaultQuantity[j].quantity;
                break;
            }
        }
    }
    res.json({msg : `The items are reset`});
}

