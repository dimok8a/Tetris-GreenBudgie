import StateGame from "./StateGame.js";
export default class StateHandler {
    constructor() {
        this.GAME = new StateGame();
        this._currentState = this.GAME;
    }
    update(delta) {
        this._currentState.update(delta);
    }
    draw(context) {
        this._currentState.draw(context);
    }
    get currentState() {
        return this._currentState;
    }
    set currentState(state) {
        this._currentState = state;
    }
    static getHandler() {
        if (StateHandler.instance == null)
            StateHandler.instance = new StateHandler();
        return StateHandler.instance;
    }
}
StateHandler.instance = null;
//# sourceMappingURL=StateHandler.js.map