import { render, fireEvent } from '@testing-library/react';
import App from './App';
import { getResponseMessage } from './App';

describe('ChatWindow component', () => {
  test('should render a chat window', () => {
    const { getByText } = render(<App />);
    const chatWindowElement = getByText(/let us know how we can help/i);
    expect(chatWindowElement).toBeInTheDocument();
  });

  test('should render the initial messages', () => {
    const { getByText } = render(<App />);
    expect(getByText('Hi! Let us know how we can help and we`ll get someone connected to you right away!')).toBeInTheDocument();
    expect(getByText('Let me know the topic you need more information on so I can help')).toBeInTheDocument();
  });

  test('should render incoming and outgoing messages', () => {
    const { getByRole, getByDisplayValue, getByText } = render(<App />);
    const inputField = getByDisplayValue('');
    const sendButton = getByRole('button', { name: 'send button' });
    fireEvent.change(inputField, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    expect(getByRole('heading', { name: 'Chat header' })).toHaveTextContent('Chat');
    expect(getByText('Hello')).toBeInTheDocument();
    expect(getByText('Hi! How are you? May I know your name')).toBeInTheDocument();
  });
});

describe('getResponseMessage', () => {
  test('returns the correct response for a valid input', () => {
    const inputMessage = 'hello';
    const expectedResponse = 'Hi! How are you? May I know your name';
    const response = getResponseMessage(inputMessage);
    expect(response).toEqual(expectedResponse);
  });

  test('returns a default response for an invalid input', () => {
    const inputMessage = 'foobar';
    const expectedResponse = 'I am sorry, I do not understand your message.';
    const response = getResponseMessage(inputMessage);
    expect(response).toEqual(expectedResponse);
  });
});

describe('DemoWrapper component', () => {
  test('renders DemoWrapper', () => {
    const { getByRole } = render(<App />);
    const demoWrapper = getByRole('region', { name: 'Demo wrapper section' });
    expect(demoWrapper).toBeInTheDocument();
    expect(demoWrapper.firstChild).toHaveClass('demo-wrapper-content');
  });
});