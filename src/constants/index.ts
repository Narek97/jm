export const TOKEN_NAME = 'suitecx-token';
export const LOGIN_ERROR_NAME = 'suitecx-login-error';

export const querySlateTime = 3000;

export const IMAGE_ASPECT = 1024;

export const DEFAULT_OUTCOME_ICON = `${import.meta.env.VITE_AWS_URL}/default/outcome-group/icon/action.svg`;

export const PERSONA_FILE_TYPES = ['JPG', 'PNG', 'GIF'];

export const DEFAULT_OUTCOMES_GROUP = [
  {
    count: 0,
    icon: 'https://suitecx.s3.us-east-2.amazonaws.com/default/outcome-group/icon/opportuniti.svg',
    id: 1,
  },

  {
    count: 0,
    icon: 'https://suitecx.s3.us-east-2.amazonaws.com/default/outcome-group/icon/solution.svg',
    id: 2,
  },

  {
    count: 0,
    icon: 'https://suitecx.s3.us-east-2.amazonaws.com/default/outcome-group/icon/action.svg',
    id: 3,
  },
];
