import { parseFromString } from 'dom-parser';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension Installed');
    chrome.storage.local.clear()
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });

chrome.alarms.create("updateCosts", { delayInMinutes: 1, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
if (alarm.name === "updateCosts") {
    console.log('Alarm fired');
    
    const all = await chrome.storage.local.get(null);
    for (const [key, val] of Object.entries(all)) {
      // do something
      fetch(key)
      .then(response => response.text())
      .then(html => {
        // Parse the HTML using DOMParser or similar

        const doc = parseFromString(html, 'text/html');
  
        // Use querySelectorAll or other DOM methods to scrape data
        const container = Array.from(doc.getElementsByClassName('product-page-info-container-mfe'))[0]
        const regex = /\$\s*(\d+(\.\d{1,2})?)/;
        const dollars = container.textContent.match(regex)[1];
        console.log(dollars, val);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
    
    // Perform your background task here
}
});