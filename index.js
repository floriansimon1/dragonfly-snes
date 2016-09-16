"use strict";

/*
* Driver for a SNES controller I bought from Amazon from a
* seller called Kabalo, aka Headphone Centre Ltd.
*
* lsusb lists the device as "Dragonfly USB"
*
* Product ID: 17
* Vendor  ID: 121
*/

const HID          = require("node-hid");
const EventEmitter = require("events");

const keyPath = (byte, value, shift) => ({ byte, value, shift });

const keys = {
    LEFT:    keyPath(3, 0, 4),
    UP:      keyPath(4, 0, 4),
    Y:       keyPath(5, 128),
    RIGHT:   keyPath(3, 255),
    DOWN:    keyPath(4, 255),
    SELECT:  keyPath(6, 16),
    START:   keyPath(6, 32),
    A:       keyPath(5, 32),
    B:       keyPath(5, 64),
    X:       keyPath(5, 16),
    LT:      keyPath(6, 1),
    RT:      keyPath(6, 2)
};

const keyNames = Object.keys(keys);

/*
* Path is retrieved by calling Controller.list().
*
* Note: this is a constructor that does not
* require the use of the "new" operator, that
* can be called as a factory.
*/
let Controller = function (path) {
    let self = Object.create(Controller.prototype);

    self.private = {};

    if (!Controller.list().find(device => device.path === path)) {
        throw Controller.InvalidDeviceError;
    }

    self.private.device = new HID.HID(path);

    self.keysPressed = keyNames.reduce((keyName, keysPressed) => {
        keysPressed[keyName] = false;
    }, {});

    self.private.device.on("data", data => {
        keyNames.forEach(keyName => {
            const keyPath = keys[keyName];

            /*
            * Two methods for detecting presses: when we have a shift,
            * it is simply an equality check after a right bitshift.
            * Otherwise, it's a bitmask test against a specific constant.
            */
            const pressed = (
                keyPath.shift
                ? (data[keyPath.byte] >> keyPath.shift) === keyPath.value
                : (data[keyPath.byte] & keyPath.value) === keyPath.value
            );

            if (self.keysPressed[keyName] !== pressed) {
                self.emit(`key${pressed ? "down" : "up"}`, keyName);
            }

            self.keysPressed[keyName] = pressed;
        });
    });

    return self;
};

Controller.InvalidDeviceError = {};

// Returns a list of SNES controller device paths to pass to the Controller constructor.
Controller.list = () => (
    HID
    .devices()
    .filter(device => device.vendorId === 121 && device.productId === 17)
    .map(device => device.path)
);

Controller.prototype.close = function () {
    this.private.device.close();
};

Controller.close = controller => {
    controller.close();
};

module.exports = Controller;
