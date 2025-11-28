# 🩸 ReadMyBlood - SmartLab

## 📋 Project Overview

**ReadMyBlood** is a functional prototype Single Page Application (SPA) designed to democratize health data interpretation. Built with the "iLovePDF-style" bootstrapper's MVP approach, it operates as a **stateless, pass-through tool** that processes medical reports entirely in the browser without requiring databases, authentication, or cloud storage.

### Core Value Proposition

This application bridges the gap between complex medical lab reports and patient understanding by:
- **Ingesting** medical files (PDF/Images) via an intuitive drag-and-drop interface
- **Processing** data with simulated AI analysis (ready for Gemini 1.5 Flash integration)
- **Visualizing** results in a clean, printable Smart Report
- **Exporting** analyzed data as a formatted PDF

### Workflow

```
User Uploads → Browser Processes → Display Report → Download PDF → Data Vanishes
```

No data is stored. Everything happens client-side.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (utility-first, responsive design)
- **Icons**: Lucide React (lightweight, beautiful icons)
- **PDF Generation**: Browser's native `window.print()` with CSS print media queries
- **AI Engine**: Ready for Gemini 1.5 Flash integration (currently using mock data)

---

## 🎨 Features

### 1. **Hero/Upload Section**
- Large, bold title with clear value proposition
- Massive red action button with hover effects
- "FREE" badge for added appeal
- Drag-and-drop support (visual feedback)
- No signup required

### 2. **Processing Animation**
- Google-style loading spinner
- Status messages showing: "Reading biomarkers • Normalizing units • Detecting anomalies"
- 3-second simulated delay (matches typical API response time)

### 3. **Smart Report**
- **Health Score** (0-100 metric) with color-coded display
- **Executive Summary** with natural language AI insights
- **Biomarker Table** showing:
  - Test name
  - Result value + unit
  - Reference range
  - Status badge (Normal, Low, High)
  - Specific health insights
- Professional print-ready layout
- Medical disclaimer footer

### 4. **Export/Download**
- One-click download via browser print dialog
- Optimized print styles (no headers/footers from web view)
- Clean, professional PDF output

---

## 📁 Project Structure

```
readmyblood/
├── app/
│   ├── page.tsx          # Main SmartLab component
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Global styles + print CSS
│   └── favicon.ico       # App icon
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind configuration
└── next.config.ts        # Next.js configuration
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Quick Start

1. **Navigate to the project directory**:
   ```bash
   cd C:\Users\Operator\.gemini\antigravity\scratch\readmyblood
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## 🎯 Usage

### Demo Mode
Click the **"Or Try Demo Report →"** button on the homepage to see a sample blood test analysis without uploading a file.

### Real Usage (When AI is integrated)
1. Click **"Select PDF file"** or drag a medical report onto the button
2. Wait 3 seconds for processing
3. Review your Smart Report with health insights
4. Click **"Download Report"** to save as PDF
5. Click **"Analyze another"** to start over

---

## 🔮 Future Enhancements

### Phase 1: AI Integration
- [ ] Connect to Gemini 1.5 Flash API
- [ ] Implement `/api/analyze` route in Next.js
- [ ] Add PDF parsing with vision model
- [ ] Extract biomarker data from images

### Phase 2: Enhanced Features
- [ ] Support for multiple report formats
- [ ] Trend analysis across multiple uploads
- [ ] Health recommendations based on results
- [ ] Shareable links (with temporary storage)

### Phase 3: Premium Features
- [ ] User accounts (optional)
- [ ] Report history
- [ ] Doctor consultation integration
- [ ] Personalized health insights

---

## 🎨 Design Philosophy

### iLovePDF-Style Approach
- **Bold, clear actions**: Large buttons that scream "click me"
- **Minimal friction**: No signup, no config, just upload and go
- **Professional output**: Print-ready reports that look legitimate
- **Privacy-first**: No data storage, all processing client-side

### Visual Design
- Clean slate/white color scheme
- Red accent color for primary actions
- Green/amber/red status indicators
- Responsive design (mobile-first)
- Smooth animations and transitions

---

## 📊 Mock Data Structure

The app currently uses mock data to simulate AI responses:

```typescript
{
  summary: string,           // AI-generated health summary
  score: number,            // Health score (0-100)
  critical_items: number,   // Count of concerning markers
  results: [
    {
      name: string,         // Biomarker name
      value: string,        // Test result
      unit: string,         // Measurement unit
      status: 'normal' | 'low' | 'high',
      range: string,        // Reference range
      insight: string       // Specific health insight
    }
  ]
}
```

---

## 🔒 Privacy & Security

- **No data storage**: All processing happens in browser memory
- **No server uploads**: Files are processed client-side
- **HIPAA-ready**: No PHI leaves the user's device
- **Stateless**: Each session is independent

---

## 📝 License

This is a functional prototype for demonstration purposes.

---

## 🙋 Support

For questions or issues, please refer to the main Antigravity documentation.

---

**Built with ❤️ using Google Antigravity** | **Powered by Next.js & Tailwind CSS**
