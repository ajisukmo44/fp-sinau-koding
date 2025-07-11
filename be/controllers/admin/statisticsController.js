// create a handler for Transaction
const  { getSummaryOrder, getOmzet, getMenuOrder, getMenuOrderItem, getMenuOrderItemDetail }  = require("../../models/statistics.model.js");
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/pg.js');

exports.getSummary = async (req, res, next) => {
    // const Transaction = await pool.query('SELECT * FROM transaction');
    let orderTotal = await getSummaryOrder();
    let omzetData = await getOmzet();
    let menuOrder = await getMenuOrder();
    let menuCategoryOrder = await getMenuOrderItem();

    
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      const output = {
        message: "List of Transaction",
        data: {
          total_order : orderTotal.length,
          total_omzet : omzetData.total_omzet,
          total_menu : menuOrder.total_menu_order,
          total_beverages : menuCategoryOrder.filter((cat) => cat.category == 'beverages')[0].total_item_category,
          total_desserts : menuCategoryOrder.filter((cat) => cat.category == 'desserts')[0].total_item_category,
          total_foods : menuCategoryOrder.filter((cat) => cat.category == 'foods')[0].total_item_category,
        },
        status: "success",
      };
      res.write(JSON.stringify(output));
      res.end();

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}

exports.getSummaryDetail = async (req, res, next) => {
    const id = req.params.id;
    let menuDetailOrder = await getMenuOrderItemDetail(id);
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      const output = {
        message: "List of Transaction",
        data: menuDetailOrder,
        status: "success",
      };
      res.write(JSON.stringify(output));
      res.end();

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}



