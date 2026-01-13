---
title: "Clearing an APEX Popup LOV Value Using the Keyboard"
date: 2020-02-06
author: "Jon Dixon"
tags: ["APEX", "JavaScript", "Dynamic Actions", "Popup LOV", "User Experience"]
summary: "How to enable keyboard-based clearing of Popup LOV values in Oracle APEX 19.2+ using Dynamic Actions for improved data entry efficiency."
---

## Introduction

The Popup LOV feature introduced in APEX 19.2 has a notable limitation: users cannot quickly clear values via keyboard. While setting a "NULL value Display" in the LOV configuration offers a workaround, high-volume data entry applications require faster interactions. This post explores using a Dynamic Action to enable clearing values with the Delete key.

## The Problem

When users select a Popup LOV value and want to clear it without reaching for the mouse, standard keyboard shortcuts fail:

- **Delete**: Doesn't clear the field
- **Shift+Delete**: No effect
- **Ctrl+Delete**: No effect
- **Spacebar**: Reopens the LOV instead of clearing

Setting a "NULL Value Display" label creates user confusion rather than solving the problem elegantly.

## The Solution

Use a Dynamic Action that monitors keyboard input. When the user presses Delete or Backspace while focused on the target field, the action sets the value to NULL.

### Dynamic Action Configuration

**Event Settings:**
- Event: Key Down
- Selection Type: Item(s)
- Item: P2_POPUP_LOV (your Popup LOV item)

**Client-side Condition:**
- Type: JavaScript expression
- JavaScript Expression:

```javascript
this.browserEvent.keyCode === 46 || this.browserEvent.keyCode === 8
```

This checks for keycode 46 (Delete) or keycode 8 (Backspace).

**True Action:**
- Action: Set Value
- Set Type: Static Assignment
- Value: (leave empty)
- Affected Elements: P2_POPUP_LOV

## How It Works

1. User focuses on the Popup LOV field
2. User presses Delete or Backspace
3. Dynamic Action fires and checks the keycode
4. If keycode matches, the field value is cleared
5. User can continue typing or select a new value

## Alternative: Double-Click to Clear

An alternative approach uses the Double Click event:

**Event Settings:**
- Event: Double Click
- Selection Type: Item(s)
- Item: P2_POPUP_LOV

**True Action:**
- Action: Set Value
- Set Type: Static Assignment
- Value: (leave empty)

## Finding JavaScript Keycodes

Need to find other keycodes? Visit [keycode.info](https://keycode.info/) - it displays key identifiers in real time as you press them.

## When to Use This Approach

This technique is best suited for:

- High-volume data entry applications
- Users who prefer keyboard navigation
- Applications where mouse interaction slows down workflows

## Conclusion

While "not recommended normally" due to existing workarounds, this approach proves valuable when keyboard-driven data entry becomes a critical application requirement. The implementation balances user experience with development simplicity.

## Author

Jon Dixon, Co-Founder JMJ Cloud
