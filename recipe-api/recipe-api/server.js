const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Налаштування для зберігання файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Тільки зображення дозволені!'), false);
    }
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Місце для зберігання рецептів
let recipes = [];

// Видалити рецепт за ID
const unlinkPhoto = (photoPath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(photoPath, (err) => {
      if (err) reject('Помилка при видаленні фото');
      resolve('Фото видалено');
    });
  });
};

app.delete('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const recipeIndex = recipes.findIndex(r => r.id === Number(id));

  if (recipeIndex !== -1) {
    const recipe = recipes[recipeIndex];
    if (recipe.photo) {
      const photoPath = path.join(__dirname, recipe.photo);
      try {
        await unlinkPhoto(photoPath);
        console.log('Фото видалено:', photoPath);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Не вдалося видалити фото' });
      }
    }
    recipes.splice(recipeIndex, 1);
    return res.status(200).json({ message: 'Рецепт видалено' });
  } else {
    return res.status(404).json({ message: 'Рецепт не знайдено' });
  }
});

// Отримати всі рецепти
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

// Отримати рецепт за ID
app.get('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const recipe = recipes.find(r => r.id === Number(id));

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Рецепт не знайдено' });
  }
});

// Додавання нового рецепта
app.post('/api/recipes', upload.single('photo'), (req, res) => {
  const { title, category, ingredients, description, userId } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  if (!userId) {
    return res.status(400).json({ message: 'userId є обов\'язковим полем' });
  }

  const newRecipe = {
    id: Date.now(),
    title,
    category,
    ingredients: JSON.parse(ingredients), // Десеріалізуємо інгредієнти
    description,
    userId, // Додаємо userId до рецепта
    photo
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// Отримати рецепти конкретного користувача за його userId
app.get('/api/recipes/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userRecipes = recipes.filter(r => r.userId === userId);
  res.json(userRecipes);
});
// Отримати всі категорії
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Десерти' },
    { id: 2, name: 'Напої' },
    { id: 3, name: 'Основні страви' },
    { id: 4, name: 'Салати' },
    { id: 5, name: 'Десерти' },
    { id: 6, name: 'Алкогольні напої' }
  ];
  res.json(categories);
});
// Отримати рецепти за категорією
app.get('/api/recipes/category/:category', (req, res) => {
  const { category } = req.params;
  const filteredRecipes = recipes.filter(recipe => recipe.category.toLowerCase() === category.toLowerCase());
  res.json(filteredRecipes);
});

// Редагувати рецепт за ID
app.put('/api/recipes/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  const { title, category, ingredients, description } = req.body;
  const recipeIndex = recipes.findIndex(r => r.id === Number(id));

  if (recipeIndex !== -1) {
    const recipe = recipes[recipeIndex];
    recipe.title = title || recipe.title;
    recipe.category = category || recipe.category;
    recipe.ingredients = JSON.parse(ingredients) || recipe.ingredients; // Десеріалізуємо інгредієнти
    recipe.description = description || recipe.description;

    if (req.file) {
      if (recipe.photo) {
        const oldPhotoPath = path.join(__dirname, recipe.photo);
        try {
          await unlinkPhoto(oldPhotoPath);
          console.log('Старе фото видалено:', oldPhotoPath);
        } catch (err) {
          console.error('Помилка при видаленні старого фото:', err);
        }
      }
      recipe.photo = `/uploads/${req.file.filename}`;
    }

    return res.status(200).json(recipe);
  } else {
    return res.status(404).json({ message: 'Рецепт не знайдено' });
  }
});

// Запустити сервер
app.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
