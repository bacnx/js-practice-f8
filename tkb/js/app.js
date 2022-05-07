const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const subjectsApi = 'http://localhost:3000/subjects';


fetch(subjectsApi)
.then(res => res.json())
.then((subjects) => {
  renderForm(subjects)
  render(subjects)
})



function initArray(m, n, init = 0) {
  let arr = [];

  for (let i = 0; i <= m; i++) {
    arr.push([]);
    for (let j = 0; j <= n; j++) {
      arr[i].push(init);
    }
  }
  return arr;
}

function renderForm(subjects) {
  let table = initArray(8, 13);

  subjects.forEach((subject) => {
    let day = subject.day;
    let from = subject.lesson.from;
    let to = subject.lesson.to;

    for (let i = from + 1; i <= to; i++) {
      table[day][i] = 1;
    }
  })

  var html = [`
    <th class="lesson"></th>
    <th>Thứ 2</th>
    <th>Thứ 3</th>
    <th>Thứ 4</th>
    <th>Thứ 5</th>
    <th>Thứ 6</th>
    <th>Thứ 7</th>
  `];

  for (let i = 1; i <= 12; i++) {
    let lesson = `<td class="lesson">${i}</td>`;
    for (let j = 2; j <= 7; j++) {
      if (table[j][i] == 0) {
        lesson += `<td id="position-${j}-${i}"></td>`
      }
    }
    lesson = '<tr>' + lesson + '</tr>';
    html.push(lesson);
  }

  $('table').innerHTML = html.join('');


  // add time
  function addTime(time, minuteAdder) {
    time.m += minuteAdder;
    if (time.m >= 60) {
      time.h ++;
      time.m -= 60;
    }
    return time;
  }

  let time = {
    h: 7,
    m: 0
  }

  lessons = $$('.lesson');
  let times = []; times.push({ begin: time, end: time })

  for (let i = 1; i < lessons.length; i++) {
    let htmlText = `${time.h}h${time.m}`;
    addTime(time, 50)
    htmlText += ` - ${time.h}h${time.m}`;
    
    lessons[i].innerHTML = `${i}<span class="time">${htmlText}</span>`
    
    if (i % 2 == 0) {
      addTime(time, 10);
    }
  }
}

function render(subjects) {
  subjects.forEach(subject => {
    let html = `
      <div class="room">P. ${subject.room}</div>
      <div class="subject-time">${subject.time}</div>
      <div class="name">${subject.name}</div>
      <div class="lecturer">${subject.lecturer}</div>
    `

    let positionId = 'position-' + subject.day + '-' + subject.lesson.from
    
    var position = $('#' + positionId)

    var lessonCount = subject.lesson.to - subject.lesson.from + 1;
    position.setAttribute('rowspan', lessonCount)
    position.setAttribute('class', 'subject')
    position.innerHTML = html
  })
}