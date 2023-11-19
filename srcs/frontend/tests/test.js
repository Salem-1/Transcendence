// index.test.js

import fs from 'fs';
import path from 'path';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/dom';
import { register } from '../index';

describe('Registration Page', () => {
  let htmlContent;

  beforeAll(() => {
    // Read the content of index.html
    const indexPath = path.resolve(__dirname, '../index.html');
    htmlContent = fs.readFileSync(indexPath, 'utf8');
    console.log(htmlContent);
    // Set up the virtual DOM
    document.body.innerHTML = htmlContent;
  });

  it('should display an alert if passwords do not match', () => {
    // Arrange
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentPassword' } });
    fireEvent.click(screen.getByText('Register'));

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should display a success message for a valid registration', () => {
    // Arrange
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    // Act
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Register'));

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Registration successful! Now you can log in.');
  });

  // Add more test cases for other scenarios...
});


//npm init -y 
//npm install --save-dev jest @testing-library/jest-dom @testing-library/dom

//npm install --save-dev jest-environment-jsdom-fifteen
