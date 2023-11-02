// ==UserScript==
// @name         Custom SL+ v2 Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
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
                    <label class="form-check-label" for="useCustomTheme"><b>Use Custom Theme </b></label><b style="cursor:pointer;text-decoration:underline;margin-left: 1%;color: var(--bs-link-color);user-select: none;" id="customThemeEditButton">(Click here to edit)</b>
                    <input class="form-check-input float-end" type="checkbox" name="useCustomTheme" id="useCustomTheme">`;

    const optionElement = document.createElement("div");
    optionElement.setAttribute("class", "form-check ps-0");
    optionElement.innerHTML = OptionHTML;

    let optionModal = document.querySelector("#settingsModal .modal-body");
    optionModal.insertBefore(optionElement, optionModal.querySelector("label:not(.form-check-label)"));

    let useCustomThemeIndicator = document.querySelector("#useCustomTheme");
    useCustomThemeIndicator.addEventListener("change", function () {
        saveState(!useCustom);
    });

    const CustomThemeEditorModalHTML = `<div class="modal" id="customThemeEditor" tabindex="-1" data-nosnippet>
    <div class="modal-dialog modal-lg d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div class="modal-content">
            <div class="modal-body">
                <h5 class="text-center">Custom Theme Editor</h5>
                <p class="text-center">Changes are automatically saved and taken effect</p>
                <textarea rows="20" style="width: 100%; font-family: monospace; font-size: 10pt;" id="customThemeText"></textarea>
            </div>
        </div>
    </div>
</div>`

    const placeHolder = document.createElement("div");
    placeHolder.innerHTML = CustomThemeEditorModalHTML;
    document.body.appendChild(placeHolder.childNodes[0]);

    const textEditor = document.querySelector("#customThemeText");

    const CustomThemeEditorModal = new window.bootstrap.Modal(document.querySelector("#customThemeEditor"), {
        keyboard: true,
        backdrop: true
    });

    document.querySelector("#customThemeEditButton").addEventListener("click", function () {
        CustomThemeEditorModal.show();
        textEditor.value = localStorage.getItem("customCSSStyle");
        textEditor.focus();
    });

    textEditor.addEventListener("input", function (e) {
        localStorage.setItem("customCSSStyle", textEditor.value);
        loadCustom();
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

    let saveState = function (state) {
        useCustom = !!state;
        localStorage.setItem("useCustomCSS", state);
        useCustomThemeIndicator.checked = state;
        loadCustom();
    }, linkElement = document.querySelector("#themeStylesheet"), useCustom = localStorage.getItem("useCustomCSS") == "true", loadCustom = function () {
        linkElement.setAttribute("rel", useCustom ? "none" : "stylesheet");
        if (useCustom) {
            document.head.appendChild(customCSSElement);
            customCSSElement.innerHTML = localStorage.getItem("customCSSStyle") || "";
        }
        else customCSSElement.remove();
    }, customCSSElement = document.createElement("style");

    saveState(useCustom);
})();