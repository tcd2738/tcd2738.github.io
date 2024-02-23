const got = require('got');

const articles = [];

// Interfaces with selected subreddit and pull headlines from it for storage in articles.
const generateArticles = async (url, isOnion) => {
  // Get articles from got.
  const foundArticles = await got(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  // Add articles to our list.
  const articleList = JSON.parse(foundArticles.body).data.children;
  articleList.forEach((a) => {
    articles.push({
      title: a.data.title,
      isOnion,
    });
  });
};

// Creates all game articles.
const createGameArticles = () => {
  generateArticles('https://www.reddit.com/r/TheOnion/.json?limit=25', 'y');
  generateArticles('https://www.reddit.com/r/notTheOnion.json?limit=25', 'n');

  return articles;
};

module.exports = {
  createGameArticles,
};
