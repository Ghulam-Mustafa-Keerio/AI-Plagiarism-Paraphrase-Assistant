# AI Plagiarism & Paraphrase Assistant

## Overview
The **AI Plagiarism & Paraphrase Assistant** is a full-stack web application designed to help users ensure academic integrity. It leverages the **Google Gemini API** to detect potential sources of text using real-time search grounding and to generate high-quality, formally toned paraphrases.

## Features

### 1. Source Detection
*   **Engine**: Gemini 2.5 Flash with Google Search Grounding.
*   **Functionality**: Analyzes input text to identify likely origins, estimating the author and publication source.
*   **Output**:
    *   Confidence Score (0-100%).
    *   Source Summary & Author Estimate.
    *   **Grounding URLs**: Direct links to the sources found during the search.

### 2. Academic Paraphrasing
*   **Engine**: Gemini 2.5 Flash.
*   **Functionality**: Rewrites text using a "Semantic-Preserving Transformation" methodology.
*   **Key Constraints**:
    *   Maintains strict formal/academic tone.
    *   Preserves proper nouns, dates, and technical terms.
    *   Prevents "robotic" transitions.
*   **Output**:
    *   Side-by-side comparison of Original vs. Paraphrased text.
    *   Semantic Fidelity Score.
    *   Transformation Strategy summary.
    *   **Editable Output**: Users can manually refine the generated text.

## Tech Stack

*   **Frontend**: Native HTML5, CSS3 (Inlined for performance), and Vanilla JavaScript.
*   **Backend**: Node.js with Express.
*   **AI Integration**: `@google/genai` SDK (Google Gemini API).
*   **Models Used**: `gemini-2.5-flash` (Optimized for low latency).

## Project Structure

```text
.
├── index.html       # Main frontend UI (Layout, Styles, Logic)
├── server.js        # Backend API endpoints (/api/detect-source, /api/paraphrase)
├── package.json     # Dependencies and scripts
├── metadata.json    # Application metadata
└── README.md        # Project documentation
```

## Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   A Google Cloud API Key with access to the Gemini API.

### Steps

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    You must provide your Google Gemini API key. You can do this by setting an environment variable in your terminal:

    **Mac/Linux:**
    ```bash
    export API_KEY="your_actual_api_key_here"
    ```

    **Windows (PowerShell):**
    ```powershell
    $env:API_KEY="your_actual_api_key_here"
    ```

3.  **Run the Server**
    ```bash
    npm start
    ```

4.  **Access the App**
    Open your browser and navigate to:
    `http://localhost:3000`

## API Endpoints

### `POST /api/detect-source`
*   **Input**: `{ "text": "string" }`
*   **Process**: Uses Gemini with the `googleSearch` tool to find sources.
*   **Returns**: JSON containing source summary, author estimate, confidence score, and a list of grounding URLs.

### `POST /api/paraphrase`
*   **Input**: `{ "text": "string" }`
*   **Process**: Uses Gemini with a specialized system instruction for academic rewriting.
*   **Returns**: JSON containing the original text, paraphrased text, similarity score, and transformation summary.
