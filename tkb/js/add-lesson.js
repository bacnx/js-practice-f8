const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const subjectsApi = 'http://localhost:3000/subjects';

$('#add-lesson').onclick = () => {
  var subject = getSubject();

  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subject)
  }

  fetch(subjectsApi, options)
}

function getSubject() {
  var nameInputElement = $('#name');
  var name = nameInputElement.value;
  nameInputElement.value = '';

  var roomInputElement = $('#room');
  var room = roomInputElement.value;
  roomInputElement.value = '';

  var timeInputElement = $('#time');
  var time = timeInputElement.value;
  timeInputElement.value = '';

  var lecturerInputElement = $('#lecturer');
  var lecturer = lecturerInputElement.value;
  lecturerInputElement.value = '';

  var dayInputElement = $('#day');
  var day = dayInputElement.value * 1;

  var lessonFromInputElement = $('#lesson-from');
  var lessonFrom = lessonFromInputElement.value * 1;

  var lessonToInputElement = $('#lesson-to');
  var lessonTo = lessonToInputElement.value * 1;

  return {
    name: name,
    room: room,
    time: time,
    lecturer: lecturer,
    day: day,
    lesson: {
      from: lessonFrom,
      to: lessonTo
    }
  }
}