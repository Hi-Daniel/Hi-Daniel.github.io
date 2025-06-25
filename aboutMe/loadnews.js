// Function to load and insert news items
async function loadNews() {
    try {
        // Get list of news files from server
        const response = await fetch('news/newslist.json');
        const newslist = await response.json();
        
        // Get all links that end in .html
        const news = newslist.news;
        const newsContainer = document.getElementById('news-container');

        // Load and insert each news file
        for (const newsItem of news) {
            // Create container for news items
            const newsItemContainer = createNewsItem(newsItem);
            newsContainer.appendChild(newsItemContainer);
        }
        
        
    } catch (error) {
        console.error('Error loading news:', error);
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'container2';
        errorDiv.textContent = 'Unable to load news content.';
        
        // Insert error message
        document.currentScript.parentNode.insertBefore(errorDiv, document.currentScript);
    }
}

function createNewsItem(newsItem) {
    const newsItemContainer = document.createElement('div');
    newsItemContainer.className = 'news-item container2';
    if (newsItem.img) {
        newsItemContainer.innerHTML = `<img src="${newsItem.img}" alt="${newsItem.title}">`;
    }
    const newsContent = document.createElement('div');
    newsContent.className = 'news-item-content';
    newsContent.innerHTML = 
    `    <h2 class="title2">${newsItem.title}</h2>
        <p class="date">${newsItem.date}</p>
        <p class="content">${newsItem.content}</p>`
    if (newsItem.url) {
        newsContent.innerHTML += `<a href="${newsItem.url}" class="button">Read More</a>`;
    }
    newsItemContainer.appendChild(newsContent);
    return newsItemContainer;
}

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', loadNews);
