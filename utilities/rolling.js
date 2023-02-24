/**
 * @typedef {Object} Character
 * @property {String} name The name
 * @property {String} series chibi, manga, anime, etc...
 * @property {String} source url
 * @property {Number} rarity
 */

const gacha = require("simple-gacha");
const characters = require("./characters.json");
const startDash = require('../banners/StartDash.json');
const Rigged = require(`../banners/Rigged.json`);
// ADD NEW BANNERS HERE

class Rolling {
    constructor() {
        this.rolled = [];
        this.lastReset = new Date();
        this.series = {
            "starter": startDash,
            "rigged": Rigged
        };
        this.banners = {
            "starter": "https://cdn.discordapp.com/attachments/607063189254963220/930110222758993971/WT_Starter_Banner_2.jpg",
            "rigged": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.iRvSqJsHSK1nz4XtS_DZAAHaEG%26pid%3DApi&f=1&ipt=ad5d7a83ea69d1afc91bc6eda28543ae5ce03840b067350dc9e6722c010c76a0&ipo=images"
        };
    }
    getBanner(banner) {
        if (this.banners[banner] == null)
            return null;
        return this.banners[banner];
    }
    roll(banner) {
        if (this.series[banner] == null)
            return null;
        return gacha.simple(this.series[banner]);
    }
    getCharacter(id) {
        return characters[id];
    }
}
module.exports = Rolling;