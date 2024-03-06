const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.static('dist'))

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
  resp.send('<h1>Hello there, im Danny</h1>');
});

app.get("/api/notes", (req, resp) => {
  resp.json(notes);
});

app.get("/api/notes/:id", (req, resp) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    resp.json(note);
  } else {
    resp.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, resp) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);

  resp.status(204).end();
});

app.post("/api/notes", (req,resp)=> {
  const body = req.body;
  if (!body.content){
    return response.status(400).json({error: "content missing"})
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note);

  resp.json(note)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
