let badgeTimeout;

function updateBadge(text, duration) {
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    chrome.action.setBadgeText({ text: text });
    console.log(`Badge set to '${text}', will clear in ${duration} ms`);

    if (badgeTimeout) {
        clearTimeout(badgeTimeout);
        badgeTimeout = null; 
    }

    badgeTimeout = setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
        console.log('Badge cleared.');
        badgeTimeout = null;
    }, duration);
}


document.getElementById('deleteMatchingHistory').addEventListener('click', async () => {
    let keyword = document.getElementById('keyword').value;
    if (keyword) {
        let historyItems = await chrome.history.search({text: keyword, maxResults: 10000});
        historyItems.forEach(item => {
            chrome.history.deleteUrl({url: item.url});
        });
        updateBadge(historyItems.length > 99 ? '99+' : historyItems.length.toString(), 3000); 
    }
});

document.getElementById('deleteNonMatchingHistory').addEventListener('click', async () => {
    let keyword = document.getElementById('keyword').value;
    if (keyword) {
        let allItems = await chrome.history.search({text: "", maxResults: 10000});
        let nonMatchingItems = allItems.filter(item => !item.url.includes(keyword));
        nonMatchingItems.forEach(item => {
            chrome.history.deleteUrl({url: item.url});
        });
        updateBadge(nonMatchingItems.length > 99 ? '99+' : nonMatchingItems.length.toString(), 3000);
    }
});