export const HTMLTag = {
    A: "a",
    ABBR: "abbr",
    ADDRESS: "address",
    AREA: "area",
    ARTICLE: "article",
    ASIDE: "aside",
    AUDIO: "audio",
    B: "b",
    BASE: "base",
    BDI: "bdi",
    BDO: "bdo",
    BIG: "big",
    BLOCKQUOTE: "blockquote",
    BODY: "body",
    BR: "br",
    BUTTON: "button",
    CANVAS: "canvas",
    CAPTION: "caption",
    CITE: "cite",
    CODE: "code",
    COL: "col",
    COLGROUP: "colgroup",
    DATA: "data",
    DATALIST: "datalist",
    DD: "dd",
    DEL: "del",
    DETAILS: "details",
    DFN: "dfn",
    DIALOG: "dialog",
    DIV: "div",
    DL: "dl",
    DT: "dt",
    EM: "em",
    EMBED: "embed",
    FIELDSET: "fieldset",
    FIGCAPTION: "figcaption",
    FIGURE: "figure",
    FOOTER: "footer",
    FORM: "form",
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    HEAD: "head",
    HEADER: "header",
    HGROUP: "hgroup",
    HR: "hr",
    HTML: "html",
    I: "i",
    IFRAME: "iframe",
    IMG: "img",
    INPUT: "input",
    INS: "ins",
    KBD: "kbd",
    LABEL: "label",
    LEGEND: "legend",
    LI: "li",
    LINK: "link",
    MAIN: "main",
    MAP: "map",
    MARK: "mark",
    META: "meta",
    METER: "meter",
    NAV: "nav",
    NOSCRIPT: "noscript",
    OBJECT: "object",
    OL: "ol",
    OPTGROUP: "optgroup",
    OPTION: "option",
    OUTPUT: "output",
    P: "p",
    PARAM: "param",
    PICTURE: "picture",
    PRE: "pre",
    PROGRESS: "progress",
    Q: "q",
    RB: "rb",
    RP: "rp",
    RT: "rt",
    RDI: "rdi",
    RUBY: "ruby",
    S: "s",
    SAMP: "samp",
    SCRIPT: "script",
    SECTION: "section",
    SELECT: "select",
    SMALL: "small",
    SOURCE: "source",
    SPAN: "span",
    STRONG: "strong",
    STYLE: "style",
    SUB: "sub",
    SUMMARY: "summary",
    SUP: "sup",
    TABLE: "table",
    TBODY: "tbody",
    TD: "td",
    TEMPLATE: "template",
    TEXTAREA: "textarea",
    TFOOT: "tfoot",
    TH: "th",
    THEAD: "thead",
    TITLE: "title",
    TR: "tr",
    TRACK: "track",
    U: "u",
    UL: "ul",
    VAR: "var",
    VIDEO: "video",
    WBR: "wbr"
};

type HTMLTagValue = typeof HTMLTag[keyof typeof HTMLTag];

export interface HTMLNode {
    tag: HTMLTagValue;
    property?: string;
    children?: (HTMLNode | string)[];
}