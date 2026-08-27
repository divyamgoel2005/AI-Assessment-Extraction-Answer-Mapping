# ⚡ VedaAI — AI Answer Sheet Extraction & Auto-Grading Platform

> **Automated Question-Answer Extraction, Handwriting OCR, Spatial Answer Sheet Highlighting, and Step-by-Step Pedagogical Grading powered by 100% Groq LPUs.**

---

## 🌟 Key Features

- ⚡ **100% Pure Groq AI Architecture**:
  - **Vision OCR (`qwen/qwen3.8-27b`)**: Ingests raw Question Papers & Handwritten Answer Sheets; extracts printed questions, diagrams, and handwriting in **~3.5 seconds**.
  - **Deep Pedagogical Grading (`openai/gpt-oss-120b`)**: Evaluates answers against CBSE marking rubrics, assigns marks, and provides constructive teacher feedback.
- 🎯 **Left-Margin Spatial Question Detection**:
  - Automatically identifies handwritten question numbers (`Q.24 (b)(i)`, `Q.25`, `Q.27 (a)`) in the left margin.
  - Dynamically calculates **start-to-start continuous bounding boxes** with zero overlap.
- 🎨 **Interactive Dual-Pane Workspace**:
  - **Left Panel**: Question cards with status badges (`Correct`, `Partial`, `Incorrect`, `Unanswered`), scores, and AI feedback.
  - **Right Panel**: High-resolution answer sheet viewer with zoom, pan, page navigation, and **light-green highlight overlays** for active questions.
- 🚀 **Client-Side High-Res Image Compression**:
  - Automatic Canvas-based pre-processing optimizes multi-megabyte user uploads into crisp web-optimized payloads for instant processing.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS with Helvetica/Arial Bold typography
- **AI Models**:
  - Vision: `qwen/qwen3.8-27b` on [Groq Cloud](https://groq.com/)
  - Reasoning & Scoring: `openai/gpt-oss-120b` on Groq Cloud
- **Icons & UI**: [Lucide React](https://lucide.dev/)
- **Document Processing**: `pdfjs-dist` & HTML5 Canvas

---

## 🚀 Quick Start & Deployment

### 1. Clone the repository
```bash
git clone https://github.com/divyamgoel2005/AI-Assessment-Extraction-Answer-Mapping.git
cd AI-Assessment-Extraction-Answer-Mapping
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory (and add it to Vercel Environment Variables):
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Add the Environment Variable in Vercel Project Settings:
   - `GROQ_API_KEY`: Your Groq API Key
3. Deploy! Vercel automatically runs `npm run build` and serves the app globally.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
