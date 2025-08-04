# CareSync Frontend

Modern React frontend for the CareSync mental health platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+ or yarn 1.22+
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── api/              # API client and services
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── store/           # State management (Zustand)
├── styles/          # Global styles and CSS
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main app component
└── main.tsx         # Application entry point
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_VERSION=1.0.0
```

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Query**: Server state management
- **Zustand**: Client state management

## 🎨 Design System

### Colors

- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Primary Font**: Inter
- **Hebrew Font**: Heebo
- **Direction**: RTL (Right-to-Left)

### Components

All components follow a consistent design system with:
- Responsive design
- Accessibility features
- RTL support
- Dark mode ready (future)

## 🔧 Configuration

### Vite Configuration

Located in `vite.config.ts`:
- React plugin
- TypeScript support
- Path aliases
- Proxy configuration for API
- Build optimization

### Tailwind Configuration

Located in `tailwind.config.js`:
- Custom color palette
- RTL support utilities
- Custom animations
- Responsive breakpoints

### TypeScript Configuration

Located in `tsconfig.json`:
- Strict type checking
- Path mapping
- Modern ES features

## 🧪 Testing

### Test Setup

- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **jsdom**: DOM environment

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Deployment

The application can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Configure in repository settings

## 🔒 Security

### Security Features

- **Content Security Policy**: Configured in HTML
- **HTTPS**: Required in production
- **Input Validation**: All forms validated
- **XSS Protection**: Built-in React protection
- **CSRF Protection**: Token-based authentication

### Environment Variables

Never commit sensitive data:
- API keys
- Database credentials
- JWT secrets

## 🌐 Internationalization

### Supported Languages

- **Hebrew** (Primary)
- **Arabic** (Secondary)
- **English** (Secondary)

### Implementation

Using `react-i18next` for translations:
- Automatic language detection
- RTL support
- Pluralization
- Number formatting

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Features

- Mobile-first approach
- Touch-friendly interfaces
- Optimized performance
- Progressive enhancement

## 🔍 Performance

### Optimization

- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code removal
- **Image Optimization**: WebP support
- **Caching**: Service worker ready

### Monitoring

- **Bundle Analysis**: `npm run build -- --analyze`
- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Sentry integration ready

## 🤝 Contributing

### Code Style

- **ESLint**: Enforced code style
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Commit message format

### Pull Request Process

1. Create feature branch
2. Make changes with tests
3. Run linting and tests
4. Submit pull request
5. Code review
6. Merge to main

## 📚 Documentation

### API Documentation

- Backend API docs: `/backend/api_documentation.md`
- Frontend API client: `/src/api/client.ts`

### Component Documentation

Each component includes:
- Purpose and usage
- Props interface
- Examples
- Accessibility notes

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Check types
npm run type-check
```

**API Connection Issues**
- Verify backend is running
- Check API URL in environment
- Verify CORS configuration

### Getting Help

1. Check existing issues
2. Search documentation
3. Create detailed issue report
4. Include error logs and steps

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for fast build tooling
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- All contributors to this project 