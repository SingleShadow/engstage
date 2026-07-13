export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
};

const getWordFrequency = (text) => {
  const words = normalizeText(text).split(' ');
  const freq = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });
  return freq;
};

const calculateEditDistance = (a, b) => {
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return matrix[a.length][b.length];
};

const isApproximateMatch = (word1, word2, threshold = 0.7) => {
  const longer = word1.length > word2.length ? word1 : word2;
  const shorter = word1.length > word2.length ? word2 : word1;
  
  if (longer.length === 0) return true;
  
  const distance = calculateEditDistance(longer, shorter);
  const similarity = (longer.length - distance) / longer.length;
  
  return similarity >= threshold;
};

export const fuzzyMatch = (input, target) => {
  const normalizedInput = normalizeText(input);
  const normalizedTarget = normalizeText(target);
  
  if (!normalizedInput) return { matched: false, score: 0 };
  if (!normalizedTarget) return { matched: false, score: 0 };
  
  if (normalizedInput === normalizedTarget) {
    return { matched: true, score: 100 };
  }
  
  const inputWords = normalizedInput.split(' ').filter(w => w.length > 0);
  const targetWords = normalizedTarget.split(' ').filter(w => w.length > 0);
  
  if (targetWords.length === 0) return { matched: false, score: 0 };
  
  const inputFreq = getWordFrequency(normalizedInput);
  const targetFreq = getWordFrequency(normalizedTarget);
  
  let matchedWeight = 0;
  let totalWeight = 0;
  
  targetWords.forEach(targetWord => {
    const targetWeight = targetWord.length;
    totalWeight += targetWeight;
    
    if (inputFreq[targetWord]) {
      const matchCount = Math.min(inputFreq[targetWord], targetFreq[targetWord]);
      matchedWeight += targetWeight * matchCount;
    } else {
      const foundApproximate = inputWords.some(inputWord => 
        isApproximateMatch(inputWord, targetWord, 0.6)
      );
      if (foundApproximate) {
        matchedWeight += targetWeight * 0.6;
      }
    }
  });
  
  let score = Math.round((matchedWeight / totalWeight) * 100);
  
  const inputExtraRatio = Math.max(0, (inputWords.length - targetWords.length) / targetWords.length);
  if (inputExtraRatio > 0.5) {
    score = Math.round(score * (1 - inputExtraRatio * 0.3));
  }
  
  const inputMissingRatio = Math.max(0, (targetWords.length - inputWords.length) / targetWords.length);
  if (inputMissingRatio > 0.3) {
    score = Math.round(score * (1 - inputMissingRatio * 0.5));
  }
  
  const orderScore = calculateOrderScore(inputWords, targetWords);
  score = Math.round(score * 0.7 + orderScore * 30);
  
  score = Math.max(0, Math.min(100, score));
  
  return {
    matched: score >= 70,
    score: score
  };
};

const calculateOrderScore = (inputWords, targetWords) => {
  if (inputWords.length === 0 || targetWords.length === 0) return 0;
  
  let matchedPairs = 0;
  let lastTargetIndex = -1;
  
  inputWords.forEach(inputWord => {
    const targetIndex = targetWords.findIndex((tw, idx) => 
      idx > lastTargetIndex && (tw === inputWord || isApproximateMatch(inputWord, tw, 0.8))
    );
    
    if (targetIndex !== -1) {
      matchedPairs++;
      lastTargetIndex = targetIndex;
    }
  });
  
  return matchedPairs / targetWords.length;
};

export const matchAgainstOptions = (input, options) => {
  if (!input || !options || options.length === 0) {
    return { matched: false, matchedOption: null, score: 0 };
  }
  
  let bestMatch = { matched: false, matchedOption: null, score: 0 };
  
  options.forEach(option => {
    const result = fuzzyMatch(input, option.text);
    if (result.score > bestMatch.score) {
      bestMatch = { matched: result.matched, matchedOption: option, score: result.score };
    }
  });
  
  return bestMatch;
};

export const calculateSimilarity = (str1, str2) => {
  const a = str1.toLowerCase();
  const b = str2.toLowerCase();
  
  if (a === b) return 100;
  
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  
  if (longer.length === 0) return 100;
  
  const longerLength = longer.length;
  const editDistance = levenshteinDistance(longer, shorter);
  
  return Math.round(((longerLength - editDistance) / longerLength) * 100);
};

const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
};
