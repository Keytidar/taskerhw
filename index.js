const tasksList = document.getElementById('tasklist');
const tasksField = document.getElementById('tasks-field');
const dateField = document.getElementById('date-input');
const timeField = document.getElementById('time-input');
const submitBtn = document.getElementById('submit-btn');
const heading = document.getElementById('heading');
const errorUl = document.getElementById('errors_list').querySelector('ul');
const modalMap = document.getElementById('modal-map');
const modal = document.getElementById('modal');
const modalMapBtn = document.getElementById('map-btn');
const taskTextCls = document.getElementsByClassName('task_text');
const taskArea = document.getElementById('task');

const modalHeading = document.getElementById('modal-heading');
const modalTime = document.getElementById('modal-time');
const modalP = document.getElementById('modal-p');

let map;
let map2;


const createCustomCheckbox = (checkboxId, labelStyle, currentObj) => {
  const checkbox = document.createElement('Input');
  const label = document.createElement('label');
  checkbox.type = 'checkbox';
  if (currentObj) {
    currentObj.isDone ? checkbox.checked = true : checkbox.checked = false;
  }
  checkbox.hidden = true;
  checkbox.id = checkboxId;
  label.htmlFor = checkboxId;
  label.classList.add(labelStyle);
  return [checkbox, label];
}


const createLi = (currentObj, toAppend) => {
  const listItem = document.createElement('li');
  const spanItem = document.createElement('span');
  const spanItem2 = document.createElement('span');
  const removeBtn = document.createElement('button');

  listItem.classList.add('task_Li');
  listItem.style.backgroundColor = currentObj.color;
  listItem.dataset.id = currentObj.id;

  spanItem2.textContent = currentObj.heading;
  spanItem2.classList.add('task_text');

  spanItem.textContent = currentObj.dateTime.replace('T', ' ');
  spanItem.classList.add('task_time');

  listItem.appendChild(spanItem2);
  listItem.appendChild(spanItem);
  listItem.appendChild(removeBtn);

  createCustomCheckbox('chbx-'+ currentObj.id, 'isDone_checkbox', currentObj).forEach((el) => {
    listItem.appendChild(el)
  });

  removeBtn.classList.add('remove_btn');

  if (toAppend) {
    toAppend.appendChild(listItem);
  }

  return listItem;
};

tasksList.addEventListener('change', (event) => {
  if (event.target.type === 'checkbox') {
    const id = event.target.id.slice(5,);
    tasksInfoObjs[id].isDone = !tasksInfoObjs[id].isDone;
    localStorage.setItem('tasksSavedLocal', JSON.stringify(tasksInfoObjs));
  }
})

tasksList.addEventListener('click', (event) => {
  event.stopPropagation();
  if (event.target.classList.contains('task_text')) {
    modal.classList.remove('hidden');
    const idTarget = event.target.closest('li').dataset.id;
    console.log(idTarget);
    console.log(tasksInfoObjs);
    const currentObjectOfClick = tasksInfoObjs[idTarget];
    noOpacityColor = currentObjectOfClick.color.replace('0.4', '1');
    modal.style.borderColor = noOpacityColor;
    modalHeading.textContent = currentObjectOfClick.heading;
    modalTime.textContent = currentObjectOfClick.dateTime.replace('T', ' ');
    modalP.textContent = currentObjectOfClick.textArea;
    if (currentObjectOfClick.location) {
      if (map2) {
        map2.remove();
      }

      setTimeout(() => {
        map2 = L.map('map2').setView(
          [currentObjectOfClick.location[0], currentObjectOfClick.location[1]],
          13
        );

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map2);
      }, 200);
    }
  }

  if (event.target.classList.contains('remove_btn')) {
    const closestLi = event.target.closest('li');
    closestLi?.remove();
    delete tasksInfoObjs[closestLi.dataset.id];
    console.log(tasksInfoObjs);
    localStorage.setItem('tasksSavedLocal', JSON.stringify(tasksInfoObjs));
    emptyListBgFuncs.check();
  }
});

document.addEventListener('click', (event) => {
  [modal, modalMap].forEach((modaLel) => {
    if (
      !modaLel.classList.contains('hidden') &&
      !modaLel.contains(event.target)
    ) {
      modaLel.classList.add('hidden');
    }
  });
});


let timeNow = new Date();
console.log(timeNow);
timeNow = timeNow.toISOString();
console.log(timeNow);

const dateTimeArray = [dateField, timeField];

dateTimeArray.forEach((element) => {
  element.addEventListener('click', () => {
    element.showPicker();
  });
});

const emptyListBgFuncs = {
  addBg() {
    tasksList.classList.add('placeholder_empty');
  },
  removeBg() {
    tasksList.classList.remove('placeholder_empty');
  },

  check() {
    tasksList.children.length < 1 ? this.addBg() : this.removeBg();
  },
};

function hexToRgba40(hex) {
  if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error('Invalid HEX color format');
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
}

let coords;

modalMapBtn.addEventListener('click', () => {
  event.stopPropagation();
  modalMap.classList.toggle('hidden');
  if (modalMap.classList.contains('hidden')) {
    return;
  } else {
    if (!map) {
      map = L.map('map').setView([50.447, 30.5228], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      var popup = L.popup();

      function onMapClick(e) {
        coords = e.latlng;
        popup
          .setLatLng(e.latlng)
          .setContent('You chose location:' + e.latlng.toString())
          .openOn(map);
      }

      map.on('click', onMapClick);
    }
  }
});

const generateRandomId = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

let tasksInfoObjs = {};
const savedTasks = localStorage.getItem('tasksSavedLocal');
if (savedTasks) {
  tasksInfoObjs = JSON.parse(savedTasks);
  Object.values(tasksInfoObjs).forEach((el) => {
    createLi(el, tasksList);
  });
}

emptyListBgFuncs.check();

dateField.value = timeNow.slice(0, 10);
timeField.value = timeNow.slice(11, 16);

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const headingValue = heading.value.trim();
  const timeCombined = `${dateField.value}T${timeField.value}`;
  const now = new Date();
  let errorsArray = [];
  if (new Date(timeCombined) < now) {
    errorsArray.push('DATE EXPIRED');
  }
  if (headingValue.length === 0) {
    errorsArray.push('HEADING EMPTY');
  }
  if (errorsArray.length > 0) {
    errorUl.innerHTML = '';
    errorsArray.forEach((error) => {
      const errorLi = document.createElement('li');
      errorLi.textContent = error;
      errorUl.appendChild(errorLi);
    });
  } else {
    const randomId = generateRandomId();
    const currentObj = {
      dateTime: timeCombined,
      heading: heading.value.trim(),
      textArea: taskArea.value.trim(),
      color: hexToRgba40(document.getElementById('color-picker').value),
      id: randomId,
      isDone: false
    };
    if (coords) {
      currentObj.location = [coords.lat, coords.lng];
    } else {
      currentObj.location = null;
    }

    tasksInfoObjs[randomId] = currentObj;
    localStorage.setItem('tasksSavedLocal', JSON.stringify(tasksInfoObjs));
    console.log(tasksInfoObjs);
    createLi(currentObj, tasksList);
    emptyListBgFuncs.check();

    document.querySelector('form').reset();
    coords = null;
    errorUl.innerHTML = '';

    dateField.value = timeNow.slice(0, 10);
    timeField.value = timeNow.slice(11, 16);
  }
});
