module.exports = class Participant {
    constructor(id) {
        this.bailedOut = false;
        this.id = id;
    }
    bailOut() {
        this.bailedOut = true;
    }
}