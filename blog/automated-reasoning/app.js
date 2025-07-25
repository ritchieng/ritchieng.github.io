// app.js – interactive logic for the Automated Reasoning blog post
//
// This script powers two interactive examples described in the post.
// Example 1 evaluates the leave policy:
//   LeaveApproved ≡ (LeaveDays < 20) ∧ (TenureMonths > 3)
// Example 2 evaluates the enrollment policy:
//   EnrollmentAllowed ≡ (CreditHours ≥ 60) ∧ (GPA ≥ 3.0)
// When the corresponding button is clicked, the selected values are
// substituted into the appropriate equation and the result is displayed as
// either SAT (constraints satisfiable) or UNSAT (unsatisfiable).

document.addEventListener('DOMContentLoaded', () => {
  // Example 1 elements
  const leaveDaysInput = document.getElementById('leave-days-input');
  const tenureInput = document.getElementById('tenure-input');
  const checkButton = document.getElementById('check-button');
  const equationOutput = document.getElementById('equation-output');
  const resultOutput = document.getElementById('result-output');

  // Example 2 elements
  const creditHoursInput = document.getElementById('credit-hours-input');
  const gpaInput = document.getElementById('gpa-input');
  const evaluateButton = document.getElementById('evaluate-button');
  const equationOutput2 = document.getElementById('equation-output2');
  const resultOutput2 = document.getElementById('result-output2');

  // Evaluate the leave policy given the current input values.
  function evaluateLeavePolicy() {
    if (!leaveDaysInput || !tenureInput || !equationOutput || !resultOutput) {
      console.error('Missing required elements for leave policy evaluation');
      return;
    }

    const leaveDays = parseInt(leaveDaysInput.value, 10);
    const leaveDaysValue = isNaN(leaveDays) ? 0 : leaveDays;
    const tenure = parseInt(tenureInput.value, 10);
    const tenureValue = isNaN(tenure) ? 0 : tenure;

    const substituted = `(${leaveDaysValue} < 20) ∧ (${tenureValue} > 3)`;
    const policyString = 'LeaveApproved ≡ (LeaveDays < 20) ∧ (TenureMonths > 3)';
    equationOutput.textContent = `${policyString}\nSubstituted: ${substituted}`;
    equationOutput.style.display = 'block';

    const sat = (leaveDaysValue < 20) && (tenureValue > 3);
    if (sat) {
      resultOutput.textContent = 'Result: SAT – leave request approved.';
      resultOutput.style.color = '#00ff88';
    } else {
      resultOutput.textContent = 'Result: UNSAT – leave request denied.';
      resultOutput.style.color = '#ff5555';
    }
    resultOutput.style.display = 'block';
  }

  // Evaluate the enrollment policy in Example 2.
  function evaluateEnrollmentPolicy() {
    if (!creditHoursInput || !gpaInput || !equationOutput2 || !resultOutput2) {
      console.error('Missing required elements for enrollment policy evaluation');
      return;
    }

    const creditHours = parseInt(creditHoursInput.value, 10);
    const creditHoursValue = isNaN(creditHours) ? 0 : creditHours;
    const gpa = parseFloat(gpaInput.value);
    const gpaValue = isNaN(gpa) ? 0 : gpa;

    const substituted2 = `(${creditHoursValue} ≥ 60) ∧ (${gpaValue} ≥ 3.0)`;
    const policyString2 = 'EnrollmentAllowed ≡ (CreditHours ≥ 60) ∧ (GPA ≥ 3.0)';
    equationOutput2.textContent = `${policyString2}\nSubstituted: ${substituted2}`;
    equationOutput2.style.display = 'block';

    const sat2 = (creditHoursValue >= 60) && (gpaValue >= 3.0);
    if (sat2) {
      resultOutput2.textContent = 'Result: SAT – enrollment allowed.';
      resultOutput2.style.color = '#00ff88';
    } else {
      resultOutput2.textContent = 'Result: UNSAT – enrollment denied.';
      resultOutput2.style.color = '#ff5555';
    }
    resultOutput2.style.display = 'block';
  }

  // Attach listeners with error checking
  if (checkButton) {
    checkButton.addEventListener('click', evaluateLeavePolicy);
  } else {
    console.error('Check button not found');
  }
  
  if (evaluateButton) {
    evaluateButton.addEventListener('click', evaluateEnrollmentPolicy);
  } else {
    console.error('Evaluate button not found');
  }
});