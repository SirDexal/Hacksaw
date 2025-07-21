// FNV-1a hash implementation for compatibility with original Hacksaw
export function fnv1a(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}

// String prototype extension for compatibility
export function extendPrototypes() {
  if (!String.prototype.fnv) {
    Object.defineProperty(String.prototype, 'fnv', {
      value: function (expected) {
        return (
          expected.toLowerCase() === this.toLowerCase() ||
          fnv1a(expected.toLowerCase()) === parseInt(this)
        );
      },
      enumerable: false,
    });
  }

  if (!Number.prototype.fnv) {
    Object.defineProperty(Number.prototype, 'fnv', {
      value: function (expected) {
        return (
          expected === this.toString() ||
          fnv1a(expected.toString().toLowerCase()) === this
        );
      },
      enumerable: false,
    });
  }
}

export function fnvCheck(x, y) {
  if (!x || !y) return false;
  return (
    x.toString().toLowerCase() === y.toLowerCase() || 
    x === fnv1a(y.toLowerCase())
  );
}

export function filterIndices(array, condition) {
  return array.reduce((acc, value, index) => {
    if (condition(value)) acc.push(index);
    return acc;
  }, []);
}