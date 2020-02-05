import {config} from "../config.js";
import {XMLParse} from "./xml.js";

export class API {
    static getResponse(callback, date)
    {
        let url = config.REQUEST.classic,
            zaloha_url = config.REQUEST.backup,
            xhttp = new XMLHttpRequest();

        if (date) {
            url = config.REQUEST.with_date + date;
            zaloha_url += '?date=' + date;
        }

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callback(this);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.onerror = function () {
            console.clear();
            xhttp.open('GET', zaloha_url, true);
            xhttp.send();
        };
        xhttp.send();
    }
}

export class APIParser {
    static CURRENCY_READABLE = config.CURRENCY;
    static lastTime(callback)
    {
        API.getResponse((response) => {
            let select = response.responseXML.getElementsByTagName('kurzy')[0].getAttribute('datum');
            callback(select);
        });
    }

    static currency(callback)
    {
        API.getResponse((response) => {
            let op='', x = response.responseXML.getElementsByTagName('radek'), i;

            for(i = 0; i < x.length; i++) {
                op+='<option data-sort="' +  x[i].getAttribute('kod').strReplace(APIParser.CURRENCY_READABLE).toLocaleLowerCase().
                    normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '" value="' + x[i]
                        .getAttribute('kod') + '"'
                    + '>' + x[i].getAttribute('kod').strReplace(APIParser.CURRENCY_READABLE) + '</option>'
            }

            op+='<option data-sort="ceska koruna" value="CZK">Česká koruna</option>';

            let CURRENCY_COUNT = x.length;
            callback(op, CURRENCY_COUNT);
        });
    }

    static getMoney(mena, druhamena, callback, date)
    {
        API.getResponse((response) => {
            let select = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', mena.toUpperCase())[0],
                two_select = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', druhamena.toUpperCase())[0],
                count,
                success,
                two_count;

            if (typeof select === "undefined" || typeof two_select === "undefined") {
                success = false;
            } else {
                if(mena !== 'CZK' && druhamena === 'CZK') {
                    count = select.getAttribute('kurz').replace(",", ".");
                    two_count = '1';
                } else if(mena === 'CZK' && druhamena !== 'CZK') {
                    two_count = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', druhamena.toUpperCase())[0]
                        .getAttribute('kurz')
                        .replace(",", ".");
                    count = '1';
                } else if(mena === 'CZK' && druhamena === 'CZK') {
                    count = '1';
                    two_count = '1';
                } else  {
                    count = select.getAttribute('kurz').replace(",", ".");
                    two_count = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', druhamena.toUpperCase())[0]
                        .getAttribute('kurz')
                        .replace(",", ".");
                }
                success = true;
            }

            callback(count, two_count, success);
        }, date);
    }
}