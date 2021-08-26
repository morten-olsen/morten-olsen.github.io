require("lualibs.lua")
local file = io.open('../data.json')
local jsonstring = file:read('*a')
file:close()
jsondata =  utilities.json.tolua(jsonstring)

local function switch(a, case)
  local value = a
  local switchcase = {}

  switchcase["info"] = function()
    tex.print("\\begin{cvtitle}{" .. value["name"] .. "}{../" .. value["image"] .. "}")
  	for key, value in pairs(value["info"]) do
  		tex.print("\\cvinfo{" .. value["name"] .. "}{" .. value["value"] .. "}")
    end
    
  	tex.print("\\end{cvtitle}")
  end

  switchcase["text"] = function()
    tex.print("\\begin{columns}")
  	tex.print("\\section*{" .. value["title"] .. "}")
  	tex.print("\\begin{markdown}")
  	tex.print(value["content"])
  	tex.print("\\end{markdown}")
  	tex.print("\\end{columns}")
  end

  switchcase["skills"] = function()
    tex.print("\\section*{" .. value["title"] .. "}")
  	tex.print(value["description"] .. "\\\\\\\\")
  	tex.print("\\begin{cvskills}")
    for key, value in pairs(value["skills"]) do
    	tex.print('\\cvskill{' .. value["title"] .. '}{' .. value["level"] .. '}')
    end
  	tex.print("\\end{cvskills}")
  end

  switchcase["experiences"] = function()
    tex.print("\\section*{" .. value["title"] .. "}")
    for key, value in pairs(value["positions"]) do
    	tex.print("\\begin{cvexp}{" .. value["company"]["name"] .. "}{" .. value["startDate"] .. "}{" .. value["endDate"] .. "}{" .. value["title"] .. "}")
    	tex.print("\\begin{markdown}")
    	tex.print(value["description"])
    	tex.print("\\end{markdown}")
    	tex.print("\\end{cvexp}")
    end
  end

  switchcase["projects"] = function()
    tex.print("\\section*{" .. value["title"] .. "}")
  	tex.print(value["description"] .. "\\\\\\hrule")
    for key, value in pairs(value["projects"]) do
    	tex.print("\\begin{cvproj}{" .. value["name"] .. "}{" .. value["url"] .. "}{" .. value["tagline"] .. "}")
    	tex.print("\\begin{markdown}")
    	tex.print(value["description"])
    	tex.print("\\end{markdown}")
    	tex.print("\\end{cvproj}")
    end
  end

  if switchcase[case] == nil then
    tex.print("type " .. case .. "dont exist \\\\\\\\")
  else
    switchcase[case]()
  end
end

function render()
  for key, value in pairs(jsondata) do
  	switch(value["data"], value["type"])
  end
end
