const bcrypt = require('bcrypt');

const storedHash = '$2b$10$YQv8kVX.X7p5HYMS5fWZ2OWPpVsXZcV5zQ5kF8M9kJZ5M2Zl2k7km';
const password = 'admin123';

bcrypt.compare(password, storedHash).then(result => {
  console.log('Password matches:', result);
  process.exit(0);
});
