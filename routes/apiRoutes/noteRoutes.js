const router = require("express").Router();
const { notes } = require("../../data/db.json");

const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

router.get("/api/notes", (req, res) => {
  let resultsArr = notes;
  if (req.query) {
    results = filterByQuery(req.query, resultsArr);
  }
  res.json(resultsArr);
});

router.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted.");
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

//helper functions for .post()
function createNewNote(body, notesArr) {
  const { title, text } = body;
  const note = {
    title: title,
    text: text,
    id: nanoid(),
  };
  notesArr.push(note);
  fs.writeFileSync(
    path.join(__dirname, "../../data/db.json"),
    JSON.stringify({ notesArr }, null, 2)
  );
  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }

  return true;
}

//helper functions for .get()
function filterByQuery(query, notesArr) {
  let filteredResults = notesArr;

  if (query.title) {
    filteredResults = filteredResults.filter(
      (note) => note.title === query.title //whatever was queried would be found in notes
    );
    // if (typeof query.title === "string") {
    //   infoArr = [query.title];
    // } else {
    //     infoArr = query.title;
    // }
    // // console.log(infoArr);
    // // infoArr.forEach((trait) => {
    // //   filteredResults = filteredResults.filter(
    // //     (animal) => animal.personalityTraits.indexOf(trait) !== -1
    // //   );
    // // });
  }
  if (query.text) {
    filteredResults = filteredResults.filter(
      (note) => note.text === query.text
    );
  }

  return filteredResults;
}

module.exports = router;
