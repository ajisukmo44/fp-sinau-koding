const express = require('express');
const pool = require('../config/pg');
const sequelize = require('../config/pg-sequelize');

const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta'
});

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
    const res = await pool.query(`SELECT c.category, SUM(ti.quantity) AS total_item_category FROM transaction_item ti JOIN catalog c ON ti.catalog_id = c.id GROUP BY c.category`);
    return res.rows;
};

async function getMenuOrderItemDetail(id) {
    const cat = id;
    const res = await pool.query(`SELECT c.name, SUM(ti.quantity) AS total_sales FROM transaction_item ti JOIN catalog c ON ti.catalog_id = c.id WHERE c.category = $1 GROUP BY c.name ORDER BY total_sales DESC`, [cat]);
    return res.rows;
};

async function getDailyChartCategoryOrder(startDate, endDate) {
    const res = await pool.query(`
        SELECT 
            DATE(tg.created_at) as date,
            c.category as label,
            SUM(ti.subtotal) as total
        FROM transaction_item ti
        JOIN catalog c ON ti.catalog_id = c.id
        JOIN transaction_group tg ON ti.transaction_group_id = tg.id
        WHERE DATE(tg.created_at) BETWEEN $1 AND $2
        GROUP BY DATE(tg.created_at), c.category
        ORDER BY date
    `, [startDate, endDate]);

    const dateList = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
        dateList.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }

    const grouped = {};
    res.rows.forEach(row => {
        if (!grouped[row.label]) {
            grouped[row.label] = { label: row.label, data: new Array(dateList.length).fill(0) };
        }
        const dateIndex = dateList.indexOf(row.date.toISOString().split('T')[0]);
        if (dateIndex !== -1) {
            grouped[row.label].data[dateIndex] = parseInt(row.total);
        }
    });
    
    return {
        dates: dateList,
        results: Object.values(grouped)
    };
};


module.exports = { getSummaryOrder, getOmzet, getMenuOrder, getMenuOrderItem, getMenuOrderItemDetail, getDailyChartCategoryOrder };