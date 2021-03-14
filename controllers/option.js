const { Op } = require('sequelize');
const { Option } = require('../models');

async function getAll(req, res) {
  let options = [];
  let message = 'ok';
  let status = true;
  try {
    options = await Option.findAll({ raw: true });
  } catch (e) {
    status = false;
    message = e.message;
  }
  res.json({ status, message, options });
}

async function get(req, res) {
  const key = req.params.name;
  let option;
  let status = false;
  let message = 'ok';
  try {
    option = await Option.findOne({
      where: {
        key
      },
      raw: true
    });
    status = option !== null;
  } catch (e) {
    message = e.message;
  }
  res.json({ status, message, option });
}

async function update(req, res, next) {
  const options = req.body;
  for (const [key, value] of Object.entries(options)) {
    if (req.app.locals.config[key] !== value) {
      let newOption = {
        key,
        value
      };
      try {
        let option = await Option.findOne({
          where: {
            key
          }
        });
        if (option) {
          await option.update(newOption);
        }
        status = option !== null;
      } catch (e) {
        console.error(e);
      }
    }
  }
  // TODO: here we actually didn't check the status.
  let status = true;
  let message = 'ok';
  // TODO: apply config
  // updateConfig(req.app.locals.config, () => {
  //   res.json({ status, message });
  // });
  res.json({ status, message });
}

async function shutdown(req, res, next) {
  process.exit();
}

module.exports = {
  shutdown,
  update,
  get,
  getAll
};