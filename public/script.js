// Enable/Disable Submit Button Based on Checkbox
document.getElementById('agreeCheckbox').addEventListener('change', function() {
  document.getElementById('submitButton').disabled = !this.checked;
});

// Initialize Commands Array
let Commands = [{
  'commands': []
}, {
  'handleEvent': []
}];

// Show Ads (restored to original)
function showAds() {
  var ads = [''];
  var index = Math.floor(Math.random() * ads.length);
  window.location.href = ads[index];
}

// Measure Ping
function measurePing() {
  var xhr = new XMLHttpRequest();
  var startTime, endTime;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      endTime = Date.now();
      var pingTime = endTime - startTime;
      document.getElementById("ping").textContent = pingTime + " ms";
    }
  };
  xhr.open("GET", location.href + "?t=" + new Date().getTime());
  startTime = Date.now();
  xhr.send();
}
setInterval(measurePing, 1000);

// Update Time
function updateTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Manila',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  const formattedTime = now.toLocaleString('en-US', options);
  document.getElementById('time').textContent = formattedTime;
}
updateTime();
setInterval(updateTime, 1000);

// Submit Appstate and Configuration
async function State() {
  const jsonInput = document.getElementById('json-data');
  const button = document.getElementById('submitButton');
  if (!Commands[0].commands.length) {
    return showResult('Please provide at least one valid command for execution.');
  }
  try {
    button.style.display = 'none';
    const State = JSON.parse(jsonInput.value);
    if (State && typeof State === 'object') {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: State,
          commands: Commands,
          prefix: document.getElementById('inputOfPrefix').value,
          admin: document.getElementById('inputOfAdmin').value,
        }),
      });
      const data = await response.json();
      jsonInput.value = '';
      showResult(data.message);
      showAds();
    } else {
      jsonInput.value = '';
      showResult('Invalid JSON data. Please check your input.');
      showAds();
    }
  } catch (parseError) {
    jsonInput.value = '';
    console.error('Error parsing JSON:', parseError);
    showResult('Error parsing JSON. Please check your input.');
    showAds();
  } finally {
    setTimeout(() => {
      button.style.display = 'block';
    }, 4000);
  }
}

// Show Result Message
function showResult(message) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `<h5 class="text-yellow-400">${message}</h5>`;
  resultContainer.style.display = 'block';
}

// Fetch and Display Commands and Events
async function commandList() {
  try {
    const [listOfCommands, listOfCommandsEvent] = [
      document.getElementById('listOfCommands'),
      document.getElementById('listOfCommandsEvent')
    ];
    const response = await fetch('/commands');
    const { commands, handleEvent, aliases } = await response.json();
    [commands, handleEvent].forEach((commandList, i) => {
      commandList.forEach((command, index) => {
        const container = createCommand(
          i === 0 ? listOfCommands : listOfCommandsEvent,
          index + 1,
          command,
          i === 0 ? 'commands' : 'handleEvent',
          aliases[index] || []
        );
        (i === 0 ? listOfCommands : listOfCommandsEvent).appendChild(container);
      });
    });
  } catch (error) {
    console.error('Error fetching commands:', error);
    showResult('Failed to load commands. Please try again.');
  }
}

// Create Command/Event Checkbox
function createCommand(element, order, command, type, aliases) {
  const container = document.createElement('div');
  container.classList.add('command-container');
  container.onclick = toggleCheckbox;

  const checkbox = document.createElement('input');
  checkbox.classList.add('command-checkbox', type);
  checkbox.type = 'checkbox';
  checkbox.id = `flexSwitchCheck_${order}`;

  const label = document.createElement('label');
  label.classList.add('command-label', type);
  label.htmlFor = `flexSwitchCheck_${order}`;
  label.textContent = `${order}. ${command}`;

  container.appendChild(checkbox);
  container.appendChild(label);

  if (aliases.length > 0 && type !== 'handleEvent') {
    const aliasText = document.createElement('span');
    aliasText.classList.add('text-gray-400', 'text-sm', 'ml-2');
    aliasText.textContent = `(${aliases.join(', ')})`;
    label.appendChild(aliasText);
  }

  return container;
}

// Toggle Checkbox State
function toggleCheckbox() {
  const box = [
    {
      input: '.command-checkbox.commands',
      label: '.command-label.commands',
      array: Commands[0].commands
    },
    {
      input: '.command-checkbox.handleEvent',
      label: '.command-label.handleEvent',
      array: Commands[1].handleEvent
    }
  ];
  box.forEach(({ევ => {
    const checkbox = this.querySelector(input);
    const labelText = this.querySelector(label);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        labelText.classList.add('disable');
        const command = labelText.textContent.replace(/^\d+\.\s/, '').split(' (')[0];
        array.push(command);
      } else {
        labelText.classList.remove('disable');
        const command = labelText.textContent.replace(/^\d+\.\s/, '').split(' (')[0];
        const removeCommand = array.indexOf(command);
        if (removeCommand !== -1) {
          array.splice(removeCommand, 1);
        }
      }
    });
  });
}

// Select All Commands
function selectAllCommands() {
  const box = [{
    input: '.command-checkbox.commands',
    array: Commands[0].commands
  }];
  box.forEach(({ input, array }) => {
    const checkboxes = document.querySelectorAll(input);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach((checkbox) => {
      const labelText = checkbox.nextElementSibling;
      const command = labelText.textContent.replace(/^\d+\.\s/, '').split(' (')[0];
      if (allChecked) {
        checkbox.checked = false;
        labelText.classList.remove('disable');
        const removeCommand = array.indexOf(command);
        if (removeCommand !== -1) {
          array.splice(removeCommand, 1);
        }
      } else {
        checkbox.checked = true;
        labelText.classList.add('disable');
        if (!array.includes(command)) {
          array.push(command);
        }
      }
    });
  });
}

// Select All Events
function selectAllEvents() {
  const box = [{
    input: '.command-checkbox.handleEvent',
    array: Commands[1].handleEvent
  }];
  box.forEach(({ input, array }) => {
    const checkboxes = document.querySelectorAll(input);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    checkboxes.forEach((checkbox) => {
      const labelText = checkbox.nextElementSibling;
      const event = labelText.textContent.replace(/^\d+\.\s/, '').split(' (')[0];
      if (allChecked) {
        checkbox.checked = false;
        labelText.classList.remove('disable');
        const removeEvent = array.indexOf(event);
        if (removeEvent !== -1) {
          array.splice(removeEvent, 1);
        }
      } else {
        checkbox.checked = true;
        labelText.classList.add('disable');
        if (!array.includes(event)) {
          array.push(event);
        }
      }
    });
  });
}

// Initialize Command List
commandList();
