import { BasePlugin } from 'vatom-spaces-plugins'

/**
 * Vatom Moves Plugin
 * Add life to the metaverse with this expansive avatar animations plugin!
 * @license MIT
 * @author Leone Amurri
 */
export default class MyPlugin extends BasePlugin {

  static id = "vatom-moves-plugin"
  static name = "Vatom Moves Plugin"
  static description = "Add life to the metaverse with this expansive avatar animations plugin!"

  // Animation mapping: keys are base names (without the "humanoid." prefix)
  animationMapping = {
    "wave":         { friendly: "Wave", loop: false },
    "thumbsup":     { friendly: "Yes", loop: false },
    "thumbsdown":   { friendly: "No", loop: false },
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

  popupID = null;

  onLoad() {
    // Register the updated animations asset.
    this.objects.registerAnimations(this.paths.absolute('masteranimsv2.glb'));

    // Register the menu button labeled "Animations" with the runtime icon.
    this.menus.register({
      icon: this.paths.absolute('movesthumbnail.png'),
      text: 'Animations',
      action: () => this.showRadialMenu()
    });

    // Listen for key down events using the Spaces hooks.
    this.hooks.addHandler('controls.key.down', this.onKeyDown.bind(this));
  }

  onKeyDown(evt) {
    const movementKeys = [
      'KeyW', 'KeyA', 'KeyS', 'KeyD',
      'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'
    ];
    if (evt.code === 'Escape') {
      if (this.popupID) {
        this.menus.closePopup(this.popupID);
        this.popupID = null;
      }
      return;
    }
    if (movementKeys.includes(evt.code)) {
      if (this.popupID) {
        this.menus.closePopup(this.popupID);
        this.popupID = null;
      }
      this.menus.returnFocus();
      this.user.overrideAvatarAnimation(null).catch(() => {});
      return;
    }
    if (evt.code === 'KeyR') {
      if (this.popupID) {
        this.menus.closePopup(this.popupID);
        this.popupID = null;
      }
      this.showRadialMenu(0);
    }
    if (evt.code === 'KeyG') {
      if (this.popupID) {
        this.menus.closePopup(this.popupID);
        this.popupID = null;
      }
      this.showRadialMenu(1);
    }
    if (evt.code === 'KeyB') {
      if (this.popupID) {
        this.menus.closePopup(this.popupID);
        this.popupID = null;
      }
      this.showRadialMenu(2);
    }
  }

  async showRadialMenu(desiredCategory = null) {
    let radialURL = this.paths.absolute('ui/radial.html');
    if (desiredCategory !== null) {
      radialURL += "?cat=" + desiredCategory;
    }
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
        cancel_mode: 'immediate',
        fixed_movement: { x: 0, y: 0, z: 0 }
      }).catch(() => {});
    } else {
      this.user.overrideAvatarAnimation({
        animation: animationKey,
        loop: false,
        cancel_mode: 'immediate',
        fixed_movement: { x: 0, y: 0, z: 0 }
      }).then(finished => {
        if (finished) {
          this.user.overrideAvatarAnimation(null).catch(() => {});
        }
      }).catch(() => {});
    }
  }
}
