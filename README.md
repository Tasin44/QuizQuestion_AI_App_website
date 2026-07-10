# Quiz Question AI 🎓🤖

An intelligent, AI-powered homework and educational companion built to help students solve problems, understand complex concepts, and write essays seamlessly. 

This project demonstrates a production-ready modern web application emphasizing responsive design, multi-language support, real-time AI capabilities, and scalable containerized deployment.

## ✨ Key Features

- **Multimodal AI Chat:** Interact with advanced AI models (GPT-4o, Claude, Gemini) using text, image, and document uploads.
- **Subject-Specific Tools:** Specialized handling for subjects like Math (with a built-in interactive calculator), Physics, Chemistry, Biology, and Literature.
- **Multi-Language Support (i18n):** Real-time UI localization allowing users to switch between **English, Arabic, Spanish, and French** seamlessly without page reloads.
- **Modern, Premium UI:** A sleek, fully responsive dark-mode interface built with custom CSS, micro-animations, and glassmorphism.
- **Persistent Chat History:** Securely saves user chat sessions, categorized automatically by subject based on the query.
- **Full Authentication System:** Secure login, registration, and user session management.
- **Dockerized Environment:** Easy local development and deployment with a configured `docker-compose` setup.

## 🛠️ Tech Stack

- **Frontend:** [Next.js (App Router)](https://nextjs.org/), React 18, TypeScript
- **Styling:** Vanilla CSS & TailwindCSS (for utility classes), Framer Motion-like custom animations
- **Data Fetching & State:** React Query (`@tanstack/react-query`)
- **Icons & Typography:** `lucide-react`, `react-icons`, Google Fonts
- **Markdown Rendering:** `react-markdown`, `remark-math`, `rehype-katex` (for beautiful math equations)
- **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

You can run this project locally with Docker or via standard Node.js commands.

### Option 1: Using Docker (Recommended)

Make sure you have Docker and Docker Compose installed.

```bash
# Clone the repository
git clone https://github.com/ShiponChowdhury1/Quiz-Question.git

# Navigate to the project directory
cd Quiz-Question

# Build and start the container
docker compose up --build -d
```
The application will be running at `http://localhost:3005`.

### Option 2: Manual Setup

If you prefer to run it locally without Docker:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure highlights

- `/app/(auth)` - Authentication pages and API lib
- `/app/dashboard` - The core application interface (Chat, History, Settings)
- `/app/dashboard/_components/translations.ts` - Centralized multi-language dictionary
- `/app/dashboard/_components/useLanguage.ts` - Custom hook driving the real-time reactivity of the i18n system.

## 👨‍💻 Author

**Shipon Chowdhury**
Passionate Full-Stack Developer creating scalable, user-centric web applications. Always exploring new technologies to build better digital experiences. 

---

*If you are a recruiter or hiring manager viewing this project, feel free to explore the codebase. It reflects my dedication to writing clean, maintainable code, robust feature implementations (like the reactive translation system), and building intuitive user experiences.*
