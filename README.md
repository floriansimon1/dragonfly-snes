# dragonfly-snes

*Driver for cheap DragonFly USB SNES controllers.*

# Does it work with my USB controller?

Try:

`$ lsusb`

If you see a mention for `Dragonfly USB` and your controller is a SNES controller, then this will most likely
work. The nice thing about this library is that you can adapt it very easily to make it work with your
own controller type by changing the key mappings or the vendor/product info in the single source file.

This is meant to work with controllers that satisfy the following requirements:
- Product ID: 17
- Vendor  ID: 121

## Dependencies

The only dependency for this module are `node-hid` and `EventEmitter`. To compile this binary module
under linux, you will probably need to install a package which is named `libusb-1.0-0-dev` in Debian/Ubuntu.

## Plaforms

So far, this library has been successfully tested on a Raspberry Pi 3 and on a Linux laptop.

## Usage

### Listing available controllers

```javascript
const Controller = require('dragonfly-snes');

Controller.list();
```

### "Opening" controllers

```javascript
const Controller = require('dragonfly-snes');

const controller = new Controller(Controller.list()[0]);

// Or...
const controller = Controller(Controller.list()[0]);

// Or...
const controllers = Controller.list().map(Controller);
```

### Reading buttons states

```javascript
const Controller = require('dragonfly-snes');

let controller = new Controller(Controller.list()[0]);

/*
* Valid key names:
* - LEFT
* - UP
* - Y
* - RIGHT
* - DOWN
* - SELECT
* - START
* - A
* - B
* - X
* - LT
* - RT
*
* The content of this is a boolean.
*/
controller.keysPressed.SELECT;
```

### Events

```javascript
const Controller = require('dragonfly-snes');

let controller = new Controller(Controller.list()[0]);

/*
* Two event types get triggered: keydown and keyup.
* These events are only triggered once, which means
* that you cannot get two keydown events for a given
* key if there is no keyup event for that key in
* between.
*/
controller.on("keydown", key => {
    // Displays the key name as documented above.
    console.log(key);
})
```

### Closing controllers

```javascript
const Controller = require('dragonfly-snes');

let controller = new Controller(Controller.list()[0]);

controller.close();

// Or...

Controller.close(controller);
```
