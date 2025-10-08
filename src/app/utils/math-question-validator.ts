import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface MathQuestion {
  num1: number;
  num2: number;
  answer: number;
}

export function createMathQuestion(): MathQuestion {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10);
  return { num1, num2, answer: num1 + num2 };
}

export function mathAnswerValidator(question: MathQuestion): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isCorrect = parseInt(control.value, 10) === question.answer;
    return isCorrect ? null : { wrongAnswer: true };
  };
}
