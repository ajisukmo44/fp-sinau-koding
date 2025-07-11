const express = require('express');
const pool = require('../config/pg');

const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta'
});

// catalog crud 
async function getSummaryOrder() {
  const res = await pool.query('SELECT * FROM transaction_group');
  return res.rows;
};

async function getOmzet() {
    const res = await pool.query('SELECT SUM(subtotal_group) AS total_omzet FROM transaction_group');
    return res.rows[0];
};

async function getMenuOrder() {
    const res = await pool.query('SELECT SUM(quantity) AS total_menu_order FROM transaction_item');
    return res.rows[0];
};

async function getMenuOrderItem() {
    // const res = await pool.query('SELECT ti.*, count(c.category) AS total_item_category FROM transaction_item ti, JOIN catalog c WHERE ti.catalog_id = c.id GROUP BY c.category');
    const res = await pool.query(`SELECT c.category, SUM(ti.quantity) AS total_item_category FROM transaction_item ti JOIN catalog c ON ti.catalog_id = c.id GROUP BY c.category`);
    return res.rows;
};

async function getMenuOrderItemDetail(id) {
    const cat = id;
    const res = await pool.query(`SELECT c.name, SUM(ti.quantity) AS total_sales FROM transaction_item ti JOIN catalog c ON ti.catalog_id = c.id WHERE c.category = $1 GROUP BY c.name`, [cat]);
    return res.rows;
};


module.exports = { getSummaryOrder, getOmzet, getMenuOrder, getMenuOrderItem, getMenuOrderItemDetail  };