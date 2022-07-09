const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Fullstack:${password}@phone.pyvtu.mongodb.net/?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

const Note = mongoose.model("Note", noteSchema);

mongoose.connect(url).then(result => {
  console.log("connected");
  // const note = new Note({
    // content: "werey ni e",
    // date: new Date,
    // important: false
  // })
  // return note.save()
// }).then((result) => {
  // console.log(`note saved`);
  // return mongoose.connection.close()
  // }).catch((err) => console.log(err)

Note.find({}).then(results => {
  results.forEach(result => {
    console.log(result);
  });
  mongoose.connection.close()
})

})
