function expandCollapse() {
  document.querySelectorAll(".toggle").forEach(function(el) {
    el.addEventListener("click", function() {
      if (el.classList.contains("active")) {
        el.classList.remove("active");
      } else {
        document.querySelectorAll(".active").forEach(function(el) {
          el.classList.remove("active");
        });
        el.classList.add("active");
      }
    });
  });
}

function activateCheckboxes() {
  document.querySelectorAll("input[type='checkbox'][disabled]").forEach(function(el) {
    el.disabled = false;
  });
}

function getDOMCheckboxes() {
  // Pull all relevant checkbox data from the current DOM state
  var checkboxArr = [];
  document.querySelectorAll("ul.task-list label").forEach(function(checkbox) {
    checkboxArr.push({
      text: checkbox.innerText,
      page: window.location.pathname,
      el: checkbox,
    });
  });
  return checkboxArr;
}

function getDatabase() {
  if (!"indexedDB" in window) {
    console.log("No IndexedDB");
    return;
  }

  var dbReq = window.indexedDB.open("checkbox-db", 1);

  dbReq.onerror = function(event) {
    console.log("indexedDB not allowed");
  };

  dbReq.onupgradeneeded = function(event) {
    var db = event.target.result;
    var store = db.createObjectStore("checkboxes", {keyPath: "id", autoIncrement: true});
    store.createIndex("text", "text", {unique: false});
    store.createIndex("page", "page", {unique: false});
  };

  dbReq.onsuccess = function(event) {
    var db = event.target.result;
    var store = db.transaction("checkboxes", "readonly").objectStore("checkboxes");
    store.getAll().onsuccess = function(evt) {
      syncCheckboxData(db, evt.target.result);
    };
  };
}

function syncCheckboxData(db, data) {
  // Load all checkboxes from the DOM into the store if not already present
  var checkboxes = getDOMCheckboxes();
  var store = db.transaction("checkboxes", "readwrite").objectStore("checkboxes");

  checkboxes.filter(function(checkbox) {
    return !data.find(function(dbCheckbox) {
      return dbCheckbox.text === checkbox.text && dbCheckbox.page === checkbox.page;
    });
  }).map(function(checkbox) {
    return {
      text: checkbox.text,
      page: checkbox.page,
      checked: checkbox.el.querySelector("input").checked,
    };
  }).forEach(function(checkbox) {
    store.add(checkbox);
  });

  store.getAll().onsuccess = function(event) {
    checkboxes.forEach(function(checkbox) {
      setCheckboxState(checkbox, event.target.result, db);
    });
  };
}

function setCheckboxState(checkbox, dbCheckboxes, db) {
  // Set the checkbox as checked to match DB state, set event listener for updates
  var dbCheckbox = dbCheckboxes.find(function(dbCheckbox) {
    return dbCheckbox.text === checkbox.text && dbCheckbox.page === checkbox.page;
  });
  if (dbCheckbox.checked) {
    checkbox.el.querySelector("input").checked = true;
  }
  checkbox.el.querySelector("input").addEventListener("change", function(event) {
    var checkboxStore = db.transaction("checkboxes", "readwrite").objectStore("checkboxes");
    checkboxStore.put(Object.assign(dbCheckbox, {checked: event.target.checked}));
  });
}

document.addEventListener("DOMContentLoaded", function() {
  expandCollapse();
  activateCheckboxes();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
  getDatabase();
});
