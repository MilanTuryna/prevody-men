const config = {
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
        }
    }
};
