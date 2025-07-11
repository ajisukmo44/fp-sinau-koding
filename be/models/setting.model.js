const { DataTypes } = require('sequelize');
const sequelize = require('../config/pg-sequelize');

const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, 
{
  tableName: 'setting',
  timestamps: false,
});

// CRUD DATA SETTING
async function getSetting() {
  const settings = await Setting.findAll({ order: [['id', 'ASC']] });
  return settings.map(setting => setting.get());
};

async function addSetting(data) {
  const key = data.key;
  const value = data.value;
  const setting = await Setting.create({ key, value });
  return setting.get();
};

async function getSettingById (id) {
  const setting = await Setting.findByPk(id);
  return setting ? setting.get() : null;
};

async function deleteSetting(id){
  const setting = await Setting.findByPk(id);
  if (!setting) return false;
  await setting.destroy();
  return true;
};

module.exports = { getSetting, addSetting, deleteSetting, getSettingById};