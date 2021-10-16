/**
 * Handles user inputs
 */
export default class InputHandler {

    private static instance: InputHandler;

    private justPressedBindings: KeyBinding[] = [];
    private justReleasedBindings: KeyBinding[] = [];
    private activeBindings: KeyBinding[] = [];

    private constructor() {}

    public static getHandler(): InputHandler {
        if(this.instance == null) this.instance = new InputHandler();
        return this.instance;
    }

    public registerListeners() {
        document.addEventListener('keydown', (event) => this.onKeyPress(event));
        document.addEventListener('keyup', (event) => this.onKeyRelease(event));
    }

    public clearCurrentFrameBindings() {
        this.justPressedBindings = [];
        this.justReleasedBindings = [];
    }

    private onKeyPress(event: KeyboardEvent) {
        if(!event.repeat) {
            for(const binding of KeyBindings.getBindingsByKeyCode(event.code)) {
                this.justPressedBindings.push(binding);
                
                this.activeBindings.push(binding);
            }
        }
    }

    private onKeyRelease(event: KeyboardEvent) {
        for(const binding of KeyBindings.getBindingsByKeyCode(event.code)) {
            this.justReleasedBindings.push(binding);
        }
        this.activeBindings.filter(binding => !binding.isMapped(event.code));
    }

    /**
     * Checks whether one of the keys that are related to the current binding have been just pressed
     */
    public isKeyBindingPressed(binding: KeyBinding): boolean {
        return this.justPressedBindings.includes(binding);
    }

    /**
     * Checks whether one of the keys that are related to the current binding have been just released
     */
    public isKeyBindingReleased(binding: KeyBinding): boolean {
        return this.justReleasedBindings.includes(binding);
    }

    /**
     * Checks whether one of the keys that are related to the current binding is currently held
     */
    public isKeyBindingDown(binding: KeyBinding): boolean {
        return this.activeBindings.includes(binding);
    }

}

export class KeyBinding {
    
    private keyboardCodes: string[];

    constructor(...keyboardCodes: string[]) {
        this.keyboardCodes = keyboardCodes;
    }

    /**
     * Checks whether the given code is mapped to the current key binding
     * @param code The keyboard code to check
     */
    public isMapped(code: string): boolean {
        return this.keyboardCodes.includes(code);
    }

}

export class KeyBindings {

    private static readonly keyBindings: KeyBinding[] = [];

    public static readonly FIGURE_MOVE_RIGHT: KeyBinding = KeyBindings.register(new KeyBinding("ArrowRight", "KeyD"));
    public static readonly FIGURE_MOVE_LEFT: KeyBinding = KeyBindings.register(new KeyBinding("ArrowLeft", "KeyA"));
    public static readonly FIGURE_MOVE_DOWN: KeyBinding = KeyBindings.register(new KeyBinding("ArrowDown", "KeyS"));

    private constructor() {}

    private static register(mapping: KeyBinding): KeyBinding {
        KeyBindings.keyBindings.push(mapping);
        return mapping;
    }

    public static getBindings(): KeyBinding[] {
        return KeyBindings.keyBindings;
    }

    /**
     * Gets all key bindings that are mapped to the current key code
     * @param code Key code
     * @returns An array of key bindings that are mapped to the current key code, or an empty array if nothing found
     */
    public static getBindingsByKeyCode(code: string): KeyBinding[] {
        const mappedBindings: KeyBinding[] = []; 
        for(const binding of this.keyBindings) {
            if(binding.isMapped(code)) mappedBindings.push(binding);
        }
        return mappedBindings;
    }

}