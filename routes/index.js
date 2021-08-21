var express = require("express"),
    router = express.Router();

var index = require('../controllers/index');

router.get("/display_items", index.displayItems);
router.put("/shop", index.order);
router.post("/add", index.addItem);
router.put("/delete", index.deleteItem);
router.get("/amount", index.totalAmount);
router.get("/transaction_summary", index.transactionSummary);
router.delete("/cancel/:id", index.cancel);
router.get("/cancel_orders", index.canceledOrders);
router.put("/reset", index.resetQuantity);


module.exports = router;