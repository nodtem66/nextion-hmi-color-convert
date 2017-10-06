var options = {
  valueElement: null,
  width: 300,
  height: 120,
  sliderSize: 20,
  position: 'top',
  borderColor: '#CCC',
  insetColor: '#CCC',
  backgroundColor: '#202020'
};

var pickers = {};

pickers.bgcolor = new jscolor('bgcolor-button', options);
pickers.bgcolor.onFineChange = "update('bgcolor')";
pickers.bgcolor.fromString('AB2567');

pickers.fgcolor = new jscolor('fgcolor-button', options);
pickers.fgcolor.onFineChange = "update('fgcolor')";
pickers.fgcolor.fromString('FFFFFF');

function update (id) {
  document.getElementById('demo-preview').style.backgroundColor =
    pickers.bgcolor.toHEXString();

  document.getElementById('demo-preview').style.color =
  document.getElementById('demo-preview').style.borderColor =
  pickers.fgcolor.toHEXString();

  document.getElementById(id + '-rgb').value = pickers[id].toRGBString();
  document.getElementById(id + '-hex').value = pickers[id].toHEXString();

  document.getElementById(id + '-hue').value = Math.round(pickers[id].hsv[0]);
  document.getElementById(id + '-sat').value = Math.round(pickers[id].hsv[1]);
  document.getElementById(id + '-val').value = Math.round(pickers[id].hsv[2]);

  document.getElementById(id + '-red').value = Math.round(pickers[id].rgb[0]);
  document.getElementById(id + '-grn').value = Math.round(pickers[id].rgb[1]);
  document.getElementById(id + '-blu').value = Math.round(pickers[id].rgb[2]);
  

  document.getElementById(id + '-nextion').value = RGB2Nextion(pickers[id].rgb[0], pickers[id].rgb[1], pickers[id].rgb[2]);
}

function setHSV (id, h, s, v) {
  pickers[id].fromHSV(h, s, v);
  update(id);
}

function setRGB (id, r, g, b) {
  pickers[id].fromRGB(r, g, b);
  update(id);
}

function setString (id, str) {
  pickers[id].fromString(str);
  update(id);
}

function RGB2Nextion(red, green, blue) {
  //red -=  Math.round(red*7/0x1F);
  //green -= Math.round(green*7/0x3F);
  //blue -= Math.round(blue*7/0x1F);
  return ((red >> 3) << 11) + ((green >> 2) << 5) + (blue >> 3);
}

function setNextionColor (id, str) {
  var color16bit = +str;
  if (color16bit == NaN) return;
  // accoring to vinayharne's answer in http://support.iteadstudio.com/support/discussions/topics/11000008693
  // use convert algorithm in binary operation
  var red = (color16bit >> 11) << 3;
  var green = ((color16bit >> 5) & 0x3F) << 2;
  var blue = (color16bit & 0x1F) << 3;
  
  // according to Nextion HMI: Color Code List
  // RED	63488	Red = rbg(255,255,255)
  // BLUE	31	Blue
  // GRAY	33840	Gray
  // BLACK	0	Black
  // WHITE	65535	White
  // GREEN	2016	Green
  // BROWN	48192	Brown
  // YELLOW	65504	Yellow
  // compensate RBG value from linear relation 
  // note that b111 = 0x7, b11111 = 0x1F, b111111 = 0x3F
  red +=  Math.round(red*7/0x1F);
  green += Math.round(green*7/0x3F);
  blue += Math.round(blue*7/0x1F);
	pickers[id].fromRGB(red, green, blue);
  update(id);
}

update('bgcolor');
update('fgcolor');

window.update = update;
window.setHSV = setHSV;
window.setString = setString;
window.setRGB = setRGB;
window.setNextionColor = setNextionColor;