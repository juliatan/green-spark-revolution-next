import { Scene } from "phaser";

type KeyState = {
  key: string | null;
  time: number; // Timestamp of the key press
};

type KeyGroupConfig = {
  name: string; // Group name, e.g., "directionX"
  keys: string[]; // List of keys in the group
};

export class InputManager {
  private keyStates: Record<string, KeyState>; // Tracks states for each key group
  private keyBindings: Record<string, Phaser.Input.Keyboard.Key>; // Maps keys to Phaser keys
  private keyGroups: KeyGroupConfig[];

  constructor(private scene: Scene) {
    // Define all key groups here
    this.keyGroups = [
      { name: "directionX", keys: ["ArrowLeft", "ArrowRight"] },
      { name: "directionY", keys: ["ArrowUp", "ArrowDown"] },
      { name: "action", keys: ["A", "Q"] },
    ];

    this.keyStates = {};
    this.keyBindings = {};

    this.setupControls();
  }

  private setupControls(): void {
    if (!this.scene.input?.keyboard) {
      throw new Error("Keyboard input is not available");
    }

    // Initialize key states and bindings based on key groups
    this.keyGroups.forEach((group) => {
      this.keyStates[group.name] = { key: null, time: 0 };
      group.keys.forEach((key) => {
        const keyCode = Phaser.Input.Keyboard.KeyCodes[key.toUpperCase() as keyof typeof Phaser.Input.Keyboard.KeyCodes];
        if (this.scene.input.keyboard) {
          this.keyBindings[key] = this.scene.input.keyboard.addKey(keyCode);
        }
      });
    });

    // Add event listeners for key events
    this.scene.input.keyboard.on("keydown", (event: KeyboardEvent) => this.onKeyDown(event));
    this.scene.input.keyboard.on("keyup", (event: KeyboardEvent) => this.onKeyUp(event));
  }

  private onKeyDown(event: KeyboardEvent): void {
    const currentTime = Date.now();
    for (const group of this.keyGroups) {
      if (group.keys.includes(event.key)) {
        this.updateState(group.name, event.key, currentTime);
        return;
      }
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    for (const group of this.keyGroups) {
      if (group.keys.includes(event.key)) {
        this.clearState(group.name, event.key);
        return;
      }
    }
  }

  private updateState(groupName: string, key: string, time: number): void {
    const groupState = this.keyStates[groupName];
    if (!groupState.key || groupState.time < time) {
      this.keyStates[groupName] = { key, time };
    }
  }

  private clearState(groupName: string, key: string): void {
    if (this.keyStates[groupName].key === key) {
      this.keyStates[groupName] = { key: null, time: 0 };
    }
  }

  public isKeyPressed(key: string): boolean {
    for (const group of this.keyGroups) {
      if (group.keys.includes(key)) {
        return this.keyStates[group.name].key === key;
      }
    }
    return false;
  }
}
