// TODO: inserimento manuale TEMPI
document.addEventListener('DOMContentLoaded', function () {
  console.log(1, localStorage.getItem("times"));
  var times =[];// conterrà pettorale e tempi assegnati
  var beats =[];// conterrà pettorale, tipo di acquisizione e tempo
  var ranking = [];// conterrà pettorale e tempo netto, serve per riordinare la classifica
  var lineId = 0; // definisce il numero di battuta
  const starts = document.getElementById('partenze');
  const arrives = document.getElementById('arrivi');
  const results = document.getElementById('risultati');
  const massStarter = document.getElementById('mass-start');
  const reset = document.getElementById('reset');
  const update = document.getElementById('aggiorna');
  const massStartPanel = document.getElementById('massStartDiv');

  /* importa eventuali tempi in memoria e li stampa nella pagina */
  if (localStorage.getItem("times") !== null && localStorage.getItem("times") !== "" && localStorage.getItem("times") != undefined) {
    var objArray = localStorage.getItem("times").replace(/}{/g, '}?{');
    objArray = objArray.split('?');
    console.log(2, typeof(objArray, objArray));
    for (var i = 0; i < objArray.length; i++) {
      var parsed = JSON.parse(objArray[i]);
      if (parsed.startTime !== '' && parsed.finishTime !== '') {
        times.push(parsed);
        calcResults(parsed);
      } else {
        console.warn(parsed, ' not pushed into times because of missing time.');
      }
    }
    console.log(3, "times:", times);
  } else {
    console.warn('Error catching times in localStorage');
  }
  if (localStorage.getItem("beats") !== null && localStorage.getItem("beats") !== "" && localStorage.getItem("beats") != undefined) {
    console.log(4, localStorage.getItem("beats"));
    var beatsObjArray = localStorage.getItem("beats").replace(/}{/g, '}?{');
    beatsObjArray = beatsObjArray.split('?');
    for (var i = 0; i < beatsObjArray.length; i++) {
      beats.push(JSON.parse(beatsObjArray[i]));
      if (beats[i].type === 'start' && beats[i].time !== '') {
        var li = document.createElement("LI");
        var num = document.createElement("INPUT");
        num.type = "number";
        num.id = "petS" + lineId;
        num.value = beats[i].bib;
        num.addEventListener("change", function() {bibInsertion(this);});
        var startTime = document.createElement("INPUT");
        startTime.id = "start" + lineId;
        startTime.value = beats[i].time;
        li.appendChild(num);
        li.appendChild(startTime);
        starts.appendChild(li);
        lineId += 1;
      }
      if (beats[i].time !== '' && beats[i].type === 'finish') {
        var li = document.createElement("LI");
        var num = document.createElement("INPUT");
        num.type = "number";
        num.id = "petF" + lineId;
        num.value = beats[i].bib;
        num.addEventListener("change", function() {bibInsertion(this);});
        var finishTime = document.createElement("INPUT");
        finishTime.id = "finish" + lineId;
        finishTime.value = beats[i].time;
        li.appendChild(num);
        li.appendChild(finishTime);
        arrives.appendChild(li);
        console.log("FINISH", lineId);
        lineId += 1;
      }
    }
  } else {
    console.warn('Error catching beats in localStorage');
    console.log('beats = ', localStorage.getItem("beats"));
  }

  /* Acquisizione e stampa del tempo in FINISH */
  function timestamp() {
    var time = new Date();// prende il nuovo tempo
    var hours = time.getHours() + '';
    var minutes = time.getMinutes() + '';
    var seconds = time.getSeconds() + '';
    var milliseconds = time.getMilliseconds() + '';
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    if (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }
    var lastTime = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    console.log('FINISH', lastTime);
    var li = document.createElement("LI");
    var num = document.createElement("INPUT");
    num.type = "number";
    num.id = "petF" + lineId;
    num.addEventListener("change", function() {bibInsertion(this);});
    var finishTime = document.createElement("INPUT");
    finishTime.value = lastTime;
    finishTime.id = "finish" + lineId
    li.appendChild(num);
    li.appendChild(finishTime);
    arrives.appendChild(li);
    var newTime = {
      bib: '',
      type: 'finish',
      time: lastTime
    };
    beats.push(newTime);// aggiunge il tempo all'array
    console.log(6, newTime);
    lineId += 1;
  }

  /* Acquisizione e stampa del tempo in START */
  function startstamp() {
    var time = new Date();// prende il nuovo tempo
    var hours = time.getHours() + '';
    var minutes = time.getMinutes() + '';
    var seconds = time.getSeconds() + '';
    var milliseconds = time.getMilliseconds() + '';
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    if (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }
    var lastTime = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    console.log('START', lastTime);
    var li = document.createElement("LI");
    var num = document.createElement("INPUT");
    num.type = "number";
    num.id = "petS" + lineId;
    num.addEventListener("change", function() {bibInsertion(this);});
    var startTime = document.createElement("INPUT");
    startTime.value = lastTime;
    startTime.id = "start" + lineId
    li.appendChild(num);
    li.appendChild(startTime);
    starts.appendChild(li);
    var newTime = {
      bib: '',
      type: 'start',
      time: lastTime
    };
    beats.push(newTime);// aggiunge il tempo all'array
    console.log(6, newTime);
    lineId += 1;
  }

  /* stampa tempi se premuto tasto invio (F) o spazio (S) */
  function enterKey(event) {
    event = event || window.event;
    var key = event.keyCode;
    if (key===13) {
      timestamp();
    } else if (key===32) {
      startstamp();
    }
  };
  document.addEventListener('keyup', enterKey, false);

  function calcResults(time) {
    var splittedStart = time.startTime.split(':');
    var secStart = splittedStart[2].split('.');
    var start = Number(splittedStart[0])*3600 + Number(splittedStart[1])*60 + Number(secStart[0]) + Number(secStart[1])/1000;
    var splittedFinish = time.finishTime.split(':');
    var secFinish = splittedFinish[2].split('.');
    var finish = Number(splittedFinish[0])*3600 + Number(splittedFinish[1])*60 + Number(secFinish[0]) + Number(secFinish[1])/1000;
    var net = finish - start;
    net = Math.floor(net*100)/100;
    var hh = Math.floor(net/3600);
    var mm = Math.floor((net-hh)/60).toString();
    var ss = (net-hh)%60;
    ss = ss.toString();
    ss = ss.slice(0, (ss.indexOf("."))+3);
    Math.floor(Number(ss));
    if (mm < 10) {
      mm = '0' + mm;
    }
    var stringScore = '';
    if (hh === 0) {
      stringScore = mm + "'" + ss;
    } else {
      stringScore = hh + ":" + mm + "'" + ss;
    }
    var li = document.createElement("LI");
    var num = document.createElement("INPUT");
    num.type = "number";
    num.value = time.bib;
    var scoreTime = document.createElement("INPUT");
    scoreTime.value = stringScore;
    li.appendChild(num);
    li.appendChild(scoreTime);
    results.appendChild(li);
    /* creazione dell'array per la classifica */
    var ranksum = net + (time.bib/1000000);
    ranking.push(ranksum);
  }

  /* Assegna il pettorale al tempo */
  function bibInsertion(element) {
    var beatRef = element.id.slice(4);
    var bibID = document.getElementById(element.id).value;
    beats[beatRef].bib = bibID;
    console.log('times.length ??', times.length);
    var missing;
    for (var i = 0; i < times.length; i++) {
      if (times[i].bib == bibID) {
        if (times[i].startTime !== '' && beats[beatRef].type === 'start') {
          var conf = confirm('Tempo già presente, vuoi confermare questo abbinamento?');
          if (conf === true) {
            times[i].startTime = beats[beatRef].time;// TODO: Cos'altro posso fare qui in risposta?
            console.log("times[i] = ", times[i], "beats[beatRef] ? ", beats[beatRef]);
          } else {
            return;
          }
        } else if (times[i].finishTime !== '' && beats[beatRef].type === 'finish') {
          var conf = confirm('Tempo già presente, vuoi confermare questo abbinamento?');
          if (conf === true) {
            console.log("times[i] = ", times[i], "beats[beatRef] ? ", beats[beatRef]);
            times[i].finishTime = beats[beatRef].time;
          } else {
            return;
          }
        } else if (beats[beatRef].type === 'start' && times[i].startTime === ''){
          times[i].startTime = beats[beatRef].time;
          if (times[i].finishTime !== '') {
            calcResults(times[i]);
          }
        } else if (beats[beatRef].type === 'finish' && times[i].finishTime === ''){
          times[i].finishTime = beats[beatRef].time;
          if (times[i].startTime !== '') {
            calcResults(times[i]);
          }
        }
      } else {
        missing = true;
      }
    }
    if (missing) {
      var addingTime = {
        bib: bibID,
        startTime: '',
        finishTime: ''
      };
      if (beats[beatRef].type === 'start') {
        addingTime.startTime = beats[beatRef].time;
        times.push(addingTime);
        console.log('Added startTime to', bibID);
      } else if (beats[beatRef].type === 'finish') {
        addingTime.finishTime = beats[beatRef].time;
        times.push(addingTime);
        console.log('Added finishTime to', bibID);
      } else {
        console.error('Something went wrong');
      }
    }
    if (times.length === 0) {//inserisce primo tempo
      var addingTime = {
        bib: bibID,
        startTime: '',
        finishTime: ''
      };
      if (beats[beatRef].type === 'start') {
        addingTime.startTime = beats[beatRef].time;
        times.push(addingTime);
        console.log('Added first time with startTime');
      } else if (beats[beatRef].type === 'finish') {
        addingTime.finishTime = beats[beatRef].time;
        times.push(addingTime);
        console.log('Added first time with finishTime');
      } else {
        console.error('Something went wrong');
      }
    }
    console.log(8, 'beatRef:', beatRef, 'beats:', beats[beatRef]);
  }

  /* pannello partenze teoriche e a gruppi */
  var visible = false;
  massStarter.addEventListener('click', function () {
    if (visible) {
      massStartPanel.style.display = 'none';
      visible = false;
    } else {
      massStartPanel.style.display = 'block';
      visible = true;
    }
    massStarter.blur();
  });
  var cancel = document.getElementById('cancel');
  cancel.addEventListener('click', function () {
    massStartPanel.style.display = 'none';
    visible = false;
  });
  /* gestione partenze teoriche */
  var conf = document.getElementById('confirmStarts');
  conf.addEventListener('click', function () {
    var firstbib = document.getElementById('firstbib').value;
    var lastbib = document.getElementById('lastbib').value;
    var massStartTime = document.getElementById('massStartTime').value;
    var difference = document.getElementById('difference').value;
    if (firstbib == NaN || firstbib === '') {
      alert('Inserire pettorale iniziale'); return;
    }
    if (lastbib == NaN || lastbib === '') {
      alert('Inserire pettorale finale'); return;
    }
    if (massStartTime == '' || massStartTime == undefined || massStartTime == null) {
      alert('Inserire ora di partenza'); return;
    }
    if (difference == NaN) {
      alert('Inserire pettorale iniziale'); return;
    }
    var splitted = massStartTime.split(':');
    var secs;
    if (splitted[2] == undefined) {
      alert('Invalid time format, use hh:mm:ss.d');
      return;
    } else {
      secs = splitted[2].split('.');
    }
    console.log(2, splitted, secs);
    var timeInSeconds = Number(splitted[0])*3600 + Number(splitted[1])*60 + Number(splitted[2]);
    console.log(typeof(timeInSeconds), timeInSeconds);
    for (var n = firstbib; n <= lastbib; n++) {
      var hh = Math.floor(timeInSeconds/3600);
      var mm = Math.floor((timeInSeconds%3600)/60);
      var ss = (timeInSeconds%3600)%60;
      var singleStart = hh.toString() + ':' + (mm > 9 ? mm : "0" + mm) + ':' + (ss > 9 ? ss : "0" + ss);
      var beatStart = {
        bib: n.toString(),
        type: 'start',
        time: singleStart
      }
      beats.push(beatStart);
      var li = document.createElement("LI");
      var num = document.createElement("INPUT");
      num.type = "number";
      num.id = "petS" + lineId;
      num.value = n;
      num.addEventListener("change", function() {bibInsertion(this);});
      var startTime = document.createElement("INPUT");
      startTime.id = "start" + lineId
      startTime.value = singleStart;
      li.appendChild(num);
      li.appendChild(startTime);
      starts.appendChild(li);
      lineId += 1;
      if (singleStart.length > 10) {
        console.error('Invalid start time', singleStart);
        return;
      }
      timeInSeconds = timeInSeconds + Number(difference);
    }
    console.log('Partenze da ', firstbib, ' a ', lastbib, ' inserite.');
    alert('Partenze inserite correttamente!');
  });

  /* Funzione tasto reset per cancellare tutto */
  reset.addEventListener("click", function () {
    var conf1 = confirm("Vuoi cancellare tutti i tempi in memoria?");
    reset.blur();
    var conf2;
    if (conf1 === true) {
      conf2 = confirm("L'eliminazione è definitiva. Sei sicuro?");
    } else {
      return;
    }
    if (conf2 === true) {
      times = [];
      beats = [];
      ranking = [];
      lineId = 0;
      arrives.innerHTML = "";
      starts.innerHTML = "";
      results.innerHTML = "";
      console.warn("Lista tempi azzerata.");
      localStorage.setItem("times", times);
      localStorage.setItem("beats", beats);
    } else {
      return;
    }
  });

  /* riordina i tempi netti in base alla classifica */
  update.addEventListener("click", function () {
    ranking = ranking.sort();
    results.innerHTML = "";
    for (var i = 0; i < ranking.length; i++) {
      var net = Math.floor(ranking[i]*100)
      net = net/100;
      var hh = Math.floor(net/3600);
      var mm = Math.floor((net-hh)/60).toString();
      var ss = (net-hh)%60;
      ss = ss.toString();
      ss = ss.slice(0, (ss.indexOf("."))+3);
      Math.floor(Number(ss));
      if (mm < 10) {
        mm = '0' + mm;
      }
      var stringScore = '';
      if (hh === 0) {
        stringScore = mm + "'" + ss;
      } else {
        stringScore = hh + ":" + mm + "'" + ss;
      }
      var bib = ranking[i] - net;
      bib = Math.round(bib * 1000000);
      var li = document.createElement("LI");
      var num = document.createElement("INPUT");
      num.type = "number";
      num.value = bib;
      var scoreTime = document.createElement("INPUT");
      scoreTime.value = stringScore;
      li.appendChild(num);
      li.appendChild(scoreTime);
      results.appendChild(li);
    }
    console.log('Results sorted!');
  });

  /* salva elenco tempi in stringa */
  window.onbeforeunload = function(e) {
    console.log(9, times, typeof(times));
    var chainedTimesStringed = '';
    var chainedBeatsStringed = '';
    for (var i = 0; i < times.length; i++) {
      chainedTimesStringed = chainedTimesStringed + JSON.stringify(times[i]);
    }
    for (var j = 0; j < beats.length; j++) {
      chainedBeatsStringed = chainedBeatsStringed + JSON.stringify(beats[j]);
    }
    localStorage.setItem("times", chainedTimesStringed);
    localStorage.setItem("beats", chainedBeatsStringed);
  };
});
