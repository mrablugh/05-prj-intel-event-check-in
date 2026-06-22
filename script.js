// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

// Track attendance
let count = 0;
const maxCount = 50;
const attendeeCount = document.getElementById("attendeeCount");

function showGreeting(message) {
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
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
  attendeeCount.textContent = count;

  // Update progress bar
  const progress = Math.min((count / maxCount) * 100, 100);
  const percentage = `${progress}%`;
  progressBar.style.width = percentage;
  console.log(`Progress: ${percentage}`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  if (count === maxCount) {
    showGreeting(`Celebration! ${getTopTeam()} had the highest turnout at ${count} attendees.`);
  } else {
    showGreeting(message);
  }
  console.log(message);

  form.reset();
});
