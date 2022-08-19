const router = require('express').Router();
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const readFile = util.promisify(fs.readFile);
const getNotes = () => {
  return readFile('db/db.json', 'utf-8').then(rawNotes => {
    let notesArray = [].concat(JSON.parse(rawNotes))
    return notesArray
  })
};

//GET /api/notes should read the db.json file and return all saved notes as JSON.
router.get('/notes', async(req, res) => {
  const result = await getNotes();
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
router.post('/notes', async(req, res) => {
  const oldNotes = await getNotes()
  let newNote = {title:req.body.title, text:req.body.text, id:uuidv4()}
  const newArray = [...oldNotes,newNote]
  console.log(newArray)
  fs.writeFileSync('db/db.json', JSON.stringify(newArray));
  res.json({msg:'ok'})
});

router.delete('/notes/:id', async(req,res) => {
  console.log(req.params.id)
  const oldNotes = await getNotes();
  const filteredNotes = oldNotes.filter((note) => req.params.id !== note.id);
  fs.writeFileSync('db/db.json', JSON.stringify(filteredNotes));
  res.json({msg:`deleted note with id of ${req.params.id}`})
})

module.exports = router;