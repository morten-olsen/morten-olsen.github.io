require("lualibs.lua")
local file = io.open('../package.json')
local jsonstring = file:read('*a')
file:close()
jsondata =  utilities.json.tolua(jsonstring)

function addHeader()
  if jsondata["watermark"] ~= nil and jsondata["watermark"] ~= false then
    tex.print("\\usepackage{draftwatermark}")
    tex.print("\\SetWatermarkLightness{0.9}")
    tex.print("\\SetWatermarkScale{6}")
    if jsondata["watermark"] ~= true then
      tex.print("\\SetWatermarkText{" .. jsondata["watermark"] .. "}")
    end
  end
end
