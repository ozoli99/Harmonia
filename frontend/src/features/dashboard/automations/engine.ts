import { RuleContext, StatusTriggerRule } from "./types";

export const runStatusRules = (
    rules: StatusTriggerRule[],
    context: RuleContext
) => {
    for (const rule of rules) {
        if (!rule.condition || rule.condition(context)) {
            rule.action(context);
        }
    }
};
