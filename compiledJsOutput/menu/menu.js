import Effect from "../effect/effect.js";
import InputHandler, { KeyBindings } from "../game/inputHandler.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
export default class Menu {
    constructor() {
        this.buttons = [];
        this._currentButtonIndex = 0;
        this._currentButton = this.buttons[this._currentButtonIndex];
        Menu.instance = this;
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1)
        ];
    }
    get currentButton() {
        return this._currentButton;
    }
    get currentButtonIndex() {
        return this._currentButtonIndex;
    }
    static getMenu() {
        if (Menu.instance == null)
            new Menu();
        return Menu.instance;
    }
    produceButtonMoveEffect() {
        this.buttonMoveEffect = new Effect(20);
    }
    update(delta) {
        for (const button of this.buttons) {
            button.update(delta);
        }
        const previousIndex = this._currentButtonIndex;
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_DOWN)) {
            if (this._currentButtonIndex < this.buttons.length - 1) {
                this._currentButtonIndex++;
                this.buttons.forEach(button => button.calculateYShift(previousIndex, this._currentButtonIndex));
                this.produceButtonMoveEffect();
            }
            this.updateCurrentButton();
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_UP)) {
            if (this._currentButtonIndex > 0) {
                this._currentButtonIndex--;
                this.buttons.forEach(button => button.calculateYShift(previousIndex, this._currentButtonIndex));
                this.produceButtonMoveEffect();
            }
            this.updateCurrentButton();
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_CLICK)) {
            this._currentButton.onClick();
        }
    }
    updateCurrentButton() {
        this._currentButton = this.buttons[this._currentButtonIndex];
    }
    draw(context) {
        for (const button of this.buttons) {
            button.draw(context);
        }
    }
}
Menu.instance = null;
//# sourceMappingURL=menu.js.map