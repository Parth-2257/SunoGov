// Utility to normalize and interpret affirmative/negative replies deterministically
export const interpretSemanticAnswer = (text: string): 'YES' | 'NO' | 'AMBIGUOUS' => {
  const normalized = text.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

  const obviousYes = [
    'yes', 'y', 'yeah', 'yep', 'sure', 'okay', 'ok', 'correct', 'right',
    'haan', 'ha', 'han', 'ji', 'bilkul',
    'yes i have it', 'yes i have one', 'i have it', 'i do'
  ];

  const obviousNo = [
    'no', 'n', 'nope', 'nah', 'not really', 'i dont', 'i do not',
    'nahi', 'nahin', 'nahi hai', 'no i dont', 'i dont have one', 'i dont have it'
  ];

  if (obviousYes.includes(normalized)) {
    return 'YES';
  }
  if (obviousNo.includes(normalized)) {
    return 'NO';
  }

  // Substring / regex matching for common simple affirmative/negative phrases
  const yesRegex = /^(yes|yeah|yep|y|haan|ha|han|ji|correct|right|i do|sure|ok|okay|ha\s*han|haan\s*ji|ji\s*haan)$/i;
  const noRegex = /^(no|nope|nah|n|nahi|nahin|nahi\s*hai|i\s*dont|dont|don't)$/i;

  if (yesRegex.test(normalized)) return 'YES';
  if (noRegex.test(normalized)) return 'NO';

  // Check prefix / suffix
  if (normalized.startsWith('yes ') || normalized.startsWith('haan ') || normalized.includes('have it') || normalized.includes('have one') || normalized.startsWith('ji ')) {
    return 'YES';
  }
  if (normalized.startsWith('no ') || normalized.startsWith('nahi ') || normalized.includes('dont have') || normalized.includes('do not have') || normalized.includes('nahi hai')) {
    return 'NO';
  }

  return 'AMBIGUOUS';
};
