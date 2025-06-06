import { render, screen } from '@testing-library/react';
import Home from '../pages/home';

test('renders Hello, React!', () => {
  render(<Home />);
  expect(screen.getByText('Currency Converted')).toBeInTheDocument();
});