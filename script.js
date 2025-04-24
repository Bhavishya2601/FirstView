

window.addEventListener('DOMContentLoaded', () => {
    
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
        if (chrome.runtime.lastError || !token) {
            
            document.querySelector('.content-notlogged').style.display = 'block'
        } else {
            
            fetchEvents(token);
        }
    });
});


document.getElementById('auth-btn').addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError || !token) {
            console.error('Auth Error:', chrome.runtime.lastError);
            return;
        }
        
        fetchEvents(token);
        document.getElementById('auth-btn').style.display = 'none';

    });
});

function fetchEvents(token) {
    const calendarApi = 'https:events'
      + '?maxResults=10&orderBy=startTime&singleEvents=true'
      + '&timeMin=' + new Date().toISOString(); 
  
    fetch(calendarApi, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        const eventsTableBody = document.getElementById('events-table-body');
        document.querySelector('.content-notlogged').style.display = 'none';
        eventsTableBody.innerHTML = '';
  
        const joinableEvents = []; 
  
        (data.items || []).forEach(event => {
          const tr = document.createElement('tr');
  
          
          const nameCell = document.createElement('td');
          nameCell.textContent = event.summary || 'No Title';
          nameCell.classList.add('table-title');
          tr.appendChild(nameCell);
  
          
          const dateCell = document.createElement('td');
          let dateStr = event.start.dateTime || event.start.date || null;
  
          if (dateStr) {
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            dateCell.textContent = formattedDate;
  
            
            const classLink = extractClassLink(event);
            if (classLink) {
              joinableEvents.push({
                link: classLink,
                startTime: dateObj.getTime()
              });
            }
  
          } else {
            dateCell.textContent = 'No Date';
          }
  
          tr.appendChild(dateCell);
  
          
          const linkCell = document.createElement('td');
          const classLink = extractClassLink(event);
          if (classLink) {
            const link = document.createElement('a');
            link.href = classLink;
            link.target = '_blank';
            link.textContent = 'Join';
            linkCell.appendChild(link);
          } else {
            linkCell.textContent = 'No Link';
          }
          tr.appendChild(linkCell);
  
          
          eventsTableBody.appendChild(tr);
        });
  
        
        if (joinableEvents.length > 0) {
          chrome.runtime.sendMessage({
            type: 'schedule-alarms',
            events: joinableEvents
          });
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }
  


function extractClassLink(event) {
    const fields = [event.location, event.description];
    for (const field of fields) {
        if (!field) continue;

        
        const meetMatch = field.match(/https:\/\/meet\.google\.com\/[a-z\-]+/);
        if (meetMatch) return meetMatch[0];

        
        const zoomMatch = field.match(/https:\/\/[\w\.]*zoom\.us\/[^\s"]+/);
        if (zoomMatch) return zoomMatch[0];
    }

    
    if (event.conferenceData && event.conferenceData.entryPoints) {
        const entry = event.conferenceData.entryPoints.find(e => e.uri.includes('meet.google.com'));
        if (entry) return entry.uri;
    }

    return null;
}
