import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(controlNameToMatch: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlToMatch = control.parent?.get(controlNameToMatch);
    return controlToMatch && controlToMatch.value !== control.value
      ? { mustMatch: true } 
      : null;
  };
}
