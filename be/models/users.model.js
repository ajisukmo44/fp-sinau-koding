const express = require('express');
const pool = require('../config/pg');
const bcrypt = require('bcryptjs');

const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta'
});

// user crud 
async function getAllUser() {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
};

async function addUser(data) {
  const res = await pool.query('INSERT INTO users (avatar, role, name, username, email, status, password, language, created_at) VALUES ($1, $2, $3, $4,  $5, $6, $7, $8, $9) RETURNING *', [data.avatar, data.role ,data.name, data.username, data.email, data.status, data.password, data.language, nDate]);
  return res.rows[0];
};

async function getUserById (id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
};

async function updateUser(id, user){
  let query = 'UPDATE users SET ';
  let values = [];
  let paramCount = 1;
  
  if (user.avatar !== undefined) {
    query += `avatar = $${paramCount}, `;
    values.push(user.avatar);
    paramCount++;
  }
  
  query += `name = $${paramCount}, username = $${paramCount + 1}, email = $${paramCount + 2}, status = $${paramCount + 3}, updated_at = $${paramCount + 4} WHERE id = $${paramCount + 5} RETURNING *`;
  values.push(user.name, user.username, user.email, user.status, nDate, id);
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

async function deleteUser(id){
  
  // const res = await pool.query('DELETE FROM user WHERE id = $1 RETURNING *', [id]);
  // return res.rows[0];
  const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return res.rows;
};

module.exports = { getAllUser, addUser, deleteUser, getUserById, updateUser };