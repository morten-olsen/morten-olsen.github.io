"""
Prompt matrix: 10 coding tasks × 4 tone variants + control prompts.

Each task has the same semantic intent expressed in casual, professional, terse,
and academic registers. The core request is kept identical across tones — only
surface phrasing changes.

Control prompts have completely different intents (non-coding, different domains)
to establish that the model *does* separate genuinely different requests. If
controls don't cluster away from coding prompts, the experiment setup is broken.
"""

TONES = ["casual", "professional", "terse", "academic"]

TASKS = [
    {
        "id": "palindrome",
        "casual": "hey can u write me a python function that checks if a string is a palindrome",
        "professional": "Please write a Python function that checks whether a given string is a palindrome.",
        "terse": "python function check string palindrome",
        "academic": "I would appreciate your assistance in developing a Python function that evaluates whether a provided string exhibits palindromic properties.",
    },
    {
        "id": "sort_list",
        "casual": "yo write me a function that sorts a list of numbers from smallest to biggest",
        "professional": "Please implement a function that sorts a list of integers in ascending order.",
        "terse": "function sort integer list ascending",
        "academic": "Could you kindly provide an implementation of a function that arranges a list of integers in monotonically increasing order?",
    },
    {
        "id": "http_get",
        "casual": "can u make a function that fetches data from a url and returns the json",
        "professional": "Please write a Python function that performs an HTTP GET request to a given URL and returns the parsed JSON response.",
        "terse": "python function http get url return json",
        "academic": "I would be grateful if you could implement a Python function that executes an HTTP GET request to a specified URL and deserializes the JSON response body.",
    },
    {
        "id": "fibonacci",
        "casual": "write me a function that gives me the nth fibonacci number pls",
        "professional": "Please implement a function that returns the nth Fibonacci number.",
        "terse": "function return nth fibonacci number",
        "academic": "Would you be so kind as to implement a function that computes and returns the nth element of the Fibonacci sequence?",
    },
    {
        "id": "read_file",
        "casual": "hey make me a function that reads a text file and returns all the lines as a list",
        "professional": "Please write a function that reads a text file and returns its contents as a list of lines.",
        "terse": "function read file return list of lines",
        "academic": "I would like to request the development of a function that reads the entirety of a text file and returns its contents decomposed into a list of individual lines.",
    },
    {
        "id": "flatten_list",
        "casual": "can u make a function that takes a nested list and flattens it into one flat list",
        "professional": "Please implement a function that flattens a nested list structure into a single flat list.",
        "terse": "function flatten nested list",
        "academic": "Could you provide an implementation of a function that recursively traverses a nested list structure and produces a single-dimensional flattened list?",
    },
    {
        "id": "count_words",
        "casual": "write me something that counts how many times each word appears in a string",
        "professional": "Please write a function that counts the frequency of each word in a given string.",
        "terse": "function word frequency count string",
        "academic": "I would appreciate the implementation of a function that performs a lexical frequency analysis, counting the occurrences of each distinct word within a provided string.",
    },
    {
        "id": "binary_search",
        "casual": "hey can u do a binary search function for me that finds a number in a sorted list",
        "professional": "Please implement a binary search function that locates a target value in a sorted list.",
        "terse": "binary search function sorted list",
        "academic": "Would you kindly implement a function that performs the binary search algorithm to locate a specified target value within a pre-sorted list of elements?",
    },
    {
        "id": "reverse_string",
        "casual": "make a function that reverses a string without using the built in reverse stuff",
        "professional": "Please write a function that reverses a string without using built-in reverse methods.",
        "terse": "function reverse string no builtins",
        "academic": "I would like you to develop a function that produces the reverse of a given string, implemented without reliance on any built-in reversal methods or slicing shortcuts.",
    },
    {
        "id": "merge_dicts",
        "casual": "write me a function that merges two dictionaries together, if they have the same key use the second one",
        "professional": "Please implement a function that merges two dictionaries, with values from the second dictionary taking precedence on key conflicts.",
        "terse": "function merge two dicts second wins conflicts",
        "academic": "Could you implement a function that performs a union operation on two dictionaries, resolving key conflicts by giving precedence to the values contained in the second dictionary?",
    },
]


# Control prompts: different intents entirely (not coding tasks).
# These use the same 4 tones to verify that intent separation is stronger
# than tone separation. If controls don't land far from coding prompts,
# something is wrong with the experiment.
CONTROLS = [
    {
        "id": "ctrl_recipe",
        "casual": "hey whats a good recipe for chocolate chip cookies",
        "professional": "Could you provide a reliable recipe for chocolate chip cookies?",
        "terse": "chocolate chip cookie recipe",
        "academic": "I would appreciate a detailed formulation for the preparation of chocolate chip cookies, including precise ingredient quantities.",
    },
    {
        "id": "ctrl_history",
        "casual": "tell me about why the roman empire fell lol",
        "professional": "Please provide an overview of the primary factors that contributed to the fall of the Roman Empire.",
        "terse": "reasons roman empire fell",
        "academic": "Could you elucidate the principal socio-political and economic factors that precipitated the decline and eventual dissolution of the Western Roman Empire?",
    },
    {
        "id": "ctrl_travel",
        "casual": "yo whats fun to do in tokyo for a week",
        "professional": "Please suggest a one-week itinerary of activities and attractions in Tokyo.",
        "terse": "tokyo one week itinerary",
        "academic": "I would be grateful for a comprehensive recommendation of cultural, culinary, and recreational activities suitable for a week-long sojourn in Tokyo.",
    },
    {
        "id": "ctrl_fitness",
        "casual": "give me a simple workout plan for someone whos never been to a gym",
        "professional": "Please design a beginner-friendly workout plan for someone with no gym experience.",
        "terse": "beginner gym workout plan",
        "academic": "Would you kindly devise a structured physical exercise regimen tailored for an individual with no prior gymnasium experience?",
    },
    {
        "id": "ctrl_email",
        "casual": "help me write an email to my landlord about the broken heater",
        "professional": "Please draft a professional email to my landlord regarding a malfunctioning heating unit.",
        "terse": "email landlord broken heater",
        "academic": "I would like assistance composing a formal written correspondence to my landlord concerning the persistent malfunction of the residential heating apparatus.",
    },
]


def get_all_prompts():
    """Yield (task_id, tone, prompt_text, group) for every combination."""
    for task in TASKS:
        for tone in TONES:
            yield task["id"], tone, task[tone], "coding"
    for ctrl in CONTROLS:
        for tone in TONES:
            yield ctrl["id"], tone, ctrl[tone], "control"
