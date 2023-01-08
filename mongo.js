import { connect, Schema, model, connection } from 'mongoose';

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const breed = process.argv[4];
const weight = process.argv[5];

const url =
  `mongodb+srv://fullstack:${password}@cluster0.4bfc2.mongodb.net/cat?retryWrites=true&w=majority`;

connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const catSchema = new Schema({
  name: String,
  breed: String,
  weight: String,
});

const Cat = model('Cat', catSchema);

const cat = new Cat({
  name: name,
  breed: breed,
  weight: weight,
});

catSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

async function main() {
  if (name) {
    try {
      const result = await cat.save();
      console.log(result + 'cat saved!');
      connection.close();
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const result = await Cat.find({});
    result.forEach(status => {
      console.log(status);
    });
    connection.close();
  } catch (error) {
    console.log(error);
  }
}

main();
