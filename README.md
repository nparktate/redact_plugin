# After Effects Redact Text Script

This script for Adobe After Effects automates the process of redacting text by creating a shape layer with customizable properties that covers the selected text layer. The script also supports various redaction styles, including Basic, Brush, Marker, and Strikethrough.

![gif](https://user-images.githubusercontent.com/57370896/225921917-eec69f84-8be3-4875-81a3-985228ec96e1.gif)

## Features

- Automatic creation of a parented redacted line that covers the selected text layer.
- Dockable UI with a dropdown menu to select redaction styles.
- Customizable vertical scale, rounded corners radius, and additional effects based on the selected redaction style.
- Support for various redaction styles: Basic, Brush, Marker, and Strikethrough.
- Line Sweep effect applied for the redact animation.

## Installation

1. Download the script file `redact.jsx`.
2. Open After Effects. Go to `File` > `Scripts` > `Install ScriptUI Panel...` then select the `redact.jsx` file.
3. Restart After Effects.

## Usage

1. Open After Effects and load the project you want to work with.
2. In the After Effects menu, go to `Window` > `redact.jsx` to open the script panel.
3. Select a text layer in your composition that you want to redact.
4. Choose a redaction style from the dropdown menu in the script panel.
5. Click the `Apply` button to apply the redaction effect to the selected text layer.
6. You can customize the shape layer properties, such as vertical scale, rounded corners radius, and additional effects, using the effect controls panel.
7. You can click the `Hide Text` Checkbox (Used to only show the redacted line). Sets text opacity to 0%.

## Customization

You can further customize the redacted effect by modifying the properties and expressions of the shape layer or by adding your own effects to the script.

## License

[MIT](https://choosealicense.com/licenses/mit/)
