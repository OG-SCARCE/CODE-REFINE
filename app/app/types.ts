
export interface Optimization {
  issue: string;
  suggestion: string;
  explanation: string;
  category: 'Performance' | 'Readability' | 'Security' | 'Best Practices' | 'Bug Risk';
  severity: 'High' | 'Medium' | 'Low';
}

export interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  timeExplanation: string;
  spaceExplanation: string;
}

export interface AnalysisResult {
  language: string;
  summary: string;
  refactoredCode: string;
  optimizations: Optimization[];
  complexity: ComplexityAnalysis;
}

export interface CodeGenerationResult {
  code: string;
  language: string;
  explanation: string;
}
