"""
Code filler blocks for Experiment 2.

Each pattern has old-style code blocks (the thing being negated) that we insert
in increasing amounts between the instruction and the generation point.

Each block is ~50 tokens of realistic-looking code in the old style.
"""

# var declarations — old style JS
VAR_FILLERS = [
    '''var count = 0;
var items = [];
var result = null;
var isValid = false;
var temp = "";

function processData(data) {
    var output = [];
    var i;
    for (i = 0; i < data.length; i++) {
        var item = data[i];
        var transformed = item.toUpperCase();
        output.push(transformed);
    }
    var final = output.join(", ");
    return final;
}''',
    '''var config = {};
var defaults = { timeout: 3000, retries: 3 };
var settings = Object.assign({}, defaults, config);
var baseUrl = settings.baseUrl || "http://localhost";
var apiKey = settings.apiKey || "";

function makeRequest(endpoint) {
    var url = baseUrl + "/" + endpoint;
    var headers = { "Authorization": "Bearer " + apiKey };
    var options = { method: "GET", headers: headers };
    var response = fetch(url, options);
    return response;
}''',
    '''var users = [];
var activeCount = 0;
var inactiveCount = 0;

function filterUsers(list, status) {
    var filtered = [];
    var idx = 0;
    for (idx = 0; idx < list.length; idx++) {
        var user = list[idx];
        var userStatus = user.status;
        if (userStatus === status) {
            filtered.push(user);
        }
    }
    var total = filtered.length;
    return { users: filtered, count: total };
}''',
    '''var cache = {};
var maxAge = 60000;
var hits = 0;
var misses = 0;

function getCached(key) {
    var entry = cache[key];
    var now = Date.now();
    if (entry && (now - entry.time) < maxAge) {
        hits = hits + 1;
        var value = entry.value;
        return value;
    }
    misses = misses + 1;
    var fresh = fetchFromSource(key);
    var wrapped = { value: fresh, time: now };
    cache[key] = wrapped;
    return fresh;
}''',
    '''var errors = [];
var warnings = [];
var log = [];

function validate(input) {
    var isString = typeof input === "string";
    var isEmpty = input.length === 0;
    var hasSpaces = input.indexOf(" ") >= 0;
    var trimmed = input.trim();
    var length = trimmed.length;

    if (!isString) {
        var msg = "Input must be a string";
        errors.push(msg);
    }
    if (isEmpty) {
        var warn = "Input is empty";
        warnings.push(warn);
    }
    var valid = errors.length === 0;
    return { valid: valid, errors: errors, warnings: warnings };
}''',
    '''var queue = [];
var processing = false;
var batchSize = 10;

function enqueue(item) {
    var entry = { data: item, timestamp: Date.now() };
    queue.push(entry);
    var length = queue.length;
    if (length >= batchSize && !processing) {
        var batch = queue.splice(0, batchSize);
        processing = true;
        var result = processBatch(batch);
        processing = false;
        return result;
    }
    return null;
}''',
]

# callback style — old style Node.js
CALLBACK_FILLERS = [
    '''function readConfig(path, callback) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var parsed = JSON.parse(data);
        callback(null, parsed);
    });
}

function writeConfig(path, config, callback) {
    var data = JSON.stringify(config, null, 2);
    fs.writeFile(path, data, function(err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}''',
    '''function fetchUser(id, callback) {
    db.query('SELECT * FROM users WHERE id = ?', [id], function(err, rows) {
        if (err) {
            callback(err, null);
            return;
        }
        if (rows.length === 0) {
            callback(new Error('User not found'), null);
            return;
        }
        var user = rows[0];
        callback(null, user);
    });
}

function updateUser(id, data, callback) {
    db.query('UPDATE users SET ? WHERE id = ?', [data, id], function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result.affectedRows);
    });
}''',
    '''function processFile(inputPath, outputPath, callback) {
    fs.readFile(inputPath, 'utf8', function(err, content) {
        if (err) {
            callback(err);
            return;
        }
        var lines = content.split('\\n');
        var processed = lines.map(function(line) {
            return line.trim().toUpperCase();
        });
        var output = processed.join('\\n');
        fs.writeFile(outputPath, output, function(err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, processed.length);
        });
    });
}''',
    '''function downloadAndSave(url, dest, callback) {
    http.get(url, function(response) {
        var data = '';
        response.on('data', function(chunk) {
            data = data + chunk;
        });
        response.on('end', function() {
            fs.writeFile(dest, data, function(err) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, data.length);
            });
        });
        response.on('error', function(err) {
            callback(err);
        });
    });
}''',
    '''function listFiles(dir, callback) {
    fs.readdir(dir, function(err, files) {
        if (err) {
            callback(err, null);
            return;
        }
        var results = [];
        var pending = files.length;
        if (pending === 0) {
            callback(null, results);
            return;
        }
        files.forEach(function(file) {
            var fullPath = path.join(dir, file);
            fs.stat(fullPath, function(err, stat) {
                if (err) {
                    callback(err, null);
                    return;
                }
                results.push({ name: file, size: stat.size });
                pending = pending - 1;
                if (pending === 0) {
                    callback(null, results);
                }
            });
        });
    });
}''',
    '''function retry(fn, attempts, delay, callback) {
    fn(function(err, result) {
        if (!err) {
            callback(null, result);
            return;
        }
        if (attempts <= 1) {
            callback(err, null);
            return;
        }
        setTimeout(function() {
            retry(fn, attempts - 1, delay, callback);
        }, delay);
    });
}''',
]


# const/let declarations — NEW style JS (control condition for exp3)
# Same logic as VAR_FILLERS but using const/let. If the model still fails to
# refactor with these in context, the problem is context length, not pattern copying.
CONST_FILLERS = [
    '''const count = 0;
const items = [];
let result = null;
let isValid = false;
let temp = "";

function processData(data) {
    const output = [];
    let i;
    for (i = 0; i < data.length; i++) {
        const item = data[i];
        const transformed = item.toUpperCase();
        output.push(transformed);
    }
    const final = output.join(", ");
    return final;
}''',
    '''const config = {};
const defaults = { timeout: 3000, retries: 3 };
const settings = Object.assign({}, defaults, config);
const baseUrl = settings.baseUrl || "http://localhost";
const apiKey = settings.apiKey || "";

function makeRequest(endpoint) {
    const url = baseUrl + "/" + endpoint;
    const headers = { "Authorization": "Bearer " + apiKey };
    const options = { method: "GET", headers: headers };
    const response = fetch(url, options);
    return response;
}''',
    '''const users = [];
let activeCount = 0;
let inactiveCount = 0;

function filterUsers(list, status) {
    const filtered = [];
    let idx = 0;
    for (idx = 0; idx < list.length; idx++) {
        const user = list[idx];
        const userStatus = user.status;
        if (userStatus === status) {
            filtered.push(user);
        }
    }
    const total = filtered.length;
    return { users: filtered, count: total };
}''',
    '''const cache = {};
const maxAge = 60000;
let hits = 0;
let misses = 0;

function getCached(key) {
    const entry = cache[key];
    const now = Date.now();
    if (entry && (now - entry.time) < maxAge) {
        hits = hits + 1;
        const value = entry.value;
        return value;
    }
    misses = misses + 1;
    const fresh = fetchFromSource(key);
    const wrapped = { value: fresh, time: now };
    cache[key] = wrapped;
    return fresh;
}''',
    '''const errors = [];
const warnings = [];
const log = [];

function validate(input) {
    const isString = typeof input === "string";
    const isEmpty = input.length === 0;
    const hasSpaces = input.indexOf(" ") >= 0;
    const trimmed = input.trim();
    const length = trimmed.length;

    if (!isString) {
        const msg = "Input must be a string";
        errors.push(msg);
    }
    if (isEmpty) {
        const warn = "Input is empty";
        warnings.push(warn);
    }
    const valid = errors.length === 0;
    return { valid: valid, errors: errors, warnings: warnings };
}''',
    '''const queue = [];
let processing = false;
const batchSize = 10;

function enqueue(item) {
    const entry = { data: item, timestamp: Date.now() };
    queue.push(entry);
    const length = queue.length;
    if (length >= batchSize && !processing) {
        const batch = queue.splice(0, batchSize);
        processing = true;
        const result = processBatch(batch);
        processing = false;
        return result;
    }
    return null;
}''',
]


FILLERS = {
    "var_declarations": VAR_FILLERS,
    "callbacks": CALLBACK_FILLERS,
    "const_declarations": CONST_FILLERS,
}
