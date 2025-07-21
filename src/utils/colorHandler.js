export class ColorHandler {
  constructor(vec4 = [Math.random(), Math.random(), Math.random(), Math.random()], time = 0) {
    this.r = Math.round(vec4[0] * 255);
    this.g = Math.round(vec4[1] * 255);
    this.b = Math.round(vec4[2] * 255);
    this.a = Math.round(vec4[3] * 100);
    this.vec4 = this.toVec4();
    this.time = time;
  }

  inputHex(hex) {
    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);
    this.vec4 = this.toVec4();
  }

  inputAlpha(alpha) {
    this.a = alpha;
    this.vec4[3] = alpha / 100;
  }

  inputVec4(vec4) {
    this.r = Math.round(vec4[0] * 255);
    this.g = Math.round(vec4[1] * 255);
    this.b = Math.round(vec4[2] * 255);
    this.a = Math.round(vec4[3] * 100);
    this.vec4 = this.toVec4();
  }

  toHSL() {
    let [r, g, b] = [this.vec4[0], this.vec4[1], this.vec4[2]];
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, l];
  }

  hslShift(hue = 0, sat = 0, lig = 0) {
    let hsl = this.toHSL();
    hue = Math.abs(hue) >= 360 ? hue % 360 : hue;
    hsl[0] += hue / 360;
    let [h, s, l] = hsl;
    s = Math.min(Math.max(s + sat / 100, 0.01), 1);
    l = Math.min(Math.max(l + lig / 100, 0.01), 1);
    this.inputHSL([h, s, l]);
  }

  inputHSL(hsl) {
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    this.inputVec4([r, g, b, this.a / 100]);
  }

  toHex() {
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(this.r) + toHex(this.g) + toHex(this.b);
  }

  toVec4() {
    return [this.r / 255, this.g / 255, this.b / 255, this.a / 100];
  }

  setTime(time) {
    this.time = time;
    this.vec4 = this.toVec4();
  }

  // Additional methods for compatibility
  SetTime(time) {
    return this.setTime(time);
  }

  ToHEX() {
    return this.toHex();
  }

  ToVec4() {
    return this.toVec4();
  }

  HSLShift(hue, sat, lig) {
    return this.hslShift(hue, sat, lig);
  }

  InputHex(hex) {
    return this.inputHex(hex);
  }

  InputVec4(vec4) {
    return this.inputVec4(vec4);
  }
}

export function toBG(palette) {
  if (palette.length === 1) {
    return `${palette[0].toHex()} ${palette[0].time * 100}%`;
  } else if (palette.length > 1) {
    let result = [];
    for (let i = 0; i < palette.length; i++) {
      result.push(`${palette[i].toHex()} ${Math.round(palette[i].time * 100)}%`);
    }
    return `linear-gradient(0.25turn, ${result.join(', ')})`;
  }
  return '#000000';
}

// Alias for compatibility
export function ToBG(palette) {
  return toBG(palette);
}

export function getColor(property) {
  if (property?.type === 'vec4') {
    return [new ColorHandler(property.value)];
  }
  
  let DynID = property?.findIndex?.((item) => item.key === 'dynamics' || item.key === 3154345447);
  let ConstID = property?.findIndex?.((item) => item.key === 'constantValue' || item.key === 3031705514);
  
  if (DynID >= 0) {
    let ProbTableID = property[DynID].value.items.findIndex((item) =>
      item.key === 'probabilityTables'
    );
    if (ProbTableID >= 0) property[DynID].value.items.shift();
  }
  
  let Palette = [];

  if (DynID >= 0) {
    let Dynamics = property[DynID].value.items;
    let DynTimes = Dynamics[0]?.value.items || [];
    let DynColors = Dynamics[1]?.value.items || [];
    for (let i = 0; i < DynTimes.length; i++) {
      Palette.push(new ColorHandler(DynColors[i], DynTimes[i]));
    }
  } else if (ConstID >= 0) {
    let Constant = property[ConstID].value;
    Palette.push(new ColorHandler(Constant));
  }
  
  return Palette.length > 0 ? Palette : [new ColorHandler()];
}

// Alias for compatibility
export function GetColor(property) {
  return getColor(property);
}

// Utility functions for color checking
export function isBW(A, B, C) {
  return A === B && B === C ? A === 0 || A === 1 : false;
}

export function clamp(num, min = 0, max = 1) {
  return Math.min(Math.max(num, min), max);
}