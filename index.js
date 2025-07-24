const tasksList = document.getElementById("tasklist");
const tasksField = document.getElementById("tasks-field");
const dateField = document.getElementById("date-input");
const timeField = document.getElementById("time-input");
const submitBtn = document.getElementById("submit-btn"); 
const heading = document.getElementById("heading");
const errorUl = document.getElementById("errors_list").querySelector("ul");
const modalMap = document.getElementById("modal-map");
const modal = document.getElementById("modal");
const modalMapBtn = document.getElementById("map-btn");
const taskTextCls = document.getElementsByClassName("task_text");

let map;

tasksList.addEventListener('click', (event) => {
  event.stopPropagation();
  if (event.target.classList.contains('task_text')) {
    modal.classList.remove("hidden");
  }
})

document.addEventListener('click', (event) => {
  if (!modal.classList.contains('hidden') && !modal.contains(event.target)) {
    modal.classList.add("hidden");
  }
})

document.addEventListener('click', (event) => {
  if (!modalMap.classList.contains("hidden") && !modalMap.contains(event.target)) {
    modalMap.classList.add("hidden");
  }
})



let timeNow = new Date();
console.log(timeNow);
timeNow = timeNow.toISOString();
console.log(timeNow);

const dateTimeArray = [dateField, timeField];

dateTimeArray.forEach(element => {
  element.addEventListener('click', () => {
  element.showPicker();
});
});

const emptyListBgFuncs = {
  addBg() {
    tasksList.classList.add("placeholder_empty");
  },
  removeBg() {
    tasksList.classList.remove("placeholder_empty");
  },

  check() {
    (tasksList.children.length < 1) ? this.addBg() : this.removeBg();
  }
}

function hexToRgba40(hex) {
  if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error('Invalid HEX color format');
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
}

modalMapBtn.addEventListener('click', () => {
  event.stopPropagation();
  modalMap.classList.toggle("hidden");
  if (modalMap.classList.contains("hidden")) {
    return;
  } else {
    if (!map) {
        map = L.map('map').setView([50.4470, 30.5228], 13); 

      window.coords = undefined;


      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      var popup = L.popup();

      function onMapClick(e) {
          window.coords = e.latlng;
          popup
              .setLatLng(e.latlng)
              .setContent("You chose location:" + e.latlng.toString())
              .openOn(map);
      }

      map.on('click', onMapClick);
    }
  }
})


emptyListBgFuncs.check();

dateField.value = timeNow.slice(0, 10);
timeField.value = timeNow.slice(11, 16);

document.querySelector('form').addEventListener('submit', (event) => {

  event.preventDefault();
  const headingValue = heading.value.trim();
  const timeCombined = `${dateField.value}T${timeField.value}`;
  const listItem = document.createElement("li");
  const spanItem = document.createElement("span");
  const spanItem2 = document.createElement("span");
  const btn = document.createElement("button");
  const now = new Date();
  let errorsArray = [];
  if (new Date(timeCombined) < now) {errorsArray.push("DATE EXPIRED")};
  if (headingValue.length === 0) {errorsArray.push("HEADING EMPTY")};
  if (errorsArray.length > 0) {
    errorUl.innerHTML = "";
    errorsArray.forEach(error => {
      const errorLi = document.createElement("li");
      errorLi.textContent = error;
      errorUl.appendChild(errorLi);
    })
  } else {
    listItem.classList.add("task_Li");
    listItem.style.backgroundColor = hexToRgba40(document.getElementById("color-picker").value);
    btn.classList.add("remove_btn");
    spanItem2.textContent = heading.value;
    spanItem2.classList.add("task_text");
    spanItem.textContent = timeCombined.replace("T", " ");
    spanItem.classList.add("task_time");
    listItem.appendChild(spanItem2);
    listItem.appendChild(spanItem);
    listItem.appendChild(btn);
    tasksList.appendChild(listItem);
    emptyListBgFuncs.check();
    document.querySelector("form").reset();
    window.coords = undefined;
    dateField.value = timeNow.slice(0, 10);
    timeField.value = timeNow.slice(11, 16);
  };
})