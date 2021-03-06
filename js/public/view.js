"use strict";
import {config} from "../config.js";
import * as Template from "../core/templating.js"
import {APIParser} from '../api/main.js';

APIParser.lastTime(time => {
    $('.last_date').text(time);
    let date_array = time.split('.').reverse();
    $('#prevod-button').val('Převést měnu pro datum ' + time);
    $('#input-datum').attr('max', date_array[0] + '-' + date_array[1] + '-' +  date_array[2]);
    $('#input-datum').val(date_array[0] + '-' + date_array[1] + '-' +  date_array[2]);
});

APIParser.currency((options, count) => {
    let i, array_options = options.split('</option>').sort();

    options = '<option value="disabled" id="option-to-delete" disabled selected>Vyber měnu</option>';


    for(i = 0; i < array_options.length; i++) {
        options += array_options[i] + '</option>'
    }

    $('.meny').html(options);
    $('#currency_count').text(count);
});



function addZero(i) {
    if (i < 10) i = "0" + i;
    return i;
}

$(()=>{$('[data-toggle="tooltip"]').tooltip();});
$('[data-tooltip-slow]').tooltip(config.UI.tooltip_slow);
$('.overlay-loader').fadeOut(800);
setTimeout(()=>{
    $('.body').fadeIn(600);
}, 800);


$('#input-datum').on('change', () => {
    let val = $('#input-datum').val().split('-').reverse(), result;
    if(typeof val[2] === "undefined") {
        $('#prevod-button').val('Chyba! Vybral jste den který v daném měsíci neexistuje.');
        $('#prevod-button').attr('disabled', 'disabled');
    } else {
        result = val[0] + '.' + val[1] + '.' + val[2];
        $('#prevod-button').val('Převést měnu pro datum ' + result);
        $('#prevod-button').removeAttr('disabled');
    }
});

$('#prevod-button').on('click', ()=>{
    let first = document.getElementById('first'),
        second = document.getElementById('second'),
        castka = document.getElementById('input-castka'),
        zaokr = document.getElementById('input-zaokr'),
        d = new Date(), time, datum = document.getElementById('input-datum');

    let before_val = $('#prevod-button').val();
    $('#prevod-button').val(config.MSGS.processing);
    $('#prevod-button').attr('disabled', 'disabled');
    if(first.value !== 'disabled' && first.value && second.value !== 'disabled' && second.value
        && parseInt(datum.value.split("-")[0]) >= parseInt(datum.getAttribute('min').split("-")[0]))
    {
        APIParser.getMoney(first.value, second.value,(countfirst, countsecond, ok) => {
            setTimeout(()=> {
                    $('#prevod-button').val(before_val);
                    $('#prevod-button').removeAttr('disabled');
                }, 250);
            if(ok) {
                let zaokrvalue = zaokr.value;
                if (parseFloat(zaokrvalue) > 9) {
                    zaokr.value = "9";
                    time = addZero(d.getHours()) + ':' + addZero(d.getMinutes());
                    Template.createComponent('alert-vysledek', 'alert', {
                        '{{type}}': 'warning',
                        '{{nadpis}}': 'Změna ve výpočtu',
                        '{{obsah}}': 'Zadal jste v zaokrouhlení větší číslo jak 9, proto byl výpočet automaticky zaokrouhlen na 9 desetinných čísel. Limit je nastaven kvůli dobré viditelnosti.',
                        '{{footer}}': time
                    });
                } else {
                    Template.deleteComponent('alert-vysledek', 1000);
                }

                let vysledek = (parseFloat(countfirst) * parseFloat(castka.value) / parseFloat(countsecond)).toFixed(parseFloat(zaokr.value));
                let zpetny = (parseFloat(countsecond) * parseFloat(castka.value) / parseFloat(countfirst)).toFixed(parseFloat(zaokr.value));

                Template.createComponent('vysledek', 'tabulka-vysledek', {
                    '{{mena1}}': first.value.toUpperCase(),
                    '{{mena2}}': second.value.toUpperCase(),
                    '{{castka1}}': castka.value + ' ' + first.value.toUpperCase(),
                    '{{castka2}}': vysledek + ' ' + second.value.toUpperCase(),
                    '{{zpetny1}}': castka.value + ' ' + second.value.toUpperCase(),
                    '{{zpetny2}}': zpetny + ' ' + first.value.toUpperCase(),
                    '{{date}}': datum.value.split('-').reverse().join('.')
                }, false);

            } else {
                Template.createComponent('alert-vysledek', 'alert', {
                    '{{type}}': 'danger fatal',
                    '{{nadpis}}': 'Chyba datumu',
                    '{{obsah}}': 'Nastavil jste datum kdy daná měna nebyla k dispozici v kurzovním lístku od ČNB, prosím zadejte novější datum.',
                    '{{footer}}': addZero(d.getHours()) + ':' + addZero(d.getMinutes())
                });
                Template.deleteComponent('vysledek');
            }

        }, datum.value.split('-').reverse().join('.'));
    } else if(parseInt(datum.value.split('-')[0]) < parseInt(datum.getAttribute('min').split("-")[0])) {
        Template.createComponent('alert-vysledek', 'alert', {
           '{{type}}': 'danger',
           '{{nadpis}}': 'Chyba datum',
           '{{obsah}}': 'Nastavil jste datum, kdy nebyl kurzovní lístek od ČNB k dispozici, prosím zadejte datum od 1.1.1991',
           '{{footer}}': addZero(d.getHours()) + ':' + addZero(d.getMinutes())
        });
    } else {
        $('#prevod-button').val('Nemůžeš převádět když sis nevybral měnu.');
        $('#prevod-button').attr('disabled', 'disabled');
        setTimeout(()=>{
            $('#prevod-button').val('Zkus to znovu.. převést měnu pro datum ' + $('#input-datum').val().split('-').reverse().join('.'));
            $('#prevod-button').removeAttr('disabled');
        }, 1000)
    }
});

$('#kurzy-button').on('click', () => $('#kurzy-modal').modal());
APIParser.renderKurzy();

