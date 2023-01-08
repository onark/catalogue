const catsRouter = require('express').Router();
const Cat = require('../models/cat');

catsRouter.get('/', async (request, response) => {
  try {
    const cats = await Cat.find({});
    response.json(cats);
  } catch (error) {
    // handle error
  }
});

catsRouter.get('/api/info', async (request, response) => {
  try {
    const today = new Date();
    const count = await Cat.countDocuments({});
    const respString = `There are ${count} cats \n
      ${today}`;
    response.send(respString);
  } catch (error) {
    // handle error
  }
});

catsRouter.get('/:id', async (request, response, next) => {
  try {
    const cat = await Cat.findById(request.params.id);
    if (cat) {
      response.json(cat);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

catsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    if (!body.name || !body.breed) {
      return response.status(400).json({ error: 'name or breed input missing' });
    }
    const cat = new Cat({
      name: body.name,
      breed: body.breed,
      weight: body.weight,
    });
    const savedCat = await cat.save();
    response.json(savedCat);
  } catch (error) {
    next(error);
  }
});

catsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Cat.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

catsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body;
    const cat = {
      name: body.name,
      breed: body.breed,
      weight: body.weight,
    };
    const updatedCat = await Cat.findByIdAndUpdate(request.params.id, cat, { new: true });
    response.json(updatedCat);
  } catch (error) {
    next(error);
  }
});

module.exports = catsRouter;
