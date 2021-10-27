import { Color } from "../game/color.js";
import MenuButton from "./menuButton.js";
export default class ButtonArcade extends MenuButton {
    getTextCenterPosition() {
        return { x: 1.5, y: 1.5 };
    }
    getColor() {
        return Color.RED;
    }
    onClick() {
    }
    getText() {
        return "Arcade";
    }
    getShape() {
        return [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 0 },
        ];
    }
}
//# sourceMappingURL=buttonArcade.js.map