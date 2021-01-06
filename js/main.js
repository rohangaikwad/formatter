require.config({ paths: { 'vs': 'js/monaco-editor-package/min/vs' } });

var orgEditor, newEditor;

require(['vs/editor/editor.main'], function () {
    orgEditor = monaco.editor.create(document.querySelector('.editor.org'), {
        value: '', wordWrap: true, language: 'html'
    });
});

let lang = document.getElementById('lang');
lang.addEventListener('change', () => {
    [orgEditor].forEach(_editor => {
        let data = _editor.getValue();
        var oldModel = _editor.getModel();
        var newModel = monaco.editor.createModel(data, lang.value);
        _editor.setModel(newModel);
        if (oldModel) {
            oldModel.dispose();
        }
    });
})

document.querySelector('.src.s1 button').addEventListener('click', () => {
    let url1 = document.getElementById('url1');
    console.log(url1.value)
    if (url1.value.length > 0) {

        fetch(url1)
            .then(res => res.text())
            .then(res => {
                orgEditor.getModel().setValue(res);
            })
            .catch(err => {
                console.error(err);
                alert(err);
            })
    }
});


document.querySelector('#formatCode').addEventListener('click', () => {
    orgEditor.trigger('any', 'editor.action.formatDocument');    
});

window.addEventListener('resize', () => {
    orgEditor !== null && orgEditor.layout();
});

let loadFromFile = (file, editor) => {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            editor.setValue(evt.target.result);
        }
    }
}

document.getElementById("fOrg").addEventListener('change', (e) => {
    console.log(e);
    var file = document.getElementById("fOrg").files[0];
    loadFromFile(file, orgEditor);
});


if (navigator.serviceWorker) {
    navigator.serviceWorker.register('serviceWorker.js');
    console.log("diffchecker service worker registered");
}