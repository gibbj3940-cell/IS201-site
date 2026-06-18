const form = document.getElementById('simForm');
const teamASelect = document.getElementById('teamA');
const teamBSelect = document.getElementById('teamB');
const homeTeamSelect = document.getElementById('homeTeam');
const tempoSelect = document.getElementById('tempo');
const chaosInput = document.getElementById('chaos');
const chaosValue = document.getElementById('chaosValue');
const resetButton = document.getElementById('resetButton');

const scoreTeamA = document.getElementById('scoreTeamA');
const scoreTeamB = document.getElementById('scoreTeamB');
const scoreA = document.getElementById('scoreA');
const scoreB = document.getElementById('scoreB');
const predictionText = document.getElementById('predictionText');

function selectedTeam(selectElement) {
  const option = selectElement.options[selectElement.selectedIndex];
  return {
    name: option.value,
    offense: Number(option.dataset.offense),
    defense: Number(option.dataset.defense)
  };
}

function tempoBonus() {
  if (tempoSelect.value === 'slow') return -3;
  if (tempoSelect.value === 'fast') return 4;
  return 0;
}

function randomSwing(chaos) {
  const range = 2 + chaos * 1.35;
  return Math.round((Math.random() * range * 2) - range);
}

function simulateScore(team, opponent, side) {
  const base = 24;
  const offenseEffect = (team.offense - 80) * 0.42;
  const defenseEffect = (90 - opponent.defense) * 0.36;
  let homeEffect = 0;

  if (homeTeamSelect.value === side) {
    homeEffect = 3;
  }

  const chaos = Number(chaosInput.value);
  const rawScore = base + offenseEffect + defenseEffect + tempoBonus() + homeEffect + randomSwing(chaos);
  return Math.max(3, Math.round(rawScore));
}

function updateTeamNames() {
  const teamA = selectedTeam(teamASelect);
  const teamB = selectedTeam(teamBSelect);
  scoreTeamA.textContent = teamA.name;
  scoreTeamB.textContent = teamB.name;
}

chaosInput.addEventListener('input', () => {
  chaosValue.textContent = chaosInput.value;
});

teamASelect.addEventListener('change', updateTeamNames);
teamBSelect.addEventListener('change', updateTeamNames);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const teamA = selectedTeam(teamASelect);
  const teamB = selectedTeam(teamBSelect);

  let pointsA = simulateScore(teamA, teamB, 'A');
  let pointsB = simulateScore(teamB, teamA, 'B');

  if (pointsA === pointsB) {
    if (Math.random() > 0.5) {
      pointsA += 3;
    } else {
      pointsB += 3;
    }
  }

  scoreTeamA.textContent = teamA.name;
  scoreTeamB.textContent = teamB.name;
  scoreA.textContent = pointsA;
  scoreB.textContent = pointsB;

  const winner = pointsA > pointsB ? teamA.name : teamB.name;
  const margin = Math.abs(pointsA - pointsB);
  predictionText.textContent = `${winner} wins by ${margin}. Tempo: ${tempoSelect.value}. Chaos level: ${chaosInput.value}/10.`;
});

resetButton.addEventListener('click', () => {
  teamASelect.value = 'Georgia';
  teamBSelect.value = 'Alabama';
  homeTeamSelect.value = 'neutral';
  tempoSelect.value = 'normal';
  chaosInput.value = 5;
  chaosValue.textContent = '5';
  scoreTeamA.textContent = 'Georgia';
  scoreTeamB.textContent = 'Alabama';
  scoreA.textContent = '--';
  scoreB.textContent = '--';
  predictionText.textContent = 'Click “Simulate Game” to generate a projected final score.';
});

updateTeamNames();
