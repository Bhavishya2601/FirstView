chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message)
    if (message.type === 'schedule-alarms') {
      message.events.forEach(event => {
        const now = Date.now();
        const delayInMinutes = Math.max((event.startTime - now - 2 * 60 * 1000) / 60000, 0); 
  
        chrome.alarms.create(event.link, {
          delayInMinutes: delayInMinutes
        });
  
        chrome.storage.local.set({ [event.link]: event.link });
      });
    }
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(alarm.name, (result) => {
      const link = result[alarm.name];
      if (link) {
        chrome.tabs.create({ url: link });
      }
    });
  });
  