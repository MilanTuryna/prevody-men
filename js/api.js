"use strict";
String.prototype.strReplace = function(map) {
    return this.replace(new RegExp("(" + Object.keys(map).map(
        function(i) {
            return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
        }).join("|") + ")", "g"),
        function(s) {
            return map[s]
        });
};

Array.prototype.where = function(matcher) {
    let result = [];
    let len = this.length;
    for (var i = 0; i < len; i++) {
        if (matcher(this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};

class API {
    static get settings() {
        return {
            url: 'https://yacdn.org/serve/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml?maxAge=3600',
            zaloha_url: 'https://api.codetabs.com/v1/proxy?quest=https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml',
            date_url: 'https://yacdn.org/proxy/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml'
        };
    }

    static getResponse(callback, date) {
        let url = API.settings.url,
            zaloha_url = API.settings.zaloha_url,
            xhttp = new XMLHttpRequest();

        if (date) {
            url = API.settings.date_url + '?date=' + date;
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

class XMLParse {
    static getElementByAttribute(xml,tag,attr,value) {
        var elems, matcher, output;
        if (tag === 'radek' && attr === 'kod' && value === 'CZK') {
            output = '1';
       } else {
            elems = Array.prototype.slice.call(xml.getElementsByTagName(tag), 0);
            matcher = function (el) {return el.getAttribute(attr) === value;};
            output = elems.where(matcher);
        }

        return output;
    }
}

class APIParser {
    static get CURRENCY_READABLE() {
        return {
            'AUD': 'Australský dolar',
            'BRL': 'Brazilský real',
            'BGN': 'Bulharský lev',
            'CNY' : 'Čínský žen-min-pi',
            'DKK' : 'Dánská koruna',
            'EUR' : 'Euro',
            'PHP' : 'Filipínské peso',
            'HKD' : 'Hongkongský dolar',
            'HRK' : 'Chorvatská kuna',
            'INR' : 'Indická rupie',
            'IDR' : 'Indonéská rupie',
            'ISK' : 'Islandská koruna',
            'ILS' : 'Nový izraelský šekel',
            'JPY' : 'Japonský jen',
            'ZAR' : 'Jihoafrický rand',
            'CAD' : 'Kanadský dolar',
            'KRW' : 'Korejský won',
            'HUF' : 'Maďarský forint',
            'MYR' : 'Malajsijský ringgit',
            'MXN' : 'Mexické peso',
            'XDR' : 'ZPČ (MMF)',
            'NOK' : 'Norská koruna',
            'NZD' : 'Novozélandský dolar',
            'PLN' : 'Polský zlotý',
            'RON' : 'Rumunské leu',
            'RUB' : 'Ruský rubl',
            'SGD' : 'Singapurský dolar',
            'SEK' : 'Švédská koruna',
            'CHF' : 'Švýcarský frank',
            'THB' : 'Thajský baht',
            'TRY' : 'Turecká lira',
            'USD' : 'Americký dolar',
            'GBP' : 'Britská libra',
        };
    }

    static lastTime(callback) {
        API.getResponse(function (response) {
            let select = response.responseXML.getElementsByTagName('kurzy')[0].getAttribute('datum');
            callback(select);
        });
    }
    static currency(callback) {
        API.getResponse(function (response) {
            let op,resp,x,i, alphabet, array_op;
            x = response.responseXML.getElementsByTagName('radek');
            op = '';
            for(i = 0; i < x.length; i++) {
                op+='<option data-sort="' +  x[i].getAttribute('kod').strReplace(APIParser.CURRENCY_READABLE).toLocaleLowerCase().
                    normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '" value="' + x[i].getAttribute('kod') + '"'
                    + '>' + x[i].getAttribute('kod').strReplace(APIParser.CURRENCY_READABLE) + '</option>'
            }
            op+='<option data-sort="ceska koruna" value="CZK">Česká koruna</option>';

            let CURRENCY_COUNT = x.length;
            callback(op, CURRENCY_COUNT);
        });
    }

    static getMoney(mena, druhamena, callback, date) {
        API.getResponse(function (response) {
            let select = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', mena.toUpperCase())[0];
            let count;
            let success;
            let two_count;

            if (typeof select === "undefined") {
                success = false
            } else {
                if(mena !== 'CZK' && druhamena === 'CZK') {
                    count = select.getAttribute('kurz').replace(",", ".");
                    two_count = '1';
                } else if(mena === 'CZK' && druhamena !== 'CZK') {
                    two_count = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', druhamena.toUpperCase())[0].getAttribute('kurz').replace(",", ".");
                    count = '1';
                } else if(mena === 'CZK' && druhamena === 'CZK') {
                    count = '1';
                    two_count = '1';
                } else  {
                    count = select.getAttribute('kurz').replace(",", ".");
                    two_count = XMLParse.getElementByAttribute(response.responseXML, 'radek', 'kod', druhamena.toUpperCase())[0].getAttribute('kurz').replace(",", ".");
                }

                success = true;
            }

            callback(count, two_count, success);
        }, date);
    }
}
