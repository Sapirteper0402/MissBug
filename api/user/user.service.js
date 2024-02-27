import fs from "fs";
import { loggerService } from "../../services/logger.service.js";

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUsername,
};

var users = _readJsonFile("./data/user.json");

async function query() {
  try {
    // if (!loggedinUser?.isAdmin) throw `You are not Admin`;
    return Promise.resolve(users);
    // return users;
  } catch (err) {
    loggerService.error(`Had problems getting users...`);
    throw err;
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    return user;
  } catch (err) {
    loggerService.error(`Had problems getting user ${userId}...`);
    throw err;
  }
}

async function getByUsername(username) {
  const user = users.find((user) => user.username === username);
  return user;
}

async function remove(userId, loggedinUser) {
  try {
    const idx = users.findIndex((user) => user._id === userId);
    if (idx === -1) throw `Couldn't find user with _id ${userId}`

    if (!loggedinUser?.isAdmin) throw `You are not Admin`;

    users.splice(idx, 1);
    _saveUsersToFile();
  } catch (err) {
    loggerService.error(`Had problems removing user ${userId}...`);
    throw err;
  }
  return `user ${userId} removed`;
}

async function save(userToSave, loggedinUser) {
  try {
    if (userToSave._id) {
      // Update
      const idx = users.findIndex((user) => user._id === userToSave._id);
      if (idx === -1) throw "Bad Id";

      const user = users[idx];
      if (!loggedinUser?.isAdmin) throw `You are not Admin`;

      users.splice(idx, 1, { ...user, ...userToSave });
    } else {
      // Add User
      userToSave._id = _makeId();
      userToSave.score = 10000;
      // if (!userToSave.imgUrl) userToSave.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
      userToSave.isAdmin = false;
      
      users.push(userToSave);
    }

    await _saveUsersToFile();
    return userToSave;
  } catch (err) {
    loggerService.error("userService[save] : ", err);
    throw err;
  }
}


function _makeId(length = 4) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function _readJsonFile(path) {
  const str = fs.readFileSync(path, "utf8");
  const json = JSON.parse(str);
  return json;
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const usersStr = JSON.stringify(users, null, 2);
    fs.writeFile("data/user.json", usersStr, (err) => {
      if (err) {
        return console.log(err);
      }
      resolve();
    });
  });
}
