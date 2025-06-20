const EDIT_TEXT_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Frame">
<g id="Shape">
<path d="M5.33333 13.8667C5.33333 14.4558 4.85577 14.9333 4.26667 14.9333H2.13333C0.955126 14.9333 0 13.9782 0 12.8V2.13333C0 0.955126 0.955126 0 2.13333 0H12.8C13.9782 0 14.9333 0.955126 14.9333 2.13333V4.26667C14.9333 4.85577 14.4558 5.33333 13.8667 5.33333C13.2776 5.33333 12.8 4.85577 12.8 4.26667V2.13333H2.13333V12.8H4.26667C4.85577 12.8 5.33333 13.2776 5.33333 13.8667Z" fill="#545E6B"/>
<path d="M11.7333 4.26667H3.2V6.4H11.7333V4.26667Z" fill="#545E6B"/>
<path d="M13.4448 8.39149L13.9883 7.84802C14.5885 7.24773 15.211 7.44042 15.6186 7.84802C16.0262 8.25562 16.2189 8.87812 15.6186 9.47842L15.0752 10.0219L13.4448 8.39149Z" fill="#545E6B"/>
<path d="M7.46667 16L8.01013 13.8261L12.9013 8.93495L14.5317 10.5653L9.64053 15.4565L7.46667 16Z" fill="#545E6B"/>
<path d="M3.2 8.53333H8.53333V10.6667H3.2V8.53333Z" fill="#545E6B"/>
</g>
</g>
</svg>
`;

const QUILL_EDITOR_FONTS = [
  'sans',
  'impact',
  'arial',
  'comic sans ms',
  'courier new',
  'georgia',
  'lucida sans unicode',
  'tahoma',
  'times-new-roman',
];

const QUILL_TOOLBAR = [
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: ['center', '', 'right', 'justify'] }], // Alignment options
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'blockquote'],
  ['clean'],
];

export { EDIT_TEXT_ICON, QUILL_EDITOR_FONTS, QUILL_TOOLBAR };
