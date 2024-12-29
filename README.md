# Voice-to-Text App

## Overview
Voice-to-Text is a web application designed for converting speech into text with a seamless user experience. The app leverages advanced tools like AssemblyAI for speech recognition, a modern React-based UI, and a robust backend to handle transcription requests and user management.

## Features
- **Speech Recognition**: Accurate and fast speech-to-text conversion using AssemblyAI.
- **User Authentication**: Secure authentication powered by Clerk.
- **File Upload**: Support for uploading audio files via drag-and-drop or file selector.
- **Real-time Notifications**: Status updates using Radix Toast.
- **Light/Dark Themes**: Dynamic theming with `next-themes`.
- **Payments Integration**: Use Stripe for payment handling.

---

## Tech Stack
### Frontend
- **Framework**: Next.js 14
- **Styling**: TailwindCSS with animations via `tailwindcss-animate`
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI for dialog, dropdown, and tooltips

### Backend
- **ORM**: Prisma for database interactions
- **API Handling**: Next.js API routes with `next-connect`
- **File Uploads**: Multer and Formidable
- **Third-party APIs**: AssemblyAI for transcription

### Authentication & Authorization
- Clerk for secure user management and authentication.

### Payments
- Stripe for handling subscriptions and payments.

### Notifications
- Radix Toast for user alerts and notifications.

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/voice-to-text.git
   cd voice-to-text
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    DATABASE_URL=postgresql://postgres:password@localhost:5432/name?schema=public
    CLERK_WEBHOOK_SECRET=
    BLOB_READ_WRITE_TOKEN=
    ASSEMBLYAI_API_KEY=
    STRIPE_SECRET_KEY=
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    STRIPE_WEBHOOK_SECRET=
    URL=http://localhost:3000 or deploy url
   ```

---

## Usage
### Development
Start the development server:
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

### Production
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

## Scripts
- `dev`: Starts the development server.
- `build`: Generates Prisma client and builds the Next.js app.
- `start`: Starts the Next.js production server.
- `lint`: Runs ESLint on the codebase.

---

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments
- [AssemblyAI](https://www.assemblyai.com/) for providing powerful speech-to-text APIs.
- [Radix UI](https://www.radix-ui.com/) for modern and accessible UI components.
- [Clerk](https://clerk.dev/) for seamless authentication solutions.
- [Stripe](https://stripe.com/) for their comprehensive payment APIs.

