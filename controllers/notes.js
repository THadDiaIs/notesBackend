const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", ( req, resp ) => {
  Note.find({}).then(notes => resp.json(notes));
});

notesRouter.get("/:id", ( req, resp, next ) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        resp.json(note);
      } else {
        resp.status(404).end();
      }
    })
    .catch(error => next(error));
});

notesRouter.post("/", ( req, resp, next) => {
  const { content, important } = req.body;

  const note = new Note({
    content,
    important: important || false,
  });

  note.save()
    .then(savedNote => {
      resp.json(savedNote);
    })
    .catch(error => next(error));
});

notesRouter.delete("/:id", (req, resp, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then( () => resp.status(204).end() )
    .catch( error => next(error) );
});

notesRouter.put("/:id", (req, resp, next) => {
  const { content, important } = req.body;

  const note = new Note({
    content,
    important: important || false,
  });

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => resp.json(updatedNote))
    .catch(error => next(error));
});


module.exports = notesRouter
