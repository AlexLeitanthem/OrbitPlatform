# 🤝 Contributing to Orbit Platform

Thank you for your interest in contributing to Orbit Platform! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)

## 📜 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- Basic knowledge of React and Node.js

### Development Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/your-username/orbit-platform.git
   cd orbit-platform
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd orbit-backend
   npm install
   
   # Frontend
   cd ../orbit-frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cd orbit-backend
   cp env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../orbit-frontend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd orbit-backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd orbit-frontend
   npm run dev
   ```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Fixes**: Fix issues and bugs
- ✨ **Features**: Add new functionality
- 📚 **Documentation**: Improve documentation
- 🎨 **UI/UX**: Enhance user interface
- ⚡ **Performance**: Optimize performance
- 🧪 **Testing**: Add or improve tests
- 🔧 **Refactoring**: Improve code quality

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add tests for new features
   - Update documentation

3. **Test Your Changes**
   ```bash
   # Backend tests
   cd orbit-backend
   npm test
   
   # Frontend tests
   cd orbit-frontend
   npm test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add user profile editing functionality"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] Self-review of your code
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Descriptive commit messages

### PR Template

When creating a pull request, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review the code
3. **Testing**: Manual testing if needed
4. **Approval**: At least one approval required
5. **Merge**: Squash and merge to main branch

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search Existing Issues**: Check if the issue already exists
2. **Check Documentation**: Review README and docs
3. **Reproduce**: Ensure you can reproduce the issue

### Issue Template

```markdown
## Bug Report

### Description
Clear description of the bug

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js: [e.g., v16.14.0]

### Additional Context
Any other relevant information
```

## 📏 Coding Standards

### JavaScript/Node.js

```javascript
// Use const/let instead of var
const user = await User.findById(id);

// Use async/await instead of callbacks
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Use meaningful variable names
const userProfile = await Profile.findOne({ user: userId });
```

### React/JSX

```jsx
// Use functional components with hooks
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
};

// Use proper prop types
import PropTypes from 'prop-types';

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};
```

### File Naming

- **Components**: PascalCase (`UserProfile.jsx`)
- **Utilities**: camelCase (`apiUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

### Code Organization

```
src/
├── components/          # Reusable components
├── pages/             # Page components
├── hooks/             # Custom hooks
├── utils/             # Utility functions
├── services/          # API services
└── constants/         # Constants and configs
```

## 🧪 Testing Guidelines

### Backend Testing

```javascript
// Example test structure
describe('User Controller', () => {
  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.user.email).toBe(userData.email);
    });
  });
});
```

### Frontend Testing

```jsx
// Example component test
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

test('renders user profile', () => {
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  render(<UserProfile user={mockUser} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

## 📚 Documentation

### Code Documentation

```javascript
/**
 * Creates a new user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.body - User profile data
 * @param {string} req.body.company - User's company
 * @param {string} req.body.location - User's location
 * @returns {Promise<void>}
 */
const createProfile = async (req, res) => {
  // Implementation
};
```

### README Updates

When adding new features:
- Update the Features section
- Add installation instructions if needed
- Update API documentation
- Add usage examples

## 🏷️ Commit Message Convention

We use conventional commits:

```
feat: add user profile editing
fix: resolve authentication issue
docs: update API documentation
style: format code with prettier
refactor: improve user service
test: add user controller tests
chore: update dependencies
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🎯 Getting Help

### Resources

- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Material-UI Documentation](https://mui.com)

### Community

- GitHub Discussions
- Discord Server (if available)
- Stack Overflow (tag: orbit-platform)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Orbit Platform! 🚀

---

**Last Updated**: December 2024
