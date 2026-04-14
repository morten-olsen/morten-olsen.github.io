import json as j,os,subprocess as s,urllib.request as u
E=os.environ;m=[];Z=open((os.path.dirname(__file__)or".")+"/system.md").read()
T={"type":"function","function":{"name":"bash","description":"x","parameters":{"type":"object","properties":{"command":{"type":"string"}},"required":["command"]}}}
def q():return j.load(u.urlopen(u.Request(E["U"],j.dumps({"model":E["M"],"messages":[{"role":"system","content":Z}]+m,"tools":[T]}).encode(),{"Content-Type":"application/json"})))["choices"][0]["message"]
while(i:=input("> "))!="x":
 m+=[{"role":"user","content":i}]
 for _ in"x"*9:
  m+=[r:=q()]
  if not r.get("tool_calls"):print(r.get("content",""));break
  for c in r["tool_calls"]:d=j.loads(c["function"]["arguments"])["command"];o=s.run(d,shell=1,capture_output=1,text=1);print(f"$ {d}\n{o.stdout}{o.stderr}");m+=[{"role":"tool","tool_call_id":c["id"],"content":o.stdout+o.stderr}]
