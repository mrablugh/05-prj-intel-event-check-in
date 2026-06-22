// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebrationMessage");

const storageKeys = {
  total: "attendanceTotal",
  water: "waterCount",
  zero: "zeroCount",
  power: "powerCount",
  waterNames: "waterNames",
  zeroNames: "zeroNames",
  powerNames: "powerNames",
};

// Track attendance
const maxCount = 50;
const attendeeCount = document.getElementById("attendeeCount");
let count = getSavedCount(storageKeys.total);

const teamCounts = {
  water: getSavedCount(storageKeys.water),
  zero: getSavedCount(storageKeys.zero),
  power: getSavedCount(storageKeys.power),
};

const teamNames = {
  water: getSavedNames(storageKeys.waterNames),
  zero: getSavedNames(storageKeys.zeroNames),
  power: getSavedNames(storageKeys.powerNames),
};

function getSavedCount(key) {
  const savedValue = localStorage.getItem(key);
  const parsedValue = parseInt(savedValue, 10);

  if (Number.isNaN(parsedValue)) {
    return 0;
  }

  return parsedValue;
}

function getSavedNames(key) {
  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(savedValue);

    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }
  } catch (error) {
    return [];
  }

  return [];
}

function saveCounts() {
  localStorage.setItem(storageKeys.total, String(count));
  localStorage.setItem(storageKeys.water, String(teamCounts.water));
  localStorage.setItem(storageKeys.zero, String(teamCounts.zero));
  localStorage.setItem(storageKeys.power, String(teamCounts.power));
  localStorage.setItem(storageKeys.waterNames, JSON.stringify(teamNames.water));
  localStorage.setItem(storageKeys.zeroNames, JSON.stringify(teamNames.zero));
  localStorage.setItem(storageKeys.powerNames, JSON.stringify(teamNames.power));
}

function renderCounts() {
  attendeeCount.textContent = count;
  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;

  renderTeamNames("waterNames", teamNames.water);
  renderTeamNames("zeroNames", teamNames.zero);
  renderTeamNames("powerNames", teamNames.power);

  const progress = Math.min((count / maxCount) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

function renderTeamNames(listId, names) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  for (let i = 0; i < names.length; i++) {
    const item = document.createElement("li");
    item.textContent = names[i];
    list.appendChild(item);
  }
}

renderCounts();

function showGreeting(message) {
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
}

function showCelebrationMessage(message) {
  celebrationMessage.textContent = message;
  celebrationMessage.classList.add("success-message");
  celebrationMessage.classList.add("celebration-message");
  celebrationMessage.style.display = "block";
}

function getTopTeam() {
  const teams = [
    { id: "waterCount", label: "Team Water Wise" },
    { id: "zeroCount", label: "Team Net Zero" },
    { id: "powerCount", label: "Team Renewables" },
  ];

  let topTeam = teams[0];
  let topCount = parseInt(document.getElementById(topTeam.id).textContent);

  for (let i = 1; i < teams.length; i++) {
    const currentTeam = teams[i];
    const currentCount = parseInt(
      document.getElementById(currentTeam.id).textContent,
    );

    if (currentCount > topCount) {
      topTeam = currentTeam;
      topCount = currentCount;
    }
  }

  return topTeam.label;
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("Total check-ins: ", count);

  // Update progress bar
  teamCounts[team]++;
  teamNames[team].push(name);
  renderCounts();
  saveCounts();
  const percentage = progressBar.style.width;
  console.log(`Progress: ${percentage}`);

  // Update team counter
  // Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  showGreeting(message);
  console.log(message);

  if (count === maxCount) {
    const celebration = `Congratulations! ${getTopTeam()} had the highest turnout at ${count} attendees.`;
    showCelebrationMessage(celebration);
    console.log(celebration);
  }

  form.reset();
});
