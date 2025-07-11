// create a handler for Transaction
const  { getSalesReport, getTransactionById, getTransactionItemByGroupId  }  = require("../../models/transaction.model.js");
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../config/pg.js');

exports.getReportSales = async (req, res, next) => {
    // const Transaction = await pool.query('SELECT * FROM transaction');
    let salesReport = await getSalesReport();
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      const output = {
        message: "List of Transaction",
        data: salesReport,
        status: "success",
      };
      res.write(JSON.stringify(output));
      res.end();

    } catch (err) {
    res.status(500).json({message: err, success: false});
    }
}

exports.getReportSalesDetail = async (req, res, next) => {
  // const Transaction = await pool.query('SELECT * FROM transaction');
  const id = req.params.id;
  // res.json({id, success: true});
  try {
  const TransactionDetail = await getTransactionById(id);
  const TransactionItem = await getTransactionItemByGroupId(id);
  const output = {
    message: "Detail of Transaction",
    data: TransactionDetail,
    dataItem : TransactionItem,
    status: "success",
  };
  if (TransactionDetail) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(output));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Transaction not found" }));
  }
} catch (err) {
  res.status(500).json({message: err, success: false});
  }
  res.end();
   
}


