const quizQuestions = [
    {
        question: "What is mental health?",
        options: ["A state of well-being", "A type of disease", "A physical condition", "None of the above"],
        answer: "A state of well-being"
    },
    // Add more questions here
];

let score = 0;

function loadQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizQuestions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            ${q.options.map((option, i) => `
                <input type="radio" name="q${index}" value="${option}" id="q${index}o${i}">
                <label for="q${index}o${i}">${option}</label><br>
            `).join('')}
        `;
        quizContainer.appendChild(questionElement);
    });
}

function submitQuiz() {
    const formData = new FormData(document.querySelector('form'));
    const answers = Object.fromEntries(formData.entries());
    score = quizQuestions.reduce((acc, q, index) => {
        return acc + (answers[`q${index}`] === q.answer ? 1 : 0);
    }, 0);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';
}

document.querySelector('#details-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const yearGroup = document.getElementById('year-group').value;
    submitDetails(name, yearGroup, score);
});

function submitDetails(name, yearGroup, score) {
    fetch('leaderboard.json')
        .then(response => response.json())
        .then(data => {
            const entries = data.entries || [];
            entries.push({ name, yearGroup, score, timestamp: Date.now() });
            entries.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
            const topEntries = entries.slice(0, 10); // Keep only top 10 entries
            updateLeaderboard(topEntries);
            return fetch('leaderboard.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries: topEntries })
            });
        });
}

function updateLeaderboard(entries) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    entries.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name} (${entry.yearGroup}): ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('leaderboard-container').style.display = 'block';
}

loadQuiz();

