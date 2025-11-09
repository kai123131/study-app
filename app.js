// Select DOM elements
const form = document.getElementById('assignmentForm');
const assignmentsContainer = document.getElementById('assignmentsContainer');
const filterSubject = document.getElementById('filterSubject');

// Load assignments from localStorage or initialize empty array
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// Function to display assignments
function displayAssignments(filter = 'All') {
  assignmentsContainer.innerHTML = '';

  const filteredAssignments = assignments.filter(a => filter === 'All' || a.subject === filter);

  filteredAssignments.forEach((assignment, index) => {
    const div = document.createElement('div');
    div.className = 'assignment';
    div.style.border = '1px solid #ccc';
    div.style.padding = '10px';
    div.style.margin = '10px 0';
    div.style.borderLeft = `5px solid ${
      assignment.priority === 'High' ? 'red' :
      assignment.priority === 'Medium' ? 'orange' : 'green'
    }`;

    div.innerHTML = `
      <h3>${assignment.title}</h3>
      <p><strong>Subject:</strong> ${assignment.subject}</p>
      <p><strong>Priority:</strong> ${assignment.priority}</p>
      <p><strong>Due:</strong> ${assignment.dueDate}</p>
      ${assignment.description ? `<p>${assignment.description}</p>` : ''}
      ${assignment.link ? `<p><a href="${assignment.link}" target="_blank">Resource Link</a></p>` : ''}
      <button onclick="deleteAssignment(${index})">Delete</button>
    `;

    assignmentsContainer.appendChild(div);
  });
}

// Function to add assignment
form.addEventListener('submit', e => {
  e.preventDefault();
  const newAssignment = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    subject: document.getElementById('subject').value,
    priority: document.getElementById('priority').value,
    dueDate: document.getElementById('dueDate').value,
    link: document.getElementById('link').value
  };

  assignments.push(newAssignment);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  form.reset();
  displayAssignments(filterSubject.value);
});

// Function to delete assignment
function deleteAssignment(index) {
  assignments.splice(index, 1);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  displayAssignments(filterSubject.value);
}

// Filter assignments by subject
filterSubject.addEventListener('change', () => {
  displayAssignments(filterSubject.value);
});

// Initial display
displayAssignments();
