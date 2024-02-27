import fs from "fs";
import { loggerService } from '../../services/logger.service.js'
import { log } from "console";

export const bugService = {
  query,
  getById,
  remove,
  save,
};

var bugs = _readJsonFile("./data/bug.json");


const PAGE_SIZE = 2
async function query(filterBy) {
  try {
    let bugsToReturn = [...bugs]
    const { title, severity, labels, pageIdx, creator } = filterBy;
    
    if(title){
      bugsToReturn = bugsToReturn.filter(bug => bug.title.toLowerCase().includes(title.toLowerCase()))
    }

    if (severity) {
      bugsToReturn = bugsToReturn.filter(bug => bug.severity >= severity)
    }

    if(labels){
      bugsToReturn = bugsToReturn.filter(bug => bug.labels?.some(label => labels.includes(label)))
    }

    if(creator) {
      bugsToReturn = bugsToReturn.filter(bug => bug.creator._id === creator)
    }

    if(pageIdx !== undefined) {
      const startIdx = pageIdx * PAGE_SIZE
      bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return bugsToReturn;

  } catch (err) {
    loggerService.error(`Had problems getting bugs...`)
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (err) {
    loggerService.error(`Had problems getting bug ${bugId}...`)
    throw err;
  }
}

async function remove(bugId, loggedinUser) {
  try {
    const idx = bugs.findIndex((bug) => bug._id === bugId);
    if (idx === -1) throw `Couldn't find bug with _id ${bugId}`

    const bug = bugs[idx]
    if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) throw { msg: `Not your bug`, code: 403 }

    bugs.splice(idx, 1);
    await _saveBugsToFile("./data/bug.json");
  } catch (err) {
      loggerService.error(`Had problems removing bug ${bugId}...`)
      throw err;
  }
  return `bug ${bugId} removed`;
}

async function save(bugToSave, loggedinUser) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if(idx === -1) throw 'Bad Id'

      const bug = bugs[idx]
      if (!loggedinUser?.isAdmin && bug.creator._id !== loggedinUser?._id) throw `Not your bug`
  
      bugs.splice(idx, 1, {...bug, ...bugToSave});
    } else {
      bugToSave._id = _makeId();
      bugToSave.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
      bugs.push(bugToSave);
    }
    await _saveBugsToFile("./data/bug.json");
  } catch (err) {
    loggerService.error(`Had problems saving bug ${bugToSave._id}...`)
    throw err;
  }
  return bugToSave;
}

function _makeId(length = 7) {
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

function _saveBugsToFile(path) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
