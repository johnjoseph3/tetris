module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "globals": {
        "_": true,
        "$": true
    }
};