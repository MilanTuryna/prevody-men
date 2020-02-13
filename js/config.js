export const config = {
    REQUEST: {
        classic: `https://yacdn.org/serve/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml`,
        backup: `https://api.codetabs.com/v1/proxy?quest=https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml`,
        with_date: `https://yacdn.org/proxy/https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml?date=`
    },
    UI: {
        show: 'blind',
        fade: 'slow',
        tooltip_slow: {
            delay: {
                show: 1000,
                hide: 0
            }
        },
        themes: {
            dark: {
                "background": '#364031'
            },
            light: ''
        }
    }, CURRENCY: {
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
        'GBP' : 'Britská libra'
    }
};
