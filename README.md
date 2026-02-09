# Human Friendly Colours

[Try it](https://a-lothian.github.io/Human-Friendly-Colours/)

Have you ever tried to communicate colour values through speech?

"_#47998a_"

Or maybe RGB?

"_71, 153, 138_"

What is that, **seventeen** syllables? You can't even remember the hex colour, and that was 3 lines ago. How about:

"_Fine Deep Glacier_"

Yeah. Much better. It's memorable, and it rolls off the tounge. **That's what this project's about.**

Human Friendly Colours is a static web tool that turns 16-bit colors into descriptive phrases, and back again. Instead of picking only by hex or RGB, you can use human-readable names and get a deterministic color value every time.

## Concept

The project introduces a **Colour Phrase** format with three parts:

1. `Brightness` word (16 levels)
2. `Saturation` word (16 levels)
3. `Hue` word (256 options)

Example phrase:

`Radiant Rich Ocean`

Each word maps to an index, and that index maps to quantized HSV values:

- Hue: `0-255`
- Saturation: `0-15`
- Value (brightness): `0-15`

Those HSV values are then converted to RGB and Hex for display.
