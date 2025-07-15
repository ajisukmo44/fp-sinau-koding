const express = require('express');
const pool = require('../config/pg');
const jwt = require('jsonwebtoken');

const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta'
});

const JWT_SECRET = 'your-secret-key-change-in-production';

// Transaction crud 
async function getAllTransaction() {
  const res = await pool.query('SELECT * FROM transaction_group ORDER BY created_at DESC');
  return res.rows;
};

async function addTransaction(token, data) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
  const userID = userResult.rows[0].id;

  const res = await pool.query('INSERT INTO transaction_group (user_id, order_number, transaction_type, customer_name, table_number, subtotal_group, tax, cash, cashback) VALUES ($1, $2, $3, $4,  $5, $6, $7, $8, $9) RETURNING *', [userID, data.order_number, data.transaction_type, data.customer_name, data.table_number, data.subtotal_group, data.tax, data.cash, data.cashback]);
  return res.rows[0];
};

async function addTransactionItem(data) {
  const res = await pool.query('INSERT INTO transaction_item (transaction_group_id, catalog_id, note, quantity, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *', [data.transaction_group_id, data.catalog_id, data.note, data.quantity, data.subtotal]);
  return res.rows[0];
};

async function getTransactionById (id) {
  const res = await pool.query('SELECT tg.*, u.name AS cashier_name, u.username AS cashier_username FROM transaction_group tg JOIN "users" u ON tg.user_id = u.id WHERE tg.id = $1', [id]);
  return res.rows[0];
};

async function getTransactionItemByGroupId (id) {
  const res = await pool.query('SELECT ti.*, c.name, c.price FROM transaction_item ti JOIN catalog c ON ti.catalog_id = c.id  WHERE transaction_group_id = $1', [id]);
  return res.rows;
};

async function updateTransaction(id, transaction){
  let query = 'UPDATE transaction SET ';
  let values = [];
  let paramCount = 1;
  
  if (transaction.image !== undefined) {
    query += `image = $${paramCount}, `;
    values.push(Transaction.image);
    paramCount++;
  }
  
  query += `name = $${paramCount}, category = $${paramCount + 1}, price = $${paramCount + 2}, description = $${paramCount + 3}, updated_at = $${paramCount + 4} WHERE id = $${paramCount + 5} RETURNING *`;
  values.push(transaction.name, transaction.category, transaction.price, transaction.description, nDate, id);
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

async function deleteTransaction(id){
  
  // const res = await pool.query('DELETE FROM Transaction WHERE id = $1 RETURNING *', [id]);
  // return res.rows[0];
  const res = await pool.query('UPDATE transaction SET is_deleted = true, deleted_at = $1 WHERE id = $2 RETURNING *', [nDate,id]);
  return res.rows;
};


async function getSalesReport() {
  const res = await pool.query('SELECT * FROM transaction_group');
  return res.rows;
};


module.exports = { getAllTransaction, addTransaction, addTransactionItem, deleteTransaction, getTransactionById, updateTransaction, getTransactionItemByGroupId, getSalesReport };