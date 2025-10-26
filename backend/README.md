# Omnia — Avatar Backend (avatar-backend)

Small Node.js backend used as a proof-of-concept for a conversational avatar service.
It converts generated assistant text into speech (ElevenLabs), creates a lipsync transcript
using Rhubarb Lip Sync, and returns a JSON response with audio (base64) and lipsync data.

This repository is a focused backend used for earlier/integration work and demonstrates:

- integration with Google Gemini (via @google/genai)
- ElevenLabs text-to-speech
- ffmpeg audio conversion
- Rhubarb Lip Sync for phonetic/lipsync transcripts

## Contents

- `index.js` — main Express app with `/voices` and `/chat` endpoints
- `audios/` — generated audio files and JSON transcripts (example files included)
- `bin/rhubarb` — Rhubarb Lip Sync executable used to produce lipsync JSON

## Quick facts

- Package: `avatar-backend` (see `package.json`)
- Node: project uses ES modules (`type: "module"`) and expects Node.js >=14+ (recommend LTS)
- Scripts:
  - `yarn start` — run `node index.js`

## Requirements

- ffmpeg installed and available on PATH (used to convert mp3 -> wav)
- `bin/rhubarb` must be executable (platform-specific binary included in `bin/`)
- Environment variables (see `.env` or set in your environment):
  - `GEMINI_API_KEY` — Google GenAI / Gemini API key
  - `ELEVEN_LABS_API_KEY` — ElevenLabs API key

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
yarn
```

3. Ensure `ffmpeg` is installed and usable from your shell. On macOS with Homebrew:

```bash
brew install ffmpeg
```

4. Make sure `bin/rhubarb` is executable:

```bash
chmod +x ./bin/rhubarb
```

5. Provide a `.env` file in the project root with:

```
GEMINI_API_KEY=your_gemini_api_key
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
```

## Usage

Start the server (production):

```bash
yarn start
```

## Available endpoints

- GET `/` — health check, returns "Hello World!"
- GET `/voices` — returns available voices from ElevenLabs (proxy to their API)
- POST `/chat` — main endpoint: send a message, backend will ask Gemini to generate a JSON array
  of messages, convert each message to speech, produce lipsync JSON and return the messages
  with `audio` (base64) and `lipsync` (JSON) attached.

POST `/chat` example request

JSON body:

```json
{ "message": "Hello" }
```

Example response shape (abbreviated):

```json
{
  "messages": [
    {
      "text": "Welcome...",
      "facial_expression": "smile",
      "animation": "Talking_0",
      "audio": "<base64-mp3-data>",
      "lipsync": {
        /* rhubarb JSON transcript */
      }
    }
  ]
}
```

## Notes & behavior

- The server currently contains helper logic to detect name mentions and incomes in the incoming
  message and adapts the prompt sent to Gemini accordingly.
- Audio files are temporarily stored under `audios/` as `message_0.mp3`, `message_0.wav`,
  `message_0.json` (rhubarb output), etc. The app encodes the mp3 file into base64 to return
  over the API.
- If your `bin/rhubarb` is not supported on your OS/architecture, you must replace it with a
  compiled binary for your platform or build Rhubarb locally.

## Troubleshooting

- If `ffmpeg` errors appear, ensure the binary is installed and in PATH.
- If `bin/rhubarb` fails with permission errors, run `chmod +x ./bin/rhubarb`.
- For ElevenLabs / Gemini authentication errors, verify your API keys and that they have
  correct permissions and quota.
