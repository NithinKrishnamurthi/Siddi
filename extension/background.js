chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension Installed');
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });

chrome.alarms.create("updateCosts", { delayInMinutes: 1, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
if (alarm.name === "periodicTask") {
    console.log('Alarm fired');
    const all = await chrome.storage.sync.get();
    for (const [key, val] of Object.entries(all)) {
      // do something
      fetch(key)
      .then(response => response.text())
      .then(html => {
        // Parse the HTML using DOMParser or similar
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
  
        // Use querySelectorAll or other DOM methods to scrape data
        const container = Array.from(doc.querySelector('div.product-page-info-container-mfe'))
        const regex = /\$\s*(\d+(\.\d{1,2})?)/;
        const dollars = container.textContent.match(regex)[1];


        console.log(dollars, val);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
    
    // Perform your background task here
}
});