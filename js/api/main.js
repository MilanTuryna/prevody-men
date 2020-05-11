import {config} from "../config.js";
import {XMLParse} from "./xml.js";
import * as Template from "../core/templating.js";

export const API = {
    getResponse: function (callback, date, zaloha) {
        let url = config.REQUEST.classic,
            zaloha_url = config.REQUEST.backup;

        if(date) {
            url = config.REQUEST.with_date + date;
            zaloha_url += '?date=' + date;
        }

        if(zaloha) {
            url = zaloha_url;
            Template.globalReplace({
                'status': config.STATUSES.zalozni
            });
        }

        fetch(url)
            .then(response => response.text())
            .then(x => x.toLocaleLowerCase())
            .then(textResult => $.parseXML(textResult))
            .then(e => callback(e));
    }
};

export const APIParser = {
    lastTime: cb => API.getResponse(response => cb(response.getElementsByTagName('kurzy')[0].getAttribute('datum'))),
    currency: currency,
    getMoney: getMoney,
    renderKurzy: renderKurzy
};

function currency(callback) {
    API.getResponse(response => {
        let radky = response.getElementsByTagName('radek'),
            cc = config.CURRENCY,
            op = '';

        [...radky].forEach(r => {
            op += `<option data-sort="${r.getAttribute('kod').strReplace(cc)}" value="${r.getAttribute('kod')}">${r.getAttribute('kod').strReplace(cc)}</option>`
        });

        op += '<option data-sort="ceska koruna" value="CZK">Česká koruna</option>';
        callback(op, radky.length)
    })
}

function getMoney(mena, druhamena, callback, date) {
    let count, two_count, success, select, two_select;
    API.getResponse(response => {
        select = XMLParse.getElementByAttribute(response, 'radek', 'kod', mena)[0],
            two_select = XMLParse.getElementByAttribute(response, 'radek', 'kod', druhamena)[0];

        if (typeof select === "undefined" || typeof two_select === "undefined") {
            success = false;
        }  else {
            if(mena !== 'CZK' && druhamena === 'CZK') {
                count = select.getAttribute('kurz').replace(",", ".");
                two_count = '1';
            } else if(mena === 'CZK' && druhamena !== 'CZK') {
                two_count = XMLParse.getElementByAttribute(response, 'radek', 'kod', druhamena)[0]
                    .getAttribute('kurz')
                    .replace(",", ".");
                count = '1';
            } else if(mena === 'CZK' && druhamena === 'CZK') {
                two_count = '1';
                count = '1';
            } else  {
                count = select.getAttribute('kurz').replace(",", ".");
                two_count = XMLParse.getElementByAttribute(response, 'radek', 'kod', druhamena)[0]
                    .getAttribute('kurz')
                    .replace(",", ".");
            }
            success = true;
        }
        callback(count, two_count, success)
    }, date);
}

function renderKurzy() {
    API.getResponse(response => {
        let radky = response.getElementsByTagName('radek'), i,
            html = `<table class="table table-sm table-striped" id="kurzy-table" style="zoom:72%;">
                    <thead class="bg-light-green">
                    <tr>
                        <th scope="col" title="Kód měny">KÓD</th>
                        <th scope="col">MNOŽSTVÍ</th>
                        <th scope="col">KURZ</th>
                    </tr>
                    </thead><tbody>`;

        [...radky].forEach((radek) => {
            html+=`<tr data-sort="${radek.getAttribute('kod')}">` +
                `<td>${radek.getAttribute('kod')} (${radek.getAttribute('kod').strReplace(config.CURRENCY)})</td>` +
                `<td>${radek.getAttribute('mnozstvi')}</td>` +
                `<td>${radek.getAttribute('kurz')}</td>` +
                '</tr>'
        });

        let xml = config.REQUEST.original.xml;
        let txt = config.REQUEST.original.txt;

        html+= `<tr><td colspan="3" class="bg-light-green">
                          <a href="${xml}" target="_blank">XML</a> / 
                          <a href="${txt}" target="_blank">TXT</a> 
                         </td>
                    </tr></tbody></table>`;

        Template.globalReplace({
            'kurzy': html
        })
    });
}