# Learning-diagnostics-AI
# Early Screening of Learning Difficulties Using Typing Behavior

📌 Problem Statement
Learning disabilities often go undetected during early academic stages.  
Because early signs are subtle and formal assessments are limited, many children do not receive timely support, which can lead to long-term academic and emotional challenges.

💡 Proposed Solution
This project presents a **browser-based, AI-assisted early screening tool** that analyzes **typing behavior** to identify **early risk indicators** of learning difficulties.

Instead of focusing on *what* a child types, the system analyzes *how* the child types — such as speed, pauses, and corrections.

⚠️ **Important:**  
This system **does NOT diagnose** learning disabilities.  
It only provides **early screening indicators** and recommends professional evaluation when needed.

🧠 How the System Works

### 1. Typing Task
- The child is shown a short, simple sentence.
- The child types the sentence into a text box.

### 2. Data Captured
The system records:
- Total typing time
- Number of characters typed
- Number of backspaces (corrections)
- Number of long pauses (> 1 second)

No personal data is stored.

### 3. AI Analysis (Rule-Based)
A lightweight, rule-based AI model analyzes:
- **Typing speed**
- **Correction rate**
- **Pause frequency**

These behavioral features are compared against safe thresholds to identify potential risk indicators.

### 4. Output
The system returns:
- **Risk Level**  
  - Low Risk  
  - Mild Risk  
  - Needs Attention
- **Explainable reasons** (e.g., “Frequent pauses”, “High correction rate”)

## ⚖️ Ethical Considerations
- This tool is **not a medical or clinical diagnostic system**
- No user data is stored or shared
- Results are **screening indicators only**
- Designed to assist educators, not replace professionals
- Parental and institutional consent is assumed

## 🧩 Project Structure

## 🛠️ Technologies Used
- HTML
- JavaScript
- Browser-based execution (no backend required)

## ▶️ How to Run the Project
1. Download or clone the repository
2. Open `index.html` in any modern web browser
3. Type the given sentence
4. Click **Submit** to view the screening result

No installation or server setup is required.

## 🔮 Future Enhancements
- Add numeracy (math) screening module
- Train ML models using anonymized educational data
- Age-specific and language-specific thresholds
- Teacher dashboard for aggregated insights

## 🏁 Conclusion
This project demonstrates how **simple behavioral signals** and **explainable AI** can be used to support **early educational intervention**, while remaining ethical, transparent, and accessible.

## 📜 Disclaimer
This project is intended for **educational and research purposes only**.  
It does not provide medical or psychological diagnoses.

