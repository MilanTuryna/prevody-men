import {config} from "../config.js";

export function createComponent(element, template, variables, effect = true) { // syntax:: {{var}}
    element = "#" + element;
    $(element).html(document.getElementById(template).innerHTML.strReplace(variables));
    (effect) ? $(element).show(config.UI.show) : $(element).fadeIn(config.UI.fade);

    $('html, body').animate({
        scrollTop: $(element).offset().top
    }, 1300);
}
// syntax: data-insert="var"
export function globalReplace(vars) {Object.keys(vars).forEach(key=>{$(`[data-insert="${key}"]`).html(`${vars[key]}`);});}
export function deleteComponent(element) {
    element = "#" + element;
    $(element).hide(config.UI.show);
}

