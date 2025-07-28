// Initialize interactivity for agreement checkbox
document.getElementById('agreeCheckbox').addEventListener('change', function() {
  document.getElementById('submitButton').disabled = !this.checked;
});

// Commands data structure
let Commands = [{ 'commands': [] }, { 'handleEvent': [] }];

// Dummy ad redirection
function showAds() {
  var ads = [ '', '', '', '', '' ];
  var index = Math.floor(Math.random() * ads.length);
  window.location.href = ads[index];
}

// Ping measurement
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

// Time updater
function updateTime() {
  const now = new Date();
  const options = { timeZone: 'Asia/Manila', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const formattedTime = now.toLocaleString('en-US', options);
  document.getElementById('time').textContent = formattedTime;
}
updateTime();
setInterval(updateTime, 1000);

// Handles submission
async function State() {
  const jsonInput = document.getElementById('json-data');
  const button = document.getElementById('submitButton');
  if (!Commands[0].commands.length) return showResult('Please provide at least one valid command for execution.');
  try {
    button.style.display = 'none';
    const State = JSON.parse(jsonInput.value);
    if (State && typeof State === 'object') {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    setTimeout(() => { button.style.display = 'block'; }, 4000);
  }
}

// Result message
function showResult(message) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `<h5>${message}</h5>`;
  resultContainer.style.display = 'block';
}

// Fetch commands and events
async function commandList() {
  try {
    const [listOfCommands, listOfCommandsEvent] = [document.getElementById('listOfCommands'), document.getElementById('listOfCommandsEvent')];
    const response = await fetch('/commands');
    const { commands, handleEvent, aliases } = await response.json();
    [commands, handleEvent].forEach((command, i) => {
      command.forEach((command, index) => {
        const container = createCommand(i === 0 ? listOfCommands : listOfCommandsEvent, index + 1, command, i === 0 ? 'commands' : 'handleEvent', aliases[index] || []);
        (i === 0 ? listOfCommands : listOfCommandsEvent).appendChild(container);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// Create command/event entry
function createCommand(element, order, command, type, aliases) {
  const container = document.createElement('div');
  container.classList.add('form-check', 'form-switch', 'cursor-pointer');
  container.onclick = toggleCheckbox;

  const checkbox = document.createElement('input');
  checkbox.classList.add('form-check-input', type === 'handleEvent' ? 'handleEvent' : 'commands');
  checkbox.type = 'checkbox';
  checkbox.role = 'switch';
  checkbox.id = `flexSwitchCheck_${order}`;

  const label = document.createElement('label');
  label.classList.add('form-check-label', type === 'handleEvent' ? 'handleEvent' : 'commands');
  label.setAttribute('for', `flexSwitchCheck_${order}`);
  label.textContent = `${order}. ${command}`;

  container.appendChild(checkbox);
  container.appendChild(label);

  return container;
}

// Toggle command or event checkbox
function toggleCheckbox() {
  const box = [
    { input: '.form-check-input.commands', label: '.form-check-label.commands', array: Commands[0].commands },
    { input: '.form-check-input.handleEvent', label: '.form-check-label.handleEvent', array: Commands[1].handleEvent }
  ];
  box.forEach(({ input, label, array }) => {
    const checkbox = this.querySelector(input);
    const labelText = this.querySelector(label);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
      if (checkbox.checked) {
        labelText.classList.add('disable');
        array.push(command);
      } else {
        labelText.classList.remove('disable');
        const index = array.indexOf(command);
        if (index !== -1) array.splice(index, 1);
      }
    }
  });
}

// Select/Deselect all commands
function selectAllCommands() {
  const checkboxes = document.querySelectorAll('.form-check-input.commands');
  const array = Commands[0].commands;
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

  checkboxes.forEach(checkbox => {
    const labelText = checkbox.nextElementSibling;
    const command = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
    if (allChecked) {
      checkbox.checked = false;
      labelText.classList.remove('disable');
      const index = array.indexOf(command);
      if (index !== -1) array.splice(index, 1);
    } else {
      checkbox.checked = true;
      labelText.classList.add('disable');
      if (!array.includes(command)) array.push(command);
    }
  });
}

// Select/Deselect all events
function selectAllEvents() {
  const checkboxes = document.querySelectorAll('.form-check-input.handleEvent');
  const array = Commands[1].handleEvent;
  const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

  checkboxes.forEach(checkbox => {
    const labelText = checkbox.nextElementSibling;
    const event = labelText.textContent.replace(/^\d+\.\s/, '').split(" ")[0];
    if (allChecked) {
      checkbox.checked = false;
      labelText.classList.remove('disable');
      const index = array.indexOf(event);
      if (index !== -1) array.splice(index, 1);
    } else {
      checkbox.checked = true;
      labelText.classList.add('disable');
      if (!array.includes(event)) array.push(event);
    }
  });
}

// Initialize on load
commandList();
