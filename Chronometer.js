document.addEventListener('DOMContentLoaded', function () {
  var clockRevealer = document.getElementById('clockRevealer'),
      clock = document.getElementById('orologio'),
      showerChrono = document.getElementById('showChronometer'),
      chrono = document.getElementById('cronometro'),
      starter = document.getElementById('raceStarter'),
      resetter = document.getElementById('resetter'),
      massStartStamp = document.getElementById('massStartStamp'),
      decims = 0, seconds = 0, minutes = 0, hours = 0, t, cl;

  /* aggiorna il cronometro */
  function add() {
    decims++;
    if (decims >= 10) {
      decims = 0;
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
      }
    }
    chrono.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + "'" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") + "." + decims;
    timer();
  }
  function timer() {
    t = setTimeout(add, 100);
  }

  /* avvia il cronometro di gara */
  starter.onclick = function () {
    starter.style.visibility = 'hidden';
    resetter.style.visibility = 'visible';
    var d = new Date();
    var dUTC = d.toString();
    massStartStamp.textContent = 'Chronometer started at ' + dUTC.split(' ')[4];
    timer();
  }

  /* ferma il cronometro e resetta il tempo */
  resetter.onclick = function() {
    clearTimeout(t);
    chrono.textContent = "00:00'00.0";
    massStartStamp.textContent = 'Ready to start';
    seconds = 0; minutes = 0; hours = 0; decims = 0;
    starter.style.visibility = 'visible';
    resetter.style.visibility = 'hidden';
  }

  /* mostra l'ora attuale con i secondi */
  clockRevealer.onclick = function () {
    function timing() {
      var d = new Date();
      var dUTC = d.toString();
      clock.textContent = dUTC.split(' ')[4];
    }
    function displayTime() {
      cl = setInterval(timing, 1000);
    }
    displayTime();
    clockRevealer.style.display = 'none';
    clock.style.display = 'block';
  }
});
