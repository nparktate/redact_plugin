# After Effects Redact Text Script

This script for Adobe After Effects automates the process of redacting text by creating a shape layer with customizable properties that covers the selected text layer. The script also supports various redaction styles, including Basic, Brush, Marker, and Strikethrough.

## Features

- Automatic creation of a shape layer that covers the selected text layer.
- Dockable UI with a dropdown menu to select redaction styles.
- Customizable vertical scale, rounded corners radius, and additional effects based on the selected redaction style.
- Support for various redaction styles: Basic, Brush, Marker, and Strikethrough.
- CC Line Sweep effect applied for the redact animation.
- Parenting the shape layer to the text layer for easier manipulation.

## Installation

1. Download the script file `RedactTextScript.jsx`.
2. Place the script file in the `Scripts` folder of your After Effects installation directory:
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts`
   - macOS: `/Applications/Adobe After Effects <version>/Scripts`
3. Restart After Effects if it's already open.

## Usage

1. Open After Effects and load the project you want to work with.
2. In the After Effects menu, go to `Window` > `RedactTextScript.jsx` to open the script panel.
3. Select a text layer in your composition that you want to redact.
4. Choose a redaction style from the dropdown menu in the script panel.
5. Click the `Apply` button to apply the redaction effect to the selected text layer.
6. You can customize the shape layer properties, such as vertical scale, rounded corners radius, and additional effects, using the effect controls panel.

## Customization

You can further customize the redacted effect by modifying the properties and expressions of the shape layer or by adding your own effects to the script.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
