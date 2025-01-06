// Write a full documentation about how works the project
# Whisper Transcription

## Overview

This project is a web application that allows users to upload a video, extract audio, transcribe the audio to text, generate subtitles, and add the subtitles back to the video. The backend is built with Node.js and Express, while the frontend is built with Vue.js.

## Technologies Used

- **Backend**: Node.js, Express, FFmpeg, Multer, Python
- **Frontend**: Vue.js, Axios
- **Other**: Fluent-FFmpeg, Cors, Child Process, File System

## Project Structure

### Backend

- `index.js`: Main server file that handles file uploads, audio extraction, transcription, and subtitle integration.
- `uploads/`: Directory where uploaded files and generated subtitles are stored.
- `transcribe.py`: Python script that uses the Whisper model to transcribe audio to text and generate SRT files.

### Frontend

- `src/App.vue`: Main Vue component that handles file upload and displays the results.
- `public/`: Directory for static assets.
- `README.md`: Instructions for setting up and running the frontend.

## Setup Instructions

### Backend

1. **Install Dependencies**:
    ```bash
    npm install express fluent-ffmpeg multer cors
    ```

2. **Run the Server**:
    ```bash
    node index.js
    ```

### Frontend

1. **Install Dependencies**:
    ```bash
    npm install
    ```

2. **Run the Development Server**:
    ```bash
    npm run serve
    ```

3. **Build for Production**:
    ```bash
    npm run build
    ```

## Usage

1. **Upload a Video**:
    - Open the frontend application.
    - Use the file input to select a video file.
    - Click the "Télécharger" button to upload the video.

2. **View Results**:
    - After the upload, the application will display links to download the generated subtitles and the subtitled video.
    - The transcription text will also be displayed.

## API Endpoints

### POST `/upload`

- **Description**: Uploads a video file, extracts audio, transcribes it, generates subtitles, and adds subtitles to the video.
- **Request**: `multipart/form-data` with a file field named `file`.
- **Response**: JSON object containing the transcription, subtitles URL, and video URL.

## Example

### Request

```bash
curl -X POST http://localhost:5000/upload -F "file=@path/to/video.mp4"
```

### Response

```json
{
  "transcription": "Transcribed text",
  "subtitlesUrl": "subtitles.srt",
  "videoUrl": "/uploads/video_subtitled.mp4"
}
```

## Troubleshooting

- **File Not Found**: Ensure the `uploads` directory exists and has the correct permissions.
- **Transcription Errors**: Check the Python script and ensure the Whisper model is correctly installed and accessible.
- **FFmpeg Errors**: Ensure FFmpeg is installed and available in the system PATH.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.