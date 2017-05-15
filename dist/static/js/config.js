const MERGE_CONFIG = {
    ROOT_PATH : './js/import/',
    CSS_FILE : [
        'tooltipster/tooltipster.css',
        'layer/skin/default/layer.css',
        'isloading/isloading.css',
    ],
    
    JS_FILE : [
        'layer/layer.js',
        'tooltipster/tooltipster.js',
        'ua-parser/ua-parser.js',
        'isloading/isloading.js',
        'modernizr/modernizr.js',
        'tabslet/tabslet.js',
        'select2/select2.js',
        'keymaster/keymaster.js',
   ],
   POLYFILL_FILE : [
        'polyfill/es5-shim.js',
        'polyfill/es5-sham.js',
        'polyfill/html5shiv.js',
        'polyfill/respond.js',
        'polyfill/selectivizr.js',
        'polyfill/placeholder.js',
   ]
};

module.exports = MERGE_CONFIG;
