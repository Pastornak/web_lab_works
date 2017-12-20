const feedbacksRoutes = require('./feedbacks_routes');
const newsRoutes = require('./news_routes');
module.exports = function(app, db) {
  feedbacksRoutes(app, db);
  newsRoutes(app, db);
  // Тут, позже, будут и другие обработчики маршрутов 
};