# LDR Counter

![LDR Counter Logo](/public/heart-icon-192.svg)

A real-time counter application for people in long-distance relationships, built with Next.js 14, React, and Pusher for live updates.

## Features

- 🔄 Real-time counter updates using Pusher
- 🎨 Modern, responsive UI with gradient designs
- 🔒 CAPTCHA verification for authentic responses
- 🛡️ Rate limiting for security
- 📱 Progressive Web App (PWA) support
- 📊 Interactive split-flap display for counter
- 📝 Survey integration for community engagement
- 🔐 Privacy-focused with no personal data storage
- 💫 Beautiful animations and transitions

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Real-time Updates:** Pusher
- **Animations:** Framer Motion
- **Security:** reCAPTCHA v3
- **Rate Limiting:** IP-based

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/userlaws/LDR.git
   cd ldr-counter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your environment variables:

   ```env
   NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_SECRET=your_pusher_secret
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ldr-counter/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── home/              # Home page
│   ├── privacy/           # Privacy policy
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utility functions
├── public/               # Static assets
└── styles/              # Global styles
```

## Features in Detail

### Real-time Counter

- Uses Pusher for instant updates
- Split-flap animation display
- Auto-increment feature after 5 seconds

### User Interaction

- CAPTCHA verification for authenticity
- Survey prompt after participation
- Rate limiting to prevent abuse

### Design

- Gradient-based theme
- Responsive layout
- Animated transitions
- Custom SVG icons

### Privacy

- No personal data collection
- Transparent privacy policy
- IP-based rate limiting only

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors and users of LDR Counter
- Built with love for the LDR community

## Contact

For any queries or suggestions, please open an issue on GitHub.
