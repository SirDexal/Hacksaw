import { getColor } from './colorHandler';

export class FileHandler {
  static async readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Try to parse as JSON first
          const content = JSON.parse(e.target.result);
          resolve({
            name: file.name,
            path: file.name,
            content: content,
            type: 'json'
          });
        } catch (error) {
          // If not JSON, treat as binary
          resolve({
            name: file.name,
            path: file.name,
            content: e.target.result,
            type: 'binary'
          });
        }
      };
      reader.onerror = reject;
      
      if (file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  static downloadFile(content, filename, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async processParticleFile(file) {
    const fileData = await this.readFile(file);
    
    // If it's already JSON, use it directly, otherwise create a basic structure
    if (fileData.type === 'json') {
      return fileData;
    }

    // For binary files, create a mock structure for demonstration
    const mockParticleData = this.createMockParticleData();
    return {
      ...fileData,
      content: mockParticleData
    };
  }

  static createMockParticleData() {
    return {
      entries: {
        value: {
          items: [
            {
              key: 'VfxSystemDefinitionData',
              value: {
                name: 'VfxSystemDefinitionData',
                items: [
                  {
                    key: 'particleName',
                    value: 'SampleParticle'
                  },
                  {
                    key: 'complexEmitterDefinitionData',
                    value: {
                      items: [
                        {
                          items: [
                            {
                              key: 'emitterName',
                              value: 'SampleEmitter'
                            },
                            {
                              key: 'color',
                              value: {
                                items: [
                                  {
                                    key: 'constantValue',
                                    type: 'vec4',
                                    value: [1, 0.5, 0.25, 1]
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      linked: {
        value: {
          items: []
        }
      }
    };
  }

  static extractParticlesFromFile(fileContent) {
    const particles = [];
    
    if (fileContent?.entries?.value?.items) {
      fileContent.entries.value.items.forEach((container, index) => {
        if (this.isVfxSystemDefinition(container)) {
          const particleName = this.getParticleName(container) || `Unknown Particle ${index}`;
          const emitters = this.extractEmittersFromContainer(container);
          
          particles.push({
            id: container.key || index,
            name: particleName,
            emitters,
            selected: false,
            container: container
          });
        }
      });
    }
    
    return particles;
  }

  static isVfxSystemDefinition(container) {
    return container.value?.name === 'VfxSystemDefinitionData' || 
           container.value?.name === 'vfxsystemdefinitiondata' ||
           this.fnvCheck(container.value?.name, 'VfxSystemDefinitionData');
  }

  static getParticleName(container) {
    return container.value.items?.find(
      item => item.key === 'particleName' || 
               this.fnvCheck(item.key, 'particleName')
    )?.value;
  }

  static extractEmittersFromContainer(container) {
    const emitters = [];
    const complexEmitters = container.value.items?.filter(
      item => item.key === 'complexEmitterDefinitionData' || 
             item.key === 'simpleEmitterDefinitionData' ||
             this.fnvCheck(item.key, 'complexEmitterDefinitionData') ||
             this.fnvCheck(item.key, 'simpleEmitterDefinitionData')
    ) || [];
    
    complexEmitters.forEach(emitterDef => {
      emitterDef.value.items?.forEach((emitter, index) => {
        const emitterName = emitter.items?.find(
          item => item.key === 'emitterName' || this.fnvCheck(item.key, 'emitterName')
        )?.value || `Unknown Emitter ${index}`;
        
        emitters.push({
          id: `${container.key}_${index}`,
          name: emitterName,
          colors: this.extractColorsFromEmitter(emitter.items),
          selected: false,
          emitterData: emitter
        });
      });
    });
    
    return emitters;
  }

  static extractColorsFromEmitter(emitterItems) {
    const colors = {};
    
    emitterItems?.forEach(item => {
      // Main color
      if (item.key === 'color' || this.fnvCheck(item.key, 'color')) {
        const colorData = getColor(item.value?.items);
        if (colorData.length > 0) {
          colors.main = colorData[0].toHex();
        }
      }
      
      // Birth color
      if (item.key === 'birthColor' || this.fnvCheck(item.key, 'birthColor')) {
        const colorData = getColor(item.value?.items);
        if (colorData.length > 0) {
          colors.bc = colorData[0].toHex();
        }
      }
      
      // Linger color
      if (item.key === 'lingerColor' || this.fnvCheck(item.key, 'lingerColor')) {
        const colorData = getColor(item.value?.items);
        if (colorData.length > 0) {
          colors.lc = colorData[0].toHex();
        }
      }
      
      // Reflection definition colors
      if (item.key === 'reflectionDefinition' || this.fnvCheck(item.key, 'reflectionDefinition')) {
        const reflectionItems = item.value?.items || [];
        
        reflectionItems.forEach(refItem => {
          if (refItem.key === 'fresnelColor' || this.fnvCheck(refItem.key, 'fresnelColor')) {
            const colorData = getColor([refItem]);
            if (colorData.length > 0) {
              colors.oc = colorData[0].toHex();
            }
          }
          
          if (refItem.key === 'reflectionFresnelColor' || this.fnvCheck(refItem.key, 'reflectionFresnelColor')) {
            const colorData = getColor([refItem]);
            if (colorData.length > 0) {
              colors.rc = colorData[0].toHex();
            }
          }
        });
      }
    });
    
    return colors;
  }

  static fnvCheck(x, y) {
    if (!x || !y) return false;
    return x.toString().toLowerCase() === y.toLowerCase() || 
           x === this.fnv1a(y.toLowerCase());
  }

  static fnv1a(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash;
  }
}