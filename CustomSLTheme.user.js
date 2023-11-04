// ==UserScript==
// @name         Custom SL+ v2 Theme
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add your custom theme for SL+ v2
// @author       Bhpsngum
// @match        https://starblast.dankdmitron.dev/
// @icon         https://starblast.dankdmitron.dev/img/dankdmitron.png
// @downloadURL  https://github.com/Bhpsngum/bin/raw/master/CustomSLTheme.user.js
// @updateURL    https://github.com/Bhpsngum/bin/raw/master/CustomSLTheme.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const OptionHTML = `
                    <label style="width: -moz-available;width: -webkit-fill-available;width: fill-available;" class="form-check-label" for="useCustomTheme"><b>Custom Theme </b></label>
                    <select class="form-select-sm" style="max-width:30%" name="useCustomTheme" id="useCustomTheme"></select>
                    <button class="btn btn-danger" style="padding-top:0;padding-bottom:0;margin-left:1%;" id="customThemeEditButton">Edit</button>
                    <button class="btn btn-danger" style="padding-top:0;padding-bottom:0;margin-left:1%;" id="deleteCustomTheme">Delete</button>`;

    const optionElement = document.createElement("div");
    optionElement.setAttribute("style", "display: flex;align-items:center;overflow:scroll");
    optionElement.innerHTML = OptionHTML;

    let optionModal = document.querySelector("#settingsModal .modal-body");

    // wrap the old theme selector into a div
    let div = document.createElement("div");
    div.setAttribute("style", "overflow: scroll; margin-bottom: 1%;");
    div.appendChild(optionModal.querySelector(`label[for="preferenceTheme"]`));
    div.appendChild(optionModal.querySelector("#preferenceTheme"));

    optionModal.appendChild(div);
    
    optionModal.appendChild(optionElement);

    let useCustomThemeIndicator = document.querySelector("#useCustomTheme");
    useCustomThemeIndicator.addEventListener("change", function () {
        saveState(this.value);
    });

    const CustomThemeEditorModalHTML = `<div class="modal" id="customThemeEditor" tabindex="-1" data-nosnippet>
    <div class="modal-dialog modal-lg d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div class="modal-content">
        <div class="modal-body">
            <h5 class="text-center">Custom Theme Editor</h5>
            <p class="text-center" style="
                margin-bottom: 0;
            ">Changes are automatically saved and taken effect</p>Name:<input type="text" id="customThemeName" class="form-control" autocomplete="off" autocapitalize="off" placeholder="Your theme name">
            Code:
            <textarea rows="20" style="width: 100%; font-family: monospace; font-size: 10pt;" id="customThemeText"></textarea>
            </div>
        </div>
    </div>
</div>`

    const placeHolder = document.createElement("div");
    placeHolder.innerHTML = CustomThemeEditorModalHTML;
    document.body.appendChild(placeHolder.childNodes[0]);

    const textEditor = document.querySelector("#customThemeText");
    const themeName = document.querySelector("#customThemeName");
    const allowEdit = document.querySelector("#customThemeEditButton");
    const deleteTheme = document.querySelector("#deleteCustomTheme");

    const CustomThemeEditorModal = new window.bootstrap.Modal(document.querySelector("#customThemeEditor"), {
        keyboard: true,
        backdrop: true
    });

    allowEdit.addEventListener("click", function () {
        let theme = getCustomThemeSet();
        if (theme != null) {
            CustomThemeEditorModal.show();
            themeName.value = theme.name || "";
            textEditor.value = theme.code || "";
            textEditor.focus();
        }
    });

    themeName.addEventListener("change", function (e) {
        saveTheme();
    });

    textEditor.addEventListener("input", function (e) {
        saveTheme();
    });

    let saveToStorage = function () {
        localStorage.setItem("customCSSStyle", JSON.stringify(customThemeList));
    }, saveTheme = function () {
        let theme = getCustomThemeSet();
        if (theme != null) {
            theme.name = themeName.value || "Unamed theme";
            theme.code = textEditor.value || "";
            saveToStorage();
            updateThemeSelector();
            loadCustom();
        }
    }

    deleteTheme.addEventListener("click", function () {
        let theme = getCustomThemeSet();
        if (theme != null && confirm("Are you sure to delete this custom theme?")) {
            customThemeList.splice(useCustom - 1, 1);
            if (useCustom > customThemeList.length) {
                useCustom = customThemeList.length;
                localStorage.setItem("useCustomCSS", useCustom);
            }
            saveToStorage();
            updateThemeSelector();
            loadCustom();
            CustomThemeEditorModal.hide();
        }
    });

    textEditor.addEventListener('keydown', function(e) {
      if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;
      }
    });

    let useCustom = +localStorage.getItem("useCustomCSS") || 0, customThemeList = localStorage.getItem("customCSSStyle");

    let getCustomThemeSet = function () {
        if (!useCustom) return null;
        let theme = customThemeList[useCustom - 1];
        if (theme == null) {
            useCustom = 0;
            localStorage.setItem("useCustomCSS", useCustom);
            return null;
        }
        return theme;
    }
    try {
        customThemeList = JSON.parse(customThemeList) || [];
        for (let i = 0; i < customThemeList.length; ++i) {
            customThemeList[i] = customThemeList[i] || {};
        }
    } catch (e) { customThemeList = [] }
    saveToStorage();

    let updateThemeSelector = function () {
        let nameList = ["None", ...customThemeList.map(e => e.name || "Unamed theme"), "Add theme..."];
        useCustomThemeIndicator.innerHTML = "";
        nameList.forEach((name, index) => {
            let opt = document.createElement("option");
            opt.setAttribute("value", index);
            opt.innerText = name;
            useCustomThemeIndicator.appendChild(opt);
        });
        useCustomThemeIndicator.value = useCustom;
    }

    let saveState = function (state, init) {
        if (state < 0 && init) state = 0;
        if (state != 0) {
            useCustom = state;
            if (getCustomThemeSet() == null) {
                if (init) state = 0;
                else {
                    // create a new theme profile
                    customThemeList.push({
                        name: "Unamed theme",
                        code: ""
                    });
                    state = customThemeList.length;
                    saveToStorage();
                }
            }   
        }
        localStorage.setItem("useCustomCSS", state);
        useCustom = state;
        loadCustom();
    }, linkElement = document.querySelector("#themeStylesheet"), loadCustom = function () {
        let theme = getCustomThemeSet();
        linkElement.setAttribute("rel", theme != null ? "none" : "stylesheet");
        if (theme != null) {
            document.head.appendChild(customCSSElement);
            customCSSElement.innerHTML = theme.code || "";
        }
        else customCSSElement.remove();
        updateThemeSelector();
        allowEdit[(useCustom ? "remove" : "set") + "Attribute"]("hidden", "");
        deleteTheme[(useCustom ? "remove" : "set") + "Attribute"]("hidden", "");
        div[(useCustom ? "set" : "remove") + "Attribute"]("hidden", "");
    }, customCSSElement = document.createElement("style");

    saveState(useCustom, true);
})();