/**
 * Handles user inputs
 */
export default class InputHandler {
    constructor() {
        this.justPressedBindings = [];
        this.justReleasedBindings = [];
        this.activeBindings = [];
    }
    static getHandler() {
        if (this.instance == null)
            this.instance = new InputHandler();
        return this.instance;
    }
    registerListeners() {
        document.addEventListener('keydown', (event) => this.onKeyPress(event));
        document.addEventListener('keyup', (event) => this.onKeyRelease(event));
    }
    clearCurrentFrameBindings() {
        this.justPressedBindings = [];
        this.justReleasedBindings = [];
    }
    onKeyPress(event) {
        if (!event.repeat) {
            for (const binding of KeyBindings.getBindingsByKeyCode(event.code)) {
                this.justPressedBindings.push(binding);
                this.activeBindings.push(binding);
            }
        }
    }
    onKeyRelease(event) {
        for (const binding of KeyBindings.getBindingsByKeyCode(event.code)) {
            this.justReleasedBindings.push(binding);
        }
        this.activeBindings.filter(binding => !binding.isMapped(event.code));
    }
    /**
     * Checks whether one of the keys that are related to the current binding have been just pressed
     */
    isKeyBindingPressed(binding) {
        return this.justPressedBindings.includes(binding);
    }
    /**
     * Checks whether one of the keys that are related to the current binding have been just released
     */
    isKeyBindingReleased(binding) {
        return this.justReleasedBindings.includes(binding);
    }
    /**
     * Checks whether one of the keys that are related to the current binding is currently held
     */
    isKeyBindingDown(binding) {
        return this.activeBindings.includes(binding);
    }
}
export class KeyBinding {
    constructor(...keyboardCodes) {
        this.keyboardCodes = keyboardCodes;
    }
    /**
     * Checks whether the given code is mapped to the current key binding
     * @param code The keyboard code to check
     */
    isMapped(code) {
        return this.keyboardCodes.includes(code);
    }
}
export class KeyBindings {
    constructor() { }
    static register(mapping) {
        KeyBindings.keyBindings.push(mapping);
        return mapping;
    }
    static getBindings() {
        return KeyBindings.keyBindings;
    }
    /**
     * Gets all key bindings that are mapped to the current key code
     * @param code Key code
     * @returns An array of key bindings that are mapped to the current key code, or an empty array if nothing found
     */
    static getBindingsByKeyCode(code) {
        const mappedBindings = [];
        for (const binding of this.keyBindings) {
            if (binding.isMapped(code))
                mappedBindings.push(binding);
        }
        return mappedBindings;
    }
}
KeyBindings.keyBindings = [];
KeyBindings.FIGURE_MOVE_RIGHT = KeyBindings.register(new KeyBinding("ArrowRight", "KeyD"));
KeyBindings.FIGURE_MOVE_LEFT = KeyBindings.register(new KeyBinding("ArrowLeft", "KeyA"));
KeyBindings.FIGURE_MOVE_DOWN = KeyBindings.register(new KeyBinding("ArrowDown", "KeyS"));
//# sourceMappingURL=input_handler.js.map