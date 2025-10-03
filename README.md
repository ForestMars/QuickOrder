# QuickOrder ☕

A modern, cashierless coffee shop ordering system built with React, TypeScript, and Vite. QuickOrder allows customers to browse the menu, place orders, and track their order history with a beautiful, responsive interface.

## ✨ Features

### 🛍️ **Ordering System**
- **Browse Menu**: Explore drinks and snacks with beautiful product images
- **Shopping Cart**: Add/remove items with quantity management
- **Local Storage**: Cart persists between sessions
- **Payment Processing**: Simulated checkout with order confirmation

### 📱 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Navigation**: Easy-to-use routing between pages
- **Order Tracking**: View order history with status updates

### 🎨 **Design & UX**
- **Beautiful Imagery**: High-quality Unsplash photos for products
- **Consistent Theming**: CSS variables for easy customization
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Performance**: Fast loading with Vite's HMR

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coffee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see QuickOrder in action!

## 📁 Project Structure

```
coffee/
├── src/
│   ├── pages/           # Main application pages
│   │   ├── HomePage.tsx    # Landing page with hero section
│   │   ├── MenuPage.tsx    # Menu browsing and cart
│   │   └── OrdersPage.tsx  # Order history and tracking
│   ├── styles/          # CSS and theme files
│   ├── assets/          # Static assets and images
│   └── App.tsx          # Main app component with routing
├── public/              # Public assets
├── __tests__/           # Test files
└── package.json         # Dependencies and scripts
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run Jest tests

## 🎯 Core Features

### Home Page
- **Hero Section**: Eye-catching banner with call-to-action
- **Quick Stats**: Average wait time, ratings, and menu size
- **Navigation**: Direct access to menu and order history

### Menu Page
- **Category Browsing**: Organized by drinks and snacks
- **Product Cards**: High-quality images with pricing
- **Shopping Cart**: 
  - Add/remove items with quantity controls
  - Real-time total calculation
  - Persistent storage
- **Checkout Process**: Simulated payment with order confirmation

### Orders Page
- **Order History**: Complete list of past orders
- **Status Tracking**: Pending, completed, and cancelled states
- **Order Management**: Update status or delete orders
- **Empty State**: Helpful guidance for new users

## 🎨 Customization

### Theme Colors
The app uses CSS variables for easy theming. Modify these in `src/styles/theme.css`:

```css
:root {
  --accent: #8b5cf6;      /* Primary brand color */
  --background: #f8fafc;   /* Page background */
  --text: #1e293b;        /* Primary text color */
  --text-secondary: #64748b; /* Secondary text */
}
```

### Adding Menu Items
Edit the `menuData` array in `src/pages/MenuPage.tsx`:

```typescript
const menuData = [
  {
    category: 'New Category',
    items: [
      {
        id: 999,
        name: 'New Item',
        price: 5.99,
        image: 'https://images.unsplash.com/...'
      }
    ]
  }
];
```

## 🧪 Testing

The project includes Jest and React Testing Library for comprehensive testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite (fast HMR and builds)
- **Routing**: React Router DOM
- **Styling**: CSS with CSS Variables
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with TypeScript support
- **Images**: Unsplash for high-quality product photos

## 🔮 Future Enhancements

### Planned Features
- [ ] **User Authentication**: Login/signup system
- [ ] **Backend Integration**: Real database and API
- [ ] **Real-time Updates**: WebSocket for live order status
- [ ] **Payment Gateway**: Stripe/PayPal integration
- [ ] **Admin Panel**: Menu management interface
- [ ] **Push Notifications**: Order status alerts
- [ ] **Loyalty Program**: Points and rewards system
- [ ] **Mobile App**: React Native version

### Technical Improvements
- [ ] **State Management**: Redux Toolkit or Zustand
- [ ] **Form Validation**: React Hook Form
- [ ] **UI Components**: Custom component library
- [ ] **Performance**: Code splitting and lazy loading
- [ ] **PWA**: Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** for beautiful product photography
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **Coffee Community** for inspiration and feedback

---

**Made with ☕ and ❤️ for coffee lovers everywhere**
