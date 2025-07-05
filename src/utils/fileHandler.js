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
    
    // Mock particle data structure for demonstration
    const mockParticleData = {
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

    return {
      ...fileData,
      content: fileData.type === 'json' ? fileData.content : mockParticleData
    };
  }
}