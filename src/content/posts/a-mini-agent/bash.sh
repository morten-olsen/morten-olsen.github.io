#!/usr/bin/env bash
# agent.sh — A complete AI agent in ~60 lines of shell script.
# Usage: source agent.sh && agent [session-id]
#    or: source agent.sh && prompt_ai "one-shot question" [session-id]

MODEL="${AGENT_MODEL:-gemma4:e2b}"
API_URL="${AGENT_API_URL:-http://localhost:11434/v1/chat/completions}"
API_KEY="${AGENT_API_KEY:-}"
SESSIONS_DIR="${AGENT_SESSIONS_DIR:-/tmp/agent-sessions}"
SYSTEM_PROMPT_FILE="$(dirname "${BASH_SOURCE[0]:-$0}")/system.md"
MAX_ITERATIONS="${AGENT_MAX_ITER:-10}"

BASH_TOOL='{"type":"function","function":{"name":"bash","description":"Run a bash command on the system and return its output","parameters":{"type":"object","properties":{"command":{"type":"string","description":"The bash command to execute"}},"required":["command"]}}}'

# Helpers: write JSON in-place & extract fields from compact JSON
_update() {
  local f="$1"
  shift
  jq "$@" "$f" >"$f.tmp" && mv "$f.tmp" "$f"
}
_jq() { printf '%s' "$1" | jq -r "$2"; }

prompt_ai() {
  local prompt="$1" session="${2:-default}"
  local sf="$SESSIONS_DIR/$session.json"
  local system_prompt iterations=0
  local response choice has_tools call id cmd output confirm

  mkdir -p "$SESSIONS_DIR"
  system_prompt=$(cat "$SYSTEM_PROMPT_FILE")
  [[ -f "$sf" ]] || echo '[]' >"$sf"

  _update "$sf" --arg msg "$prompt" '. + [{"role":"user","content":$msg}]'

  while true; do
    # Call the API
    response=$(jq -n \
      --arg model "$MODEL" --arg sys "$system_prompt" \
      --slurpfile msgs "$sf" --argjson tool "$BASH_TOOL" \
      '{model:$model, messages:[{role:"system",content:$sys}]+$msgs[0], tools:[$tool]}' |
      curl -s "$API_URL" -H "Content-Type: application/json" \
        ${API_KEY:+-H "Authorization: Bearer $API_KEY"} -d @-)

    choice=$(_jq "$response" '.choices[0].message | tojson')
    _update "$sf" --argjson msg "$choice" '. + [$msg]'

    has_tools=$(_jq "$choice" '.tool_calls | length // 0')
    if [[ "$has_tools" -eq 0 ]]; then
      _jq "$choice" '.content'
      break
    fi

    iterations=$((iterations + 1))
    if [[ $iterations -ge $MAX_ITERATIONS ]]; then
      echo "[agent] Stopped after $MAX_ITERATIONS iterations."
      _jq "$choice" '.content // empty'
      break
    fi

    # Execute tool calls
    while read -r call; do
      id=$(_jq "$call" '.id')
      cmd=$(_jq "$call" '.function.arguments | fromjson .command')

      printf '\033[1m$ %s\033[0m  Run? [Y/n] ' "$cmd"
      read -r confirm </dev/tty
      if [[ "$confirm" =~ ^[Nn] ]]; then
        output="[user declined to run this command]"
      else
        output=$(bash -c "$cmd" 2>&1)
        printf '\033[2m%s\033[0m\n' "$output"
      fi

      _update "$sf" --arg id "$id" --arg out "$output" \
        '. + [{"role":"tool","tool_call_id":$id,"content":$out}]'
    done < <(_jq "$choice" '.tool_calls[] | tojson')
  done
}

agent() {
  local session="${1:-$(date +%s)}" input
  echo "Agent session: $session (type 'exit' to quit)"
  while true; do
    printf '\033[1;34m> \033[0m'
    read -r input </dev/tty || break
    [[ "$input" == "exit" ]] && break
    [[ -z "$input" ]] && continue
    prompt_ai "$input" "$session"
  done
}
