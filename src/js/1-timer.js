import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button[data-start]');
const input = document.querySelector('#datetime-picker');

const timer = document.querySelector('.timer');
const timerDays = timer.querySelector('span[data-days]');
const timerHours = timer.querySelector('span[data-hours]');
const timerMinutes = timer.querySelector('span[data-minutes]');
const timerSeconds = timer.querySelector('span[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
      if (userSelectedDate <= Date.now()) {
          startBtn.disabled = true;
          showInputError();
    }
  },
};

let userSelectedDate;
let isActive = false;
startBtn.disabled = true;

const fp = flatpickr(input, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function startTimer() {
  startBtn.disabled = true;
  fp.input.disabled = true;

  if (isActive) {
    return;
  }

  isActive = true;

  const intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;
    const time = convertMs(deltaTime);
    updateTimer(time);

    if (deltaTime <= 0) {
      clearInterval(intervalId);
      isActive = false;
      fp.input.disabled = false;

      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  }, 1000);
}

function updateTimer({ days, hours, minutes, seconds }) {
  timerDays.textContent = addLeadingZero(days);
  timerHours.textContent = addLeadingZero(hours);
  timerMinutes.textContent = addLeadingZero(minutes);
  timerSeconds.textContent = addLeadingZero(seconds);
}

function showInputError() {

  iziToast.error({
    title: 'Error',
    titleColor: '#fff',
    iconColor: '#fff',
    backgroundColor: '#ef4040',
    messageColor: '#fff',
    message: 'Please choose a date in the future',
    position: 'topRight', 
    timeout: 3000,
    close: false,
    onOpening: function (instance, toast) {
       toast.style.position = 'absolute';
      toast.style.left = 982 + 'px';  
      toast.style.top = 172 + 'px';  
        toast.style.margin = 0;
    },
  });
}

startBtn.addEventListener('click', startTimer);