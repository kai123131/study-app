const form = document.getElementById('assignmentForm');
const assignmentsContainer = document.getElementById('assignmentsContainer');
const filterSubject = document.getElementById('filterSubject');
const sortBy = document.getElementById('sortBy');
const themeToggle = document.getElementById('themeToggle');
const chatbotInput = document.getElementById('chatInput');
const chatbotBody = document.getElementById('chatbotBody');

let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// SUBJECT COLORS
const subjectColors = {
  "Hindi": "#ff6666",
  "Maths": "#66b3ff",
  "English": "#ffcc66",
  "French": "#cc66ff",
  "Computer": "#66ff66",
  "SST": "#ff99cc",
  "Science": "#66ffff",
  "Other": "#cccccc"
};

// DISPLAY ASSIGNMENTS
function displayAssignments() {
  assignmentsContainer.innerHTML = '';

  let filtered = assignments.filter(a => filterSubject.value === 'All' || a.subject === filterSubject.value);

  if(sortBy.value === 'dueDate') {
    filtered.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else {
    const priorityOrder = { "High":1, "Medium":2, "Low":3 };
    filtered.sort((a,b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  filtered.forEach((a,index)=>{
    const div = document.createElement('div');
    div.className = 'assignment' + (a.completed ? ' completed' : '');
    div.setAttribute('draggable', true);

    div.innerHTML = `
      <div class="assignment-info">
        <h3>${a.title}</h3>
        <p><strong>Subject:</strong> ${a.subject}</p>
        <p><strong>Priority:</strong> ${a.priority}</p>
        <p><strong>Due:</strong> ${a.dueDate}</p>
        ${a.description ? `<p>${a.description}</p>` : ''}
        ${a.link ? `<p><a href="${a.link}" target="_blank">Resource Link</a></p>` : ''}
      </div>
      <div class="buttons">
        <button class="complete-btn" onclick="toggleComplete(${index})">${a.completed ? 'Undo' : 'Complete'}</button>
        <button class="delete-btn" onclick="deleteAssignment(${index})">Delete</button>
      </div>
    `;
    div.style.borderLeftColor = subjectColors[a.subject] || "green";

    // Drag & drop
    div.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', index));
    div.addEventListener('dragover', e => e.preventDefault());
    div.addEventListener('drop', e => {
      const draggedIndex = e.dataTransfer.getData('text/plain');
      const temp = assignments[draggedIndex];
      assignments[draggedIndex] = assignments[index];
      assignments[index] = temp;
      saveAssignments();
      displayAssignments();
    });

    assignmentsContainer.appendChild(div);
  });
}

// SAVE TO LOCAL STORAGE
function saveAssignments() {
  localStorage.setItem('assignments', JSON.stringify(assignments));
}

// ADD ASSIGNMENT
form.addEventListener('submit', e => {
  e.preventDefault();
  const newAssignment = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    subject: document.getElementById('subject').value,
    priority: document.getElementById('priority').value,
    dueDate: document.getElementById('dueDate').value,
    link: document.getElementById('link').value,
    completed: false
  };
  assignments.push(newAssignment);
  saveAssignments();
  form.reset();
  displayAssignments();
  checkNotifications();
});

// DELETE ASSIGNMENT
function deleteAssignment(index){
  assignments.splice(index,1);
  saveAssignments();
  displayAssignments();
}

// TOGGLE COMPLETE
function toggleComplete(index){
  assignments[index].completed = !assignments[index].completed;
  saveAssignments();
  displayAssignments();
}

// FILTER & SORT
filterSubject.addEventListener('change', displayAssignments);
sortBy.addEventListener('change', displayAssignments);

// DARK/LIGHT THEME
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// NOTIFICATIONS for due assignments
function checkNotifications(){
  const today = new Date().toISOString().split('T')[0];
  assignments.forEach(a=>{
    if(!a.completed && a.dueDate <= today){
      alert(`Reminder: Assignment "${a.title}" is due on ${a.dueDate}`);
    }
  });
}

// Simple chatbot functionality
chatbotInput.addEventListener('keypress', e=>{
  if(e.key === 'Enter'){
    e.preventDefault();
    const msg = chatbotInput.value.trim();
    if(msg){
      const div = document.createElement('div');
      div.className = 'chatMessage';
      div.textContent = `You: ${msg}`;
      chatbotBody.appendChild(div);

      const reply = document.createElement('div');
      reply.className = 'chatMessage';
      reply.textContent = `Bot: Remember to check your assignments and due dates!`;
      chatbotBody.appendChild(reply);

      chatbotBody.scrollTop = chatbotBody.scrollHeight;
      chatbotInput.value = '';
    }
  }
});

// INITIAL DISPLAY
displayAssignments();
checkNotifications();
