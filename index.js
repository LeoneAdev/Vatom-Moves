import { BasePlugin } from 'vatom-spaces-plugins'

/**
 * Vatom Moves Plugin
 * Add life to the metaverse with this expansive avatar animations plugin!
 * @license MIT
 */
export default class MyPlugin extends BasePlugin {

  static id = "vatom-moves-plugin"
  static name = "Vatom Moves Plugin"
  static description = "Add life to the metaverse with this expansive avatar animations plugin!"

  // Animation mapping: keys are the base names (without the "humanoid." prefix)
  animationMapping = {
    "wave":         { friendly: "Wave", loop: false },
    "thumbsup":     { friendly: "Thumbs Up", loop: false },
    "thumbsdown":   { friendly: "Thumbs Down", loop: false },
    "clapping":     { friendly: "Clap", loop: true },
    "shrug":        { friendly: "Shrug", loop: false },
    "cheer":        { friendly: "Cheer", loop: false },
    "followme":     { friendly: "Follow Me", loop: false },
    "overhere":     { friendly: "Over Here", loop: false },
    "pointstraight":{ friendly: "Point", loop: false },
    "pointleft":    { friendly: "Point Left", loop: false },
    "pointright":   { friendly: "Point Right", loop: false },
    "doublethumbs": { friendly: "Two Thumbs Up", loop: false },
    "rockon":       { friendly: "Rock On", loop: false },
    "looking":      { friendly: "Look Far", loop: false },
    "swimming":     { friendly: "Swim", loop: true },
    "backflip":     { friendly: "Flip", loop: false },
    "guitar":       { friendly: "Jam Out", loop: true },
    "hiphop":       { friendly: "Hip Hop 01", loop: true },
    "hiphop02":     { friendly: "Hip Hop 02", loop: true },
    "chickendance": { friendly: "Chicken Dance", loop: true },
    "wavedance":    { friendly: "Wave Dance", loop: true },
    "robotdance":   { friendly: "Robot", loop: true },
    "sambadance":   { friendly: "Samba", loop: true },
    "cabbagedance": { friendly: "Cabbage Patch", loop: true }
  };

  // Store popup ID so we can later close the popup.
  popupID = null;

  onLoad() {
    // Register the master animations asset.
    this.objects.registerAnimations(this.paths.absolute('masteranims.glb'));
    
    // Register a menu button labeled "Animations" to open the radial menu.
    this.menus.register({
      icon: '',
      text: 'Animations',
      action: () => this.showRadialMenu()
    });
    
    // Use the Spaces hooks API to capture keydown events.
    this.hooks.addHandler('controls.key.down', this.onKeyDown.bind(this));
  }

  onKeyDown(evt) {
    // Define movement keys.
    const movementKeys = [
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
    ];
    if (movementKeys.includes(evt.code)) {
      // Immediately return focus and cancel any active animation.
      this.menus.returnFocus();
      this.user.overrideAvatarAnimation(null).catch(() => {});
      return;
    }
    // Open the radial menu when "G" is pressed.
    if (evt.code === 'KeyG') {
      this.showRadialMenu();
    }
  }

  async showRadialMenu() {
    const radialURL = this.paths.absolute('ui/radial.html');
    this.popupID = await this.menus.displayPopup({
      title: 'Animations',
      panel: {
        iframeURL: radialURL,
        width: 500,
        height: 550
      }
    });
  }

  onMessage(data) {
    if (data && data.action === 'radialSelect' && data.option) {
      if (this.popupID) {
        this.menus.closePopup(this.popupID);
        this.popupID = null;
      }
      this.menus.returnFocus();
      this.playAnimation(data.option);
    }
  }

  playAnimation(animationKey) {
    const anim = this.animationMapping[animationKey];
    if (!anim) return;
    if (anim.loop) {
      this.user.overrideAvatarAnimation({
        animation: animationKey,
        loop: true,
        cancel_mode: 'none',
        fixed_movement: { x: 0, y: 0, z: 0 }
      }).catch(() => {});
    } else {
      this.user.overrideAvatarAnimation({
        animation: animationKey,
        loop: false,
        fixed_movement: { x: 0, y: 0, z: 0 }
      }).then(finished => {
        if (finished) {
          this.user.overrideAvatarAnimation(null).catch(() => {});
        }
      }).catch(() => {});
    }
  }
}
