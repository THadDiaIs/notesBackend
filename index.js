require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('req-content', req => req.body ? JSON.stringify(req.body) : " ");
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-content"));

const password = encodeURIComponent(process.argv[2]);

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url = `mongodb+srv://sdia7sdia:${password}@dnn0.k280uaz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Dnn0`
//
// mongoose.set('strictQuery',false)
// mongoose.connect(url)
//
// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })
//
// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)
const Note = require('./models/note')

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

// app.post("/api/notes", (req, res) => {
//   const note = req.body;
//   console.log(note);
//   res.json(note);
// })

app.get("/", (req, resp) => {
  resp.send('<h1>Hello there, this is a notes app, created with react and deployed in render</h1>');
});

app.get("/api/notes", (req, resp) => {
  Note.find({}).then(notes => {
    resp.json(notes);
  })
});

app.get("/api/notes/:id", (req, resp) => {
  // const id = Number(req.params.id);
  // const note = notes.find(note => note.id === id);
  // if (note) {
  //   resp.json(note);
  // } else {
  //   resp.status(404).end();
  // }
  Note.findById(req.params.id).then(note => {
    response.json(note);
  });
});

app.delete("/api/notes/:id", (req, resp) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);

  resp.status(204).end();
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
    date: new Date(),
    id: generateId(),*/
  })

  note.save().then(savedNote => {resp.json(savedNote)});
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
