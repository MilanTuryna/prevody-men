export class XMLParse {
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
    };
}