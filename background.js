chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ timeout: 60 }); // 设置默认超时时间
});

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get('timeout', function(data) {
        var timeout = parseInt(data.timeout) || 60; // 默认60秒
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: clearSearchInputs,
            args: [timeout]
        });
    });
});

function clearSearchInputs(timeout) {
    setTimeout(function() {
        var inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => input.value = '');
    }, timeout * 1000);
}
