"use strict";
APIParser.lastTime((time) => {
    $('.last_date').text(time);
    let date_array = time.split('.').reverse();
    $('#prevod-button').val('Převést měnu pro datum ' + time);
    $('#input-datum').attr('max', date_array[0] + '-' + date_array[1] + '-' +  date_array[2]);
    $('#input-datum').val(date_array[0] + '-' + date_array[1] + '-' +  date_array[2]);
});

APIParser.currency((options, count = null) => {
    let i, array_options = options.split('</option>').sort();

    options = '<option value="disabled" id="option-to-delete" disabled selected>Vyber měnu</option>';


    for(i = 0; i < array_options.length; i++) {
        options += array_options[i] + '</option>'
    }

    $('.meny').html(options);
    $('#currency_count').text(count);

});

/**
 * @param element
 * @param template
 * @param variables
 * @param blind
 */
function createComponent(element, template, variables, blind) {
    element = "#" + element;
    blind = (typeof blind === 'undefined');
    $(element).html(document.getElementById(template).innerHTML.strReplace(variables));
    (blind) ? $(element).show("blind") : $(element).fadeIn('slow');

    $('html, body').animate({
        scrollTop: $(element).offset().top
    }, 1300);
}

/**
 * @param element
 */
function deleteComponent(element) {
    element = "#" + element;
    $(element).hide( "blind" );
}
/**
 * @param i
 * @returns {string}
 */
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

$('a').attr('target', '_blank');
$(()=>{$('[data-toggle="tooltip"]').tooltip();});
$('[data-tooltip-slow]').tooltip({
    delay: {
        show: 1000,
        hide: 0
    }
});
$('.overlay-loader').fadeOut(800);
setTimeout(()=>{
    $('.body').fadeIn(600);
}, 800);

$(document).ready(function() {
    $('#input-datum').on('change',()=>{
        let val = $(this).val().split('-').reverse(),
            result;

        if(typeof val[2] === "undefined") {
            $('#prevod-button').val('Chyba! Vybral jste den který v daném měsíci neexistuje.');
            $('#prevod-button').attr('disabled', 'disabled');
        } else {
            result = val[0] + '.' + val[1] + '.' + val[2];
            $('#prevod-button').val('Převést měnu pro datum ' + result);
            $('#prevod-button').removeAttr('disabled');
        }
    });
});

$('.meny::-webkit-scrollbar-track').css('backgroundColor', '#e4f5e4');
$('#prevod-button').on('click', ()=>{
    let first = document.getElementById('first'),
        second = document.getElementById('second'),
        castka = document.getElementById('input-castka'),
        zaokr = document.getElementById('input-zaokr'),
        d = new Date(), time, datum = document.getElementById('input-datum');

    if(first.value !== 'disabled' && first.value && second.value !== 'disabled' && second.value) {
        APIParser.getMoney(first.value, second.value,(countfirst, countsecond, ok) => {
            if(ok) {
                let zaokrvalue = zaokr.value;
                if (parseFloat(zaokrvalue) > 9) {
                    zaokr.value = "9";
                    time = addZero(d.getHours()) + ':' + addZero(d.getMinutes());
                    createComponent('alert-vysledek', 'alert', {
                        '{{type}}': 'warning',
                        '{{nadpis}}': 'Změna ve výpočtu',
                        '{{obsah}}': 'Zadal jste v zaokrouhlení větší číslo jak 9, proto byl výpočet automaticky zaokrouhlen na 9 desetinných čísel. Limit je nastaven kvůli dobré viditelnosti.',
                        '{{footer}}': time
                    });
                } else {
                    deleteComponent('alert-vysledek', 1000);
                }

                let vysledek = (parseFloat(countfirst) * parseFloat(castka.value) / parseFloat(countsecond)).toFixed(parseFloat(zaokr.value));
                let zpetny = (parseFloat(countsecond) * parseFloat(castka.value) / parseFloat(countfirst)).toFixed(parseFloat(zaokr.value));

                createComponent('vysledek', 'tabulka-vysledek', {
                    '{{mena1}}': first.value,
                    '{{mena2}}': second.value,
                    '{{castka1}}': castka.value + ' ' + first.value,
                    '{{castka2}}': vysledek + ' ' + second.value,
                    '{{zpetny1}}': castka.value + ' ' + second.value,
                    '{{zpetny2}}': zpetny + ' ' + first.value,
                    '{{date}}': datum.value.split('-').reverse().join('.')
                }, false);

            } else {
                createComponent('alert-vysledek', 'alert', {
                    '{{type}}': 'danger',
                    '{{nadpis}}': 'Chyba datumu',
                    '{{obsah}}': 'Nastavil jste datum kdy daná měna nebyla k dispozici v kurzovním lístku od ČNB, prosím zadejte novější datum.',
                    '{{footer}}': addZero(d.getHours()) + ':' + addZero(d.getMinutes())
                });
            }

        }, datum.value.split('-').reverse().join('.'));
    } else {
        $('#prevod-button').val('Nemůžeš převádět když sis nevybral měnu.');
        $('#prevod-button').attr('disabled', 'disabled');
        setTimeout(()=>{
            $('#prevod-button').val('Zkus to znovu.. převést měnu pro datum ' + $('#input-datum').val().split('-').reverse().join('.'));
            $('#prevod-button').removeAttr('disabled');
        }, 1000)

    }
});
