// ==UserScript==
// @name         Custom SL+ v2 Theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add your custom theme for SL+ v2
// @author       Bhpsngum
// @match        https://starblast.dankdmitron.dev/
// @icon         https://starblast.dankdmitron.dev/img/dankdmitron.png
// @downloadURL  https://github.com/Bhpsngum/bin/raw/master/CustomSLTheme.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const OptionHTML = `
                    <label class="form-check-label" for="useCustomTheme"><b>Custom Theme </b></label><b style="cursor:pointer;text-decoration:underline;margin-left: 1%;color: var(--bs-link-color);user-select: none;" id="customThemeEditButton">(Click to edit current selection)</b>
                    <select class="form-select-sm float-end" name="useCustomTheme" id="useCustomTheme"></select>`;

    const optionElement = document.createElement("div");
    optionElement.setAttribute("class", "form-check ps-0");
    optionElement.setAttribute("style", "margin-bottom: 2%");
    optionElement.innerHTML = OptionHTML;

    let optionModal = document.querySelector("#settingsModal .modal-body");
    let x = document.querySelector("#settingsModal .modal-dialog");
    x.setAttribute("class", x.getAttribute("class") + " modal-lg");
    optionModal.insertBefore(optionElement, optionModal.querySelector("label:not(.form-check-label)"));

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
            <button class="btn btn-danger" id="deleteCustomTheme" style="
                position: relative;
                left: 50%;
                -ms-transform: translateX(-50%);
                transform: translateX(-50%);
            ">Delete theme</button>
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
            theme.name = themeName.value || "Unamed custom theme";
            theme.code = textEditor.value || "";
            saveToStorage();
            updateThemeSelector();
            loadCustom();
        }
    }

    document.querySelector("#deleteCustomTheme").addEventListener("click", function () {
        let theme = getCustomThemeSet();
        if (theme != null && confirm("Are you sure to delete this custom theme?")) {
            customThemeList.splice(useCustom - 1, 1);
            if (useCustom > customThemeList.length) useCustom = customThemeList.length;
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
        let nameList = ["None", ...customThemeList.map(e => e.name || "Unamed custom theme"), "+ Add a new theme"];
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
                // create a new theme profile
                customThemeList.push({
                    name: "Unamed custom theme",
                    code: ""
                });
                state = customThemeList.length;
                saveToStorage();
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
    }, customCSSElement = document.createElement("style");

    saveState(useCustom, true);
})();