"""
Prompt pairs for the negation experiment.

Each pair has:
- affirm: "Write code using X"
- negate: "Write code without using X" / "Don't use X"
- alternative: "Write code using Y" (the actual replacement, not a negation)

The hypothesis: negate is closer to affirm than to alternative in hidden state
space, because negation activates the concept it's negating.
"""

PAIRS = [
    {
        "id": "var_declarations",
        "affirm": "Write a JavaScript function that uses var for all variable declarations.",
        "negate": "Write a JavaScript function that does not use var. Use const and let instead.",
        "alternative": "Write a JavaScript function that uses const and let for all variable declarations.",
    },
    {
        "id": "callbacks",
        "affirm": "Write a Node.js function that reads a file using callbacks.",
        "negate": "Write a Node.js function that reads a file without using callbacks. Use async/await instead.",
        "alternative": "Write a Node.js function that reads a file using async/await.",
    },
    {
        "id": "class_components",
        "affirm": "Write a React component using a class that extends Component.",
        "negate": "Write a React component without using classes. Use a function component instead.",
        "alternative": "Write a React component using a function with hooks.",
    },
    {
        "id": "for_loops",
        "affirm": "Write a function that transforms an array using a for loop.",
        "negate": "Write a function that transforms an array without using for loops. Use map instead.",
        "alternative": "Write a function that transforms an array using map.",
    },
    {
        "id": "string_concat",
        "affirm": "Write a function that builds a greeting string using string concatenation with the + operator.",
        "negate": "Write a function that builds a greeting string without using string concatenation. Use template literals instead.",
        "alternative": "Write a function that builds a greeting string using template literals.",
    },
    {
        "id": "mutation",
        "affirm": "Write a function that sorts an array by mutating it in place.",
        "negate": "Write a function that sorts an array without mutating the original. Return a new sorted array instead.",
        "alternative": "Write a function that returns a new sorted copy of an array without modifying the original.",
    },
    {
        "id": "any_type",
        "affirm": "Write a TypeScript function that accepts parameters typed as any.",
        "negate": "Write a TypeScript function without using the any type. Use proper generic types instead.",
        "alternative": "Write a TypeScript function that uses proper generic types for its parameters.",
    },
    {
        "id": "imperative_error",
        "affirm": "Write a function that handles errors using try/catch with imperative error checking.",
        "negate": "Write a function that handles errors without using try/catch. Use Result types instead.",
        "alternative": "Write a function that handles errors using Result types.",
    },
]

VARIANTS = ["affirm", "negate", "alternative"]


def get_all_prompts():
    """Yield (pair_id, variant, prompt_text) for every combination."""
    for pair in PAIRS:
        for variant in VARIANTS:
            yield pair["id"], variant, pair[variant]
