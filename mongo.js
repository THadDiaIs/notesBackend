const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('give_pass_as_argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://sdia7sdia:${password}@dnn0.k280uaz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Dnn0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'Mongo is awesome',
    important: true,
})

// note.save().then(result => {
//     console.log('Note saved!')
//     mongoose.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
