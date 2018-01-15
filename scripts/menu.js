const electron = require('electron');
const fs = require('fs');

const app = electron.app
const dialog = electron.dialog

const template = [
  {
    label: 'Options',
    submenu: [
      {
        label:'open',
        click: openFile,
      },
      {
        label:'save',
        click: saveFile,
      },
      {
        label:'save as',
        click: saveFileAs,
      },
      {type: 'separator'},
      {
        label:'exit',
        click: function () {
          // TODO: Later on could check if current work is saved before quit.
          app.quit()
        },
      }
    ]
  },
  {
    label: 'Calculate',
    submenu: [
      {role: 'print-graph', label:'print graph'},
      {role: 'all-values', label:'values'},
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
]

function openFile() {
  const options = {
    title: 'Open JSON',
    filters: [
      {name: 'Graph', extensions: ['json']}
    ]
  }
  dialog.showOpenDialog(options, function(filenames) {
    if (filenames) {
      // not dealing with opening lots of files at this point
      let fn = filenames[0]
      fs.readFile(fn, "utf8", function(err, data){
        if (err) {
          console.log(err);
        }
        // TODO: send the JSON to the renderer
        console.log(data);
      })
    }
  })
}

function saveFile(filename, data) {
  fs.writeFile(filename, data, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Something may have been saved.");
      console.log(data);
    }
  })
}

function saveFileAs(data) {
  const options = {
    title: 'Save json as...',
    filters: [
      {name: 'GraphThingy', extensions: ['json']}
    ]
  }
  dialog.showSaveDialog(options, function (filename) {
    // Using synchronous message for the returnValue instead of making more functions
    let data = JSON.stringify(mainGraph.nodes)
    saveFile(filename, data)
  })
}

module.exports = template;
