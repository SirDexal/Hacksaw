import { ColorHandler, isBW } from './colorHandler';

export class RecolorEngine {
  constructor(settings = {}) {
    this.settings = {
      mode: 'linear',
      ignoreBW: true,
      targets: [true, true, true, true, true], // OC, RC, LC, BC, Main
      ...settings
    };
  }

  recolorProperty(colorProp, palette, isConstantOnly = false) {
    if (isConstantOnly) {
      return this.recolorConstant(colorProp, palette);
    }

    let PropType = colorProp.value?.items;
    if (!PropType) return colorProp;

    let ConstID = PropType.findIndex((item) => 
      item.key === 'constantValue' || item.key === 3031705514
    );
    let DynID = PropType.findIndex((item) => 
      item.key === 'dynamics' || item.key === 3154345447
    );

    switch (this.settings.mode) {
      case 'random':
        return this.applyRandomColors(colorProp, palette, ConstID, DynID);
      case 'linear':
        return this.applyLinearColors(colorProp, palette, ConstID, DynID);
      case 'wrap':
        return this.applyWrapColors(colorProp, palette, ConstID, DynID);
      case 'semi-override':
        return this.applySemiOverride(colorProp, palette, ConstID, DynID);
      case 'shift':
        return this.applyShiftColors(colorProp, palette, ConstID, DynID);
      case 'inverse':
        return this.applyInverseColors(colorProp, palette, ConstID, DynID);
      default:
        return colorProp;
    }
  }

  recolorConstant(colorProp, palette) {
    let newColor;
    
    switch (this.settings.mode) {
      case 'random':
        newColor = palette[Math.floor(Math.random() * palette.length)].vec4;
        break;
      case 'linear':
      case 'wrap':
      case 'semi-override':
        newColor = palette[0].vec4;
        break;
      case 'inverse':
        newColor = [
          1 - colorProp.value[0],
          1 - colorProp.value[1],
          1 - colorProp.value[2],
          colorProp.value[3],
        ];
        break;
      case 'shift':
        // HSL shift would be applied here
        newColor = colorProp.value;
        break;
      default:
        newColor = colorProp.value;
    }

    if (this.settings.mode !== 'semi-override' && 
        !(this.settings.ignoreBW && isBW(colorProp.value[0], colorProp.value[1], colorProp.value[2]))) {
      colorProp.value[0] = newColor[0];
      colorProp.value[1] = newColor[1];
      colorProp.value[2] = newColor[2];
    }

    return colorProp;
  }

  applyRandomColors(colorProp, palette, ConstID, DynID) {
    if (DynID >= 0) {
      let DynValue = colorProp.value.items[DynID].value.items;
      let DynColors = DynValue[1]?.value.items || [];

      for (let i = 0; i < DynColors.length; i++) {
        if (!(this.settings.ignoreBW && isBW(DynColors[i][0], DynColors[i][1], DynColors[i][2]))) {
          let newColor = palette[Math.floor(Math.random() * palette.length)].vec4;
          DynColors[i][0] = newColor[0];
          DynColors[i][1] = newColor[1];
          DynColors[i][2] = newColor[2];
        }
      }
    } else if (ConstID >= 0) {
      let newColor = palette[Math.floor(Math.random() * palette.length)].vec4;
      if (!(this.settings.ignoreBW && 
            isBW(colorProp.value.items[ConstID].value[0], 
                 colorProp.value.items[ConstID].value[1], 
                 colorProp.value.items[ConstID].value[2]))) {
        colorProp.value.items[ConstID].value[0] = newColor[0];
        colorProp.value.items[ConstID].value[1] = newColor[1];
        colorProp.value.items[ConstID].value[2] = newColor[2];
      }
    }

    return colorProp;
  }

  applyLinearColors(colorProp, palette, ConstID, DynID) {
    // Convert to dynamic if needed for multiple colors
    if (palette.length > 1 && DynID < 0) {
      colorProp = this.convertToDynamic(colorProp, ConstID);
      DynID = colorProp.value.items.findIndex((item) => 
        item.key === 'dynamics' || item.key === 3154345447
      );
    } else if (palette.length === 1 && ConstID < 0) {
      colorProp = this.convertToConstant(colorProp, DynID);
      ConstID = colorProp.value.items.findIndex((item) => 
        item.key === 'constantValue' || item.key === 3031705514
      );
    }

    if (DynID >= 0) {
      let DynValue = colorProp.value.items[DynID].value.items;
      let DynTimes = DynValue[0]?.value.items || [];
      let DynColors = DynValue[1]?.value.items || [];

      for (let i = 0; i < DynTimes.length; i++) {
        let colorIndex = Math.min(i, palette.length - 1);
        let newColor = palette[colorIndex].vec4;
        
        if (!(this.settings.ignoreBW && isBW(DynColors[i][0], DynColors[i][1], DynColors[i][2]))) {
          DynColors[i][0] = newColor[0];
          DynColors[i][1] = newColor[1];
          DynColors[i][2] = newColor[2];
        }
      }
    } else if (ConstID >= 0) {
      let newColor = palette[0].vec4;
      if (!(this.settings.ignoreBW && 
            isBW(colorProp.value.items[ConstID].value[0], 
                 colorProp.value.items[ConstID].value[1], 
                 colorProp.value.items[ConstID].value[2]))) {
        colorProp.value.items[ConstID].value[0] = newColor[0];
        colorProp.value.items[ConstID].value[1] = newColor[1];
        colorProp.value.items[ConstID].value[2] = newColor[2];
        colorProp.value.items[ConstID].value[3] = newColor[3];
      }
    }

    return colorProp;
  }

  applyWrapColors(colorProp, palette, ConstID, DynID) {
    if (DynID >= 0) {
      let DynValue = colorProp.value.items[DynID].value.items;
      let DynColors = DynValue[1]?.value.items || [];

      for (let i = 0; i < DynColors.length; i++) {
        let colorIndex = i % palette.length;
        let newColor = palette[colorIndex].vec4;
        
        if (!(this.settings.ignoreBW && isBW(DynColors[i][0], DynColors[i][1], DynColors[i][2]))) {
          DynColors[i][0] = newColor[0];
          DynColors[i][1] = newColor[1];
          DynColors[i][2] = newColor[2];
        }
      }
    }

    return colorProp;
  }

  applySemiOverride(colorProp, palette, ConstID, DynID) {
    // Convert to dynamic if needed
    if (palette.length > 1 && DynID < 0) {
      colorProp = this.convertToDynamic(colorProp, ConstID);
      DynID = colorProp.value.items.findIndex((item) => 
        item.key === 'dynamics' || item.key === 3154345447
      );
    }

    if (DynID >= 0) {
      let DynValue = colorProp.value.items[DynID].value.items;
      let DynTimes = DynValue[0]?.value.items || [];
      let DynColors = DynValue[1]?.value.items || [];

      for (let i = 0; i < palette.length; i++) {
        let newColor = palette[i].vec4;
        if (DynColors[i] === undefined) {
          DynColors.push([
            newColor[0],
            newColor[1],
            newColor[2],
            Math.sqrt(1 - 4 * ((1 / (palette.length - 1)) * i - 0.5) ** 2),
          ]);
        } else {
          DynColors[i][0] = newColor[0];
          DynColors[i][1] = newColor[1];
          DynColors[i][2] = newColor[2];
          DynColors[i][3] = Math.sqrt(1 - 4 * ((1 / (palette.length - 1)) * i - 0.5) ** 2);
        }
        DynTimes[i] = (1 / (palette.length - 1)) * i;
      }
    }

    return colorProp;
  }

  applyShiftColors(colorProp, palette, ConstID, DynID, hslShift = { h: 0, s: 0, l: 0 }) {
    if (DynID >= 0) {
      let DynValue = colorProp.value.items[DynID].value.items;
      let DynColors = DynValue[1]?.value.items || [];

      for (let i = 0; i < DynColors.length; i++) {
        let colorHandler = new ColorHandler(DynColors[i]);
        colorHandler.hslShift(hslShift.h, hslShift.s, hslShift.l);
        
        if (!(this.settings.ignoreBW && isBW(DynColors[i][0], DynColors[i][1], DynColors[i][2]))) {
          DynColors[i][0] = colorHandler.vec4[0];
          DynColors[i][1] = colorHandler.vec4[1];
          DynColors[i][2] = colorHandler.vec4[2];
        }
      }
    } else if (ConstID >= 0) {
      let colorHandler = new ColorHandler(colorProp.value.items[ConstID].value);
      colorHandler.hslShift(hslShift.h, hslShift.s, hslShift.l);
      
      if (!(this.settings.ignoreBW && 
            isBW(colorProp.value.items[ConstID].value[0], 
                 colorProp.value.items[ConstID].value[1], 
                 colorProp.value.items[ConstID].value[2]))) {
        colorProp.value.items[ConstID].value[0] = colorHandler.vec4[0];
        colorProp.value.items[ConstID].value[1] = colorHandler.vec4[1];
        colorProp.value.items[ConstID].value[2] = colorHandler.vec4[2];
        colorProp.value.items[ConstID].value[3] = colorHandler.vec4[3];
      }
    }

    return colorProp;
  }

  applyInverseColors(colorProp, palette, ConstID, DynID) {
    if (DynID >= 0) {
      let DynValue = colorProp.value.items[DynID].value.items;
      let DynColors = DynValue[1]?.value.items || [];

      for (let i = 0; i < DynColors.length; i++) {
        let newColor = [
          1 - DynColors[i][0],
          1 - DynColors[i][1],
          1 - DynColors[i][2],
          DynColors[i][3],
        ];
        
        if (!(this.settings.ignoreBW && isBW(DynColors[i][0], DynColors[i][1], DynColors[i][2]))) {
          DynColors[i][0] = newColor[0];
          DynColors[i][1] = newColor[1];
          DynColors[i][2] = newColor[2];
        }
      }
    } else if (ConstID >= 0) {
      let newColor = [
        1 - colorProp.value.items[ConstID].value[0],
        1 - colorProp.value.items[ConstID].value[1],
        1 - colorProp.value.items[ConstID].value[2],
        colorProp.value.items[ConstID].value[3],
      ];

      if (!(this.settings.ignoreBW && 
            isBW(colorProp.value.items[ConstID].value[0], 
                 colorProp.value.items[ConstID].value[1], 
                 colorProp.value.items[ConstID].value[2]))) {
        colorProp.value.items[ConstID].value[0] = newColor[0];
        colorProp.value.items[ConstID].value[1] = newColor[1];
        colorProp.value.items[ConstID].value[2] = newColor[2];
        colorProp.value.items[ConstID].value[3] = newColor[3];
      }
    }

    return colorProp;
  }

  convertToDynamic(colorProp, ConstID) {
    const blankDynamic = {
      key: "dynamics",
      type: "pointer",
      value: {
        items: [
          { key: "1567157941", type: "list", value: { items: [], valueType: "f32" } },
          { key: "877087803", type: "list", value: { items: [], valueType: "vec4" } }
        ],
        name: "1128908277"
      }
    };

    if (ConstID >= 0) {
      colorProp.value.items[ConstID] = blankDynamic;
    } else {
      colorProp.value.items.push(blankDynamic);
    }

    return colorProp;
  }

  convertToConstant(colorProp, DynID) {
    const blankConstant = {
      key: "constantValue",
      type: "vec4",
      value: [0.5, 0.5, 0.5, 1]
    };

    if (DynID >= 0) {
      colorProp.value.items[DynID] = blankConstant;
    } else {
      colorProp.value.items.push(blankConstant);
    }

    return colorProp;
  }
}