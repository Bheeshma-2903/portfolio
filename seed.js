require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const sample = [
  { title: 'Task Tracker', description: 'A kanban-style task app with drag and drop. Boards are saved to the database.', tech: ['React', 'Node.js', 'MongoDB'], liveUrl: '', repoUrl: '' },
  { title: 'Weather Now', description: 'Shows live weather and a 5-day forecast for any city using a public weather API.', tech: ['JavaScript', 'REST API', 'CSS'], liveUrl: '', repoUrl: '' },
  { title: 'Expense Splitter', description: 'Splits shared bills between friends and tracks who owes what.', tech: ['Express', 'MongoDB', 'JavaScript'], liveUrl: '', repoUrl: '' },
  { title: 'Online Quiz App', description: 'Timed multiple-choice quizzes with instant scoring and a leaderboard.', tech: ['JavaScript', 'Node.js', 'MongoDB'], liveUrl: '', repoUrl: '' },
  { title: 'Blog Platform', description: 'Write, edit and publish posts with user login and comments.', tech: ['React', 'Express', 'MongoDB'], liveUrl: '', repoUrl: '' },
  { title: 'Recipe Finder', description: 'Search recipes by ingredient, save favourites and filter by diet.', tech: ['HTML', 'CSS', 'JavaScript', 'REST API'], liveUrl: '', repoUrl: '' }
];
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Project.deleteMany({});
  await Project.insertMany(sample);
  console.log('Seeded', sample.length, 'projects');
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
