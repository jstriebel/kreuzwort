export const writeCross = (row_i, col_i, chars) => ({
  type: 'WRITE_CROSS',
  row_i,
  col_i,
  chars
});

export const setDirectionIsDown = (isDown) => ({
  type: 'SET_DIRECTION_IS_DOWN',
  isDown
});

export const switchSeparation = (row_i, col_i) => ({
  type: 'SWITCH_SEPARATION',
  row_i,
  col_i
});

export const setQuestion = (isDown, row_i, col_i, question) => ({
  type: 'SET_QUESTION',
  isDown,
  row_i,
  col_i,
  question
});

export const ensureQuestion = (isDown, row_i, col_i) => ({
  type: 'ENSURE_QUESTION',
  isDown,
  row_i,
  col_i
});

export const setNewsName = (newsName) => ({
  type: 'SET_NEWS_NAME',
  newsName
});

export const ensureNewsName = () => ({
  type: 'ENSURE_NEWS_NAME'
});

export const setSubtitle = (subtitle) => ({
  type: 'SET_SUBTITLE',
  subtitle
});

export const ensureSubtitle = () => ({
  type: 'ENSURE_SUBTITLE'
});

export const setDate = (date) => ({
  type: 'SET_DATE',
  date
});

export const setAbbreviation = (abbreviation) => ({
  type: 'SET_ABBREVIATION',
  abbreviation
});

export const ensureAbbreviation = () => ({
  type: 'ENSURE_ABBREVIATION'
});

export const reset = () => ({
  type: 'RESET'
});
