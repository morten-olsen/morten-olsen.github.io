#!/usr/bin/env python3
"""agent.py — An AI agent is just a while loop."""
import json, os, subprocess, urllib.request
from pathlib import Path

URL = os.environ.get("AGENT_API_URL", "http://localhost:11434/v1/chat/completions")
KEY = os.environ.get("AGENT_API_KEY")
MODEL = os.environ.get("AGENT_MODEL", "gemma3")
SYSTEM = Path(__file__).with_name("system.md").read_text()
TOOL = {"type": "function", "function": {"name": "bash", "description": "Run a bash command",
    "parameters": {"type": "object", "properties": {"command": {"type": "string"}}, "required": ["command"]}}}

def call(messages):
    headers = {"Content-Type": "application/json", **({"Authorization": f"Bearer {KEY}"} if KEY else {})}
    body = json.dumps({"model": MODEL, "messages": [{"role": "system", "content": SYSTEM}] + messages, "tools": [TOOL]}).encode()
    return json.load(urllib.request.urlopen(urllib.request.Request(URL, body, headers)))["choices"][0]["message"]

messages = []
while (user := input("\033[1;34m> \033[0m")) != "exit":
    messages.append({"role": "user", "content": user})
    for _ in range(10):  # max tool rounds
        reply = call(messages)
        messages.append(reply)
        if not reply.get("tool_calls"):
            print(reply.get("content", ""))
            break
        for tc in reply["tool_calls"]:
            cmd = json.loads(tc["function"]["arguments"])["command"]
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            print(f"\033[2m$ {cmd}\n{result.stdout}{result.stderr}\033[0m")
            messages.append({"role": "tool", "tool_call_id": tc["id"], "content": result.stdout + result.stderr})
