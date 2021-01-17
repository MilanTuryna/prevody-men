export const config = {
    REQUEST: {
        classic: `https://cors-anywhere.herokuapp.com/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml`,
        backup: `https://cors-anywhere.herokuapp.com/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml`,
        with_date: `https://yacdn.org/proxy/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml?date=`,
        original: {
            xml: 'https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml',
            txt: 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt',
        }
    }, STATUSES: {
        zalozni: 'Aplikace bude pomalejší z důvodu výpadku hlavního cache serveru'
    }, UI: {
        show: 'blind',
        fade: 'slow',
        tooltip_slow: {
            delay: {
                show: 1000,
                hide: 0
            }
        }
    }, MSGS: {
        processing: 'Vypočítávám..'
    }, CURRENCY: {
        'aud': 'Australský dolar',
        'brl': 'Brazilský real',
        'bgn': 'Bulharský lev',
        'cny' : 'Čínský žen-min-pi',
        'dkk' : 'Dánská koruna',
        'eur' : 'Euro',
        'php' : 'Filipínské peso',
        'hkd' : 'Hongkongský dolar',
        'hrk' : 'Chorvatská kuna',
        'inr' : 'Indická rupie',
        'idr' : 'Indonéská rupie',
        'isk' : 'Islandská koruna',
        'ils' : 'Nový izraelský šekel',
        'jpy' : 'Japonský jen',
        'zar' : 'Jihoafrický rand',
        'cad' : 'Kanadský dolar',
        'krw' : 'Korejský won',
        'huf' : 'Maďarský forint',
        'myr' : 'Malajsijský ringgit',
        'mxn' : 'Mexické peso',
        'xdr' : 'MMF',
        'nok' : 'Norská koruna',
        'nzd' : 'Novozélandský dolar',
        'pln' : 'Polský zlotý',
        'ron' : 'Rumunské leu',
        'rub' : 'Ruský rubl',
        'sgd' : 'Singapurský dolar',
        'sek' : 'Švédská koruna',
        'chf' : 'Švýcarský frank',
        'thb' : 'Thajský baht',
        'try' : 'Turecká lira',
        'usd' : 'Americký dolar',
        'gbp' : 'Britská libra'
    }
};
