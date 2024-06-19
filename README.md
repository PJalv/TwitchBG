# Twitch & YouTube Live Stream Checker Chrome Extension

This Chrome extension checks specified Twitch and YouTube streams for live statuses and updates a tab with a multi-stream viewer URL if any streams are live. The extension uses OAuth2 to get an access token from Twitch and stores data using Chrome's storage API.

## Features

- Checks live statuses of specified Twitch and YouTube streams.
- Updates a browser tab with a multi-stream viewer URL if any streams are live.
- Automatically retrieves and refreshes Twitch OAuth2 access tokens.
- Uses Chrome's storage API to manage settings and data.

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on the "Load unpacked" button and select the directory where you cloned/downloaded the repository.

## Usage

1. Set your Twitch client ID and client secret in the extension's storage:
   - Open the extension's options page.
   - Enter your Twitch client ID and client secret.
2. Add the usernames of the Twitch and YouTube streamers you want to monitor:
   - Open the extension's options page.
   - Enter the usernames of the streamers, one per line. For YouTube streamers, use the format `v=VIDEO_ID` Still need to figure out good way for possibly just adding YT channel handle.
3. The extension will automatically check the live statuses of the specified streamers every 17 seconds and update a tab with a multi-stream viewer URL if any streams are live.

## Code Overview

### Event Listeners

- `chrome.runtime.onStartup.addListener()`: Initializes the extension on browser startup, retrieves the access token, and starts checking streams at regular intervals.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.

## Acknowledgments

- [Twitch API](https://dev.twitch.tv/docs/api/)
- [YouTube Data API](https://developers.google.com/youtube/v3)


