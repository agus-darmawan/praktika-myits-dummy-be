import { SimpleMessagesProvider } from '@vinejs/vine'

const messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required.',
  'email.email': 'The email must be a valid email address.',
  'password.minLength': 'The password must be at least 8 characters.',
  'password.confirmed': 'The password confirmation does not match.',
  'string.required': 'The string field is required.',
  'string.minLength': 'The {{ field }} must be at least {{ options.minLength }} characters long.',
  'string.maxLength': 'The {{ field }} must not exceed {{ options.maxLength }} characters.',
  'number.required': 'The number field is required.',
  'number.minLength': 'The {{ field }} must be at least {{ options.minLength }} digits.',
  'number.maxLength': 'The {{ field }} must not exceed {{ options.maxLength }} digits.',
  'number.number': 'The number field must be a valid number.',
  'boolean.required': 'The boolean field is required.',
  'boolean.boolean': 'The boolean field must be true or false.',
})

export default messagesProvider
