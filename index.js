require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const morgan = require('morgan');
const Note = require('./models/note')
morgan.token('req-content', req => req.body ? JSON.stringify(req.body) : " ");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-content"));

const password = encodeURIComponent(process.argv[2]);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];

// const app = http.createServer((req, resp) => {
// 	resp.writeHead(200, {"Content-Type":"application/json" });
// 	resp.end(JSON.stringify(notes));
// });

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0;

  return maxId +1;
}

app.get("/api/notes", (req, resp) => {
  Note.find({}).then(notes => {
    resp.json(notes);
  })
});

app.get("/api/notes/:id", (req, resp, next) => {
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

app.delete("/api/notes/:id", (req, resp, next) => {
  Note.findByIdAndDelete(req.params.id)
  .then(result => {
    resp.status(204).end();
  })
  .catch(error => next(error));
});

app.post("/api/notes", (req,resp)=> {
  const body = req.body;

  // if (body.content === undefined) {
  //   return response.status(400).json({ error: 'content missing' })
  // }

  if (!body.content){
    return resp.status(400).json({error: "content missing"})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    /*
     *    date: new Date(),
     *    id: generateId(),*/
  })

  note.save().then(savedNote => {resp.json(savedNote)});
})

app.put("/api/notes/:id", (req, resp, next) => {
  const {content, important} = req.body;
  const note = {
    content,
    important
  };

  Note.findByIdAndUpdate(req.params.id, note, {new : true})
  .then(updatedNote => {
    resp.json(updatedNote)
  })
  .catch(error => next(error));
});


const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, resp, next) => {
  console.log(error.message);

  if (error.name == 'CastError'){
    return resp.status(400).send({error: 'malformatted id'});
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
