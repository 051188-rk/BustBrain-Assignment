function evaluateCondition(condition, answers) {
    const answer = answers[condition.questionKey];

    if (answer === undefined || answer === null || answer === '') {
        return false;
    }

    switch (condition.operator) {
        case 'equals':
            if (Array.isArray(answer) && Array.isArray(condition.value)) {
                return JSON.stringify(answer.sort()) === JSON.stringify(condition.value.sort());
            }
            return answer === condition.value;

        case 'notEquals':
            if (Array.isArray(answer) && Array.isArray(condition.value)) {
                return JSON.stringify(answer.sort()) !== JSON.stringify(condition.value.sort());
            }
            return answer !== condition.value;

        case 'contains':
            if (typeof answer === 'string') {
                return answer.includes(condition.value);
            }
            if (Array.isArray(answer)) {
                return answer.includes(condition.value);
            }
            return false;

        default:
            return false;
    }
}

function shouldShowQuestion(rules, answers = {}) {
    if (!rules || !rules.conditions || rules.conditions.length === 0) {
        return true;
    }

    const results = rules.conditions.map(cond => evaluateCondition(cond, answers));

    if (rules.logic === 'AND') {
        return results.every(r => r === true);
    } else if (rules.logic === 'OR') {
        return results.some(r => r === true);
    }

    return false;
}

export { shouldShowQuestion, evaluateCondition };
