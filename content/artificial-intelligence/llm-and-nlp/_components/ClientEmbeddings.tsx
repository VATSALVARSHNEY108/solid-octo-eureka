'use client';

import React, { useState, useEffect, useRef } from 'react';

// Presets data
const PRESETS = [
  { name: "Fruit and juice", data: "eat|apple,eat|orange,eat|rice,drink|juice,drink|milk,drink|water,orange|juice,apple|juice,rice|milk,milk|drink,water|drink,juice|drink" },
  { name: "Fruit and juice (CBOW)", data: "drink^juice|apple,eat^apple|orange,drink^juice|rice,drink^milk|juice,drink^rice|milk,drink^milk|water,orange^apple|juice,apple^drink|juice,rice^drink|milk,milk^water|drink,water^juice|drink,juice^water|drink" },
  { name: "Fruit and juice (Skip-gram)", data: "apple|drink^juice,orange|eat^apple,rice|drink^juice,juice|drink^milk,milk|drink^rice,water|drink^milk,juice|orange^apple,juice|apple^drink,milk|rice^drink,drink|milk^water,drink|water^juice,drink|juice^water" },
  { name: "Self loop (5-point)", data: "A|A,B|B,C|C,D|D,E|E" },
  { name: "Directed loop (5-point)", data: "A|B,B|C,C|D,D|E,E|A" },
  { name: "Undirected loop (5-point)", data: "A|B,B|C,C|D,D|E,E|A,B|A,C|B,D|C,E|D,A|E" },
  { name: "King and queen", data: "king|kingdom,queen|kingdom,king|palace,queen|palace,king|royal,queen|royal,king|George,queen|Mary,man|rice,woman|rice,man|farmer,woman|farmer,man|house,woman|house,man|George,woman|Mary" },
  { name: "King and queen (symbol)", data: "king|a,queen|a,king|b,queen|b,king|c,queen|c,king|x,queen|y,man|d,woman|d,man|e,woman|e,man|f,woman|f,man|x,woman|y" }
];

// Linear congruential generator for random initialization matching wevi's original seed-based random state
let nextRandom = 1;
function seedRandom(seed: number) {
  nextRandom = seed;
}
function getRandom() {
  nextRandom = (nextRandom * 25214903917 + 11) & 0xffff;
  return nextRandom;
}
function getRandomInitWeight(hiddenSize: number) {
  const randomFloat = getRandom() / 65536;
  return (randomFloat - 0.5) / hiddenSize;
}

// 2D PCA implementation port
function runPCA(X: number[][]): number[][] {
  const n = X.length;
  const p = X[0].length;
  
  // Mean center
  const mean = new Array(p).fill(0);
  for (let j = 0; j < p; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += X[i][j];
    mean[j] = sum / n;
  }
  
  const centered = X.map(row => row.map((val, j) => val - mean[j]));
  
  // Standard deviation scale
  const std = new Array(p).fill(0);
  for (let j = 0; j < p; j++) {
    let sumSq = 0;
    for (let i = 0; i < n; i++) sumSq += centered[i][j] * centered[i][j];
    std[j] = Math.sqrt(sumSq / n);
  }
  
  const scaled = centered.map(row => row.map((val, j) => std[j] > 1e-9 ? val / std[j] : val));
  
  // SVD solver for thin dimension
  const u = scaled.map(row => [...row]);
  const m = u.length;
  const d = u[0].length;
  
  if (m < d) {
    // PCA fallback for small dimensions
    return X.map(row => [row[0] || 0, row[1] || 0]);
  }
  
  // Basic implementation of svd for thin matrices
  const prec = Math.pow(2, -52);
  const tolerance = 1e-64 / prec;
  const itmax = 50;
  
  const e = new Array(d).fill(0);
  const q = new Array(d).fill(0);
  const v = Array.from({ length: d }, () => new Array(d).fill(0));
  
  function pythag(a: number, b: number) {
    const at = Math.abs(a);
    const bt = Math.abs(b);
    if (at > bt) return at * Math.sqrt(1.0 + (bt * bt / at / at));
    else if (bt === 0) return at;
    return bt * Math.sqrt(1.0 + (at * at / at / at));
  }

  let g = 0, scale = 0, anorm = 0;
  for (let i = 0; i < d; i++) {
    let l = i + 1;
    e[i] = scale * g;
    let s = 0;
    scale = 0;
    for (let j = i; j < m; j++) scale += Math.abs(u[j][i]);
    if (scale !== 0) {
      for (let j = i; j < m; j++) {
        u[j][i] /= scale;
        s += u[j][i] * u[j][i];
      }
      let f = u[i][i];
      g = -Math.sign(f) * Math.sqrt(s);
      let h = f * g - s;
      u[i][i] = f - g;
      for (let j = l; j < d; j++) {
        let sum = 0;
        for (let k = i; k < m; k++) sum += u[k][i] * u[k][j];
        let f2 = sum / h;
        for (let k = i; k < m; k++) u[k][j] += f2 * u[k][i];
      }
      for (let j = i; j < m; j++) u[j][i] *= scale;
    }
    q[i] = scale * g;
    s = 0;
    scale = 0;
    for (let j = l; j < d; j++) scale += Math.abs(u[i][j]);
    if (scale !== 0) {
      for (let j = l; j < d; j++) {
        u[i][j] /= scale;
        s += u[i][j] * u[i][j];
      }
      let f = u[i][l];
      g = -Math.sign(f) * Math.sqrt(s);
      let h = f * g - s;
      u[i][l] = f - g;
      for (let j = l; j < d; j++) e[j] = u[i][j] / h;
      for (let j = l; j < m; j++) {
        let sum = 0;
        for (let k = l; k < d; k++) sum += u[j][k] * u[i][k];
        for (let k = l; k < d; k++) u[j][k] += sum * e[k];
      }
      for (let j = l; j < d; j++) u[i][j] *= scale;
    }
    anorm = Math.max(anorm, (Math.abs(q[i]) + Math.abs(e[i])));
  }

  // Accumulation of right-hand transformations
  for (let i = d - 1; i >= 0; i--) {
    let l = i + 1;
    if (g !== 0) {
      for (let j = l; j < d; j++) v[j][i] = (u[i][j] / u[i][l]) / g;
      for (let j = l; j < d; j++) {
        let sum = 0;
        for (let k = l; k < d; k++) sum += u[i][k] * v[k][j];
        for (let k = l; k < d; k++) v[k][j] += sum * v[k][i];
      }
    }
    for (let j = l; j < d; j++) {
      v[i][j] = 0;
      v[j][i] = 0;
    }
    v[i][i] = 1;
    g = e[i];
  }

  // Accumulation of left-hand transformations
  for (let i = d - 1; i >= 0; i--) {
    let l = i + 1;
    g = q[i];
    for (let j = l; j < d; j++) u[i][j] = 0;
    if (g !== 0) {
      g = 1 / g;
      for (let j = l; j < d; j++) {
        let sum = 0;
        for (let k = l; k < m; k++) sum += u[k][i] * u[k][j];
        let f = (sum / u[i][i]) * g;
        for (let k = i; k < m; k++) u[k][j] += f * u[k][i];
      }
      for (let j = i; j < m; j++) u[j][i] *= g;
    } else {
      for (let j = i; j < m; j++) u[j][i] = 0;
    }
    u[i][i] += 1;
  }

  // Diagonalization of bidiagonal form
  for (let k = d - 1; k >= 0; k--) {
    for (let iteration = 0; iteration < itmax; iteration++) {
      let flag = true;
      let l = 0;
      for (l = k; l >= 0; l--) {
        let nm = l - 1;
        if (Math.abs(e[l]) <= prec) { flag = false; break; }
        if (Math.abs(q[nm]) <= prec) break;
      }
      if (flag) {
        let c = 0.0;
        let s = 1.0;
        for (let i = l; i <= k; i++) {
          let f = s * e[i];
          e[i] = c * e[i];
          if (Math.abs(f) <= prec) break;
          g = q[i];
          let h = pythag(f, g);
          q[i] = h;
          h = 1.0 / h;
          c = g * h;
          s = -f * h;
          for (let j = 0; j < m; j++) {
            let y = u[j][l - 1];
            let z = u[j][i];
            u[j][l - 1] = y * c + z * s;
            u[j][i] = -y * s + z * c;
          }
        }
      }
      let z = q[k];
      if (l === k) {
        if (z < 0.0) {
          q[k] = -z;
          for (let j = 0; j < d; j++) v[j][k] = -v[j][k];
        }
        break;
      }
      if (iteration === itmax - 1) break; // Did not converge
      let x = q[l];
      let nm = k - 1;
      let y = q[nm];
      g = e[nm];
      let h = e[k];
      let f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2.0 * h * y);
      g = pythag(f, 1.0);
      f = ((x - z) * (x + z) + h * ((y / (f + Math.sign(f) * g)) - h)) / x;
      let c = 1.0;
      let s = 1.0;
      for (let j = l + 1; j <= k; j++) {
        let i = j - 1;
        g = e[j];
        y = q[j];
        h = s * g;
        g = c * g;
        z = pythag(f, h);
        e[i] = z;
        c = f / z;
        s = h / z;
        f = x * c + g * s;
        g = -x * s + g * c;
        h = y * s;
        y *= c;
        for (let jj = 0; jj < d; jj++) {
          let xx = v[jj][i];
          let zz = v[jj][j];
          v[jj][i] = xx * c + zz * s;
          v[jj][j] = -xx * s + zz * c;
        }
        z = pythag(f, h);
        q[i] = z;
        c = f / z;
        s = h / z;
        f = c * g + s * y;
        x = -s * g + c * y;
        for (let jj = 0; jj < m; jj++) {
          let yy = u[jj][i];
          let zz = u[jj][j];
          u[jj][i] = yy * c + zz * s;
          u[jj][j] = -yy * s + zz * c;
        }
      }
      e[l] = 0.0;
      e[k] = f;
      q[k] = x;
    }
  }

  // Multiply U and S
  const S_diag = Array.from({ length: d }, (_, i) => q[i] < tolerance ? 0 : q[i]);
  const pcUdS = u.map(row => row.map((val, colIdx) => val * S_diag[colIdx]));
  return pcUdS;
}

export function ClientEmbeddings({ allFiles }: { allFiles: { path: string; content: string }[] }) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'files'>('visualizer');
  
  // Simulator State
  const [inputText, setInputText] = useState(PRESETS[0].data);
  const [configText, setConfigText] = useState(JSON.stringify({ hidden_size: 5, random_state: 1, learning_rate: 0.2 }, null, ''));
  const [vocab, setVocab] = useState<string[]>([]);
  const [inputPairs, setInputPairs] = useState<string[][][]>([]);
  const [currentInputIdx, setCurrentInputIdx] = useState(-1);
  const [isInputActive, setIsInputActive] = useState(false);
  const [hiddenSize, setHiddenSize] = useState(5);
  const [learningRate, setLearningRate] = useState(0.2);

  // Model parameters/weights
  const [inputNeurons, setInputNeurons] = useState<{ word: string; value: number; always_excited: boolean }[]>([]);
  const [outputNeurons, setOutputNeurons] = useState<{ word: string; value: number }[]>([]);
  const [hiddenNeurons, setHiddenNeurons] = useState<{ value: number }[]>([]);
  const [inputEdges, setInputEdges] = useState<{ source: number; target: number; weight: number; gradient: number }[]>([]);
  const [outputEdges, setOutputEdges] = useState<{ source: number; target: number; weight: number; gradient: number }[]>([]);
  const [principalComponents, setPrincipalComponents] = useState<number[][]>([]);

  // Simulation Initialization
  const handleRestart = () => {
    let parsedConfig = { hidden_size: 5, random_state: 1, learning_rate: 0.2 };
    try {
      parsedConfig = JSON.parse(configText);
    } catch (e) {
      alert("Invalid JSON config");
      return;
    }

    setHiddenSize(parsedConfig.hidden_size);
    setLearningRate(parsedConfig.learning_rate);
    seedRandom(parsedConfig.random_state);

    // Parse training input
    const pairs = inputText.trim().split(",");
    const parsedPairs: string[][][] = [];
    let tempVocab: string[] = [];

    pairs.forEach(s => {
      const tokens = s.trim().split("|");
      if (tokens.length === 2) {
        const inp = tokens[0].trim().split("^");
        const outp = tokens[1].trim().split("^");
        parsedPairs.push([inp, outp]);
        inp.forEach(t => tempVocab.push(t));
        outp.forEach(t => tempVocab.push(t));
      }
    });

    // Unique vocab
    tempVocab = Array.from(new Set(tempVocab)).sort();
    setVocab(tempVocab);
    setInputPairs(parsedPairs);
    setCurrentInputIdx(-1);
    setIsInputActive(false);

    // Setup network model
    const initialInputNeurons = tempVocab.map(word => ({ word, value: 0, always_excited: false }));
    const initialOutputNeurons = tempVocab.map(word => ({ word, value: 0 }));
    const initialHiddenNeurons = Array.from({ length: parsedConfig.hidden_size }, () => ({ value: 0 }));

    const initialInputEdges: typeof inputEdges = [];
    const initialOutputEdges: typeof outputEdges = [];

    for (let i = 0; i < tempVocab.length; i++) {
      for (let j = 0; j < parsedConfig.hidden_size; j++) {
        initialInputEdges.push({
          source: i,
          target: j,
          weight: getRandomInitWeight(parsedConfig.hidden_size),
          gradient: 0
        });
        initialOutputEdges.push({
          source: j,
          target: i,
          weight: getRandomInitWeight(parsedConfig.hidden_size),
          gradient: 0
        });
      }
    }

    setInputNeurons(initialInputNeurons);
    setOutputNeurons(initialOutputNeurons);
    setHiddenNeurons(initialHiddenNeurons);
    setInputEdges(initialInputEdges);
    setOutputEdges(initialOutputEdges);

    // Initial feedforward (empty state)
    runFeedForward(initialInputNeurons, initialHiddenNeurons, initialOutputNeurons, initialInputEdges, initialOutputEdges, tempVocab.length);
  };

  useEffect(() => {
    handleRestart();
  }, []);

  const runFeedForward = (
    currentInp: typeof inputNeurons,
    currentHidden: typeof hiddenNeurons,
    currentOut: typeof outputNeurons,
    inEdges: typeof inputEdges,
    outEdges: typeof outputEdges,
    vSize: number
  ) => {
    const hiddenValTemp = new Array(currentHidden.length).fill(0);
    let numInputExcited = 0;

    currentInp.forEach((n, i) => {
      if (n.value < 1e-5) return;
      numInputExcited += 1;
      for (let j = 0; j < currentHidden.length; j++) {
        const edge = inEdges.find(e => e.source === i && e.target === j);
        if (edge) hiddenValTemp[j] += edge.weight;
      }
    });

    const nextHidden = currentHidden.map((n, j) => ({
      value: numInputExcited > 0 ? hiddenValTemp[j] / numInputExcited : 0
    }));

    const outValueTemp: number[] = [];
    let sumExpNetInput = 0.0;

    for (let i = 0; i < vSize; i++) {
      let tmpSum = 0.0;
      for (let j = 0; j < nextHidden.length; j++) {
        const edge = outEdges.find(e => e.source === j && e.target === i);
        if (edge) tmpSum += edge.weight * nextHidden[j].value;
      }
      const expNetInput = Math.exp(tmpSum);
      sumExpNetInput += expNetInput;
      outValueTemp.push(expNetInput);
    }

    const nextOut = currentOut.map((n, i) => ({
      ...n,
      value: sumExpNetInput > 0 ? outValueTemp[i] / sumExpNetInput : 0
    }));

    setHiddenNeurons(nextHidden);
    setOutputNeurons(nextOut);

    // Update PCA projections based on current input weights
    const matrix: number[][] = Array.from({ length: vSize }, () => new Array(nextHidden.length).fill(0));
    inEdges.forEach(e => {
      if (e.source < vSize && e.target < nextHidden.length) {
        matrix[e.source][e.target] = e.weight;
      }
    });
    const pcs = runPCA(matrix);
    setPrincipalComponents(pcs);
  };

  // Backpropagation to calculate gradients
  const handleBackpropagate = (
    targetWords: string[],
    currInp: typeof inputNeurons,
    currHidden: typeof hiddenNeurons,
    currOut: typeof outputNeurons,
    inEdges: typeof inputEdges,
    outEdges: typeof outputEdges
  ) => {
    const errors = currOut.map((n) => {
      const expected = targetWords.includes(n.word) ? 1 : 0;
      return n.value - expected;
    });

    const nextOutEdges = outEdges.map(e => {
      const gradient = errors[e.target] * currHidden[e.source].value;
      return { ...e, gradient };
    });

    const hiddenNetInputGradient = new Array(currHidden.length).fill(0);
    outEdges.forEach(e => {
      hiddenNetInputGradient[e.source] += errors[e.target] * e.weight;
    });

    let numInputExcited = 0;
    currInp.forEach(n => {
      if (n.value >= 1e-5) numInputExcited += 1;
    });

    const nextInEdges = inEdges.map(e => {
      const excited = currInp[e.source].value >= 1e-5;
      const gradient = excited ? hiddenNetInputGradient[e.target] / numInputExcited : 0;
      return { ...e, gradient };
    });

    setInputEdges(nextInEdges);
    setOutputEdges(nextOutEdges);
  };

  const handleApplyGradients = () => {
    const nextInEdges = inputEdges.map(e => ({
      ...e,
      weight: e.weight - learningRate * e.gradient,
      gradient: 0
    }));
    const nextOutEdges = outputEdges.map(e => ({
      ...e,
      weight: e.weight - learningRate * e.gradient,
      gradient: 0
    }));

    setInputEdges(nextInEdges);
    setOutputEdges(nextOutEdges);
    return { nextInEdges, nextOutEdges };
  };

  const handleStep = () => {
    if (isInputActive) {
      // Deactivate current input and apply weights update
      const { nextInEdges, nextOutEdges } = handleApplyGradients();
      setIsInputActive(false);
      const resetInp = inputNeurons.map(n => ({ ...n, value: 0 }));
      setInputNeurons(resetInp);
      runFeedForward(resetInp, hiddenNeurons, outputNeurons, nextInEdges, nextOutEdges, vocab.length);
    } else {
      // Activate next input
      const nextIdx = (currentInputIdx + 1) % inputPairs.length;
      setCurrentInputIdx(nextIdx);
      setIsInputActive(true);

      const currentPair = inputPairs[nextIdx];
      const contextWords = currentPair[0];
      const targetWords = currentPair[1];

      const nextInp = inputNeurons.map(n => ({
        ...n,
        value: contextWords.includes(n.word) ? 1 : 0
      }));
      setInputNeurons(nextInp);

      // Forward pass
      runFeedForward(nextInp, hiddenNeurons, outputNeurons, inputEdges, outputEdges, vocab.length);
      // Compute gradients
      handleBackpropagate(targetWords, nextInp, hiddenNeurons, outputNeurons, inputEdges, outputEdges);
    }
  };

  // Color functions matching wevi colors
  const exciteValueToColor = (x: number) => {
    // Sigmoid mapping
    const s = 1 / (1 + Math.exp(-x * 5));
    // Interpolate blue-grey-red
    const r = Math.floor(s * 255);
    const b = Math.floor((1 - s) * 255);
    const g = 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="w-full min-h-screen px-8 py-12 font-mono transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
          <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
            Embeddings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Visualizing vector representations, neural networks, weight matrices, and PCA scatter plots.
          </p>
        </header>

        {/* Tab content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="border p-6 rounded shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-xl font-bold mb-6 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
              Control Panel
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Preset Data</label>
              <select
                onChange={(e) => {
                  const preset = PRESETS.find(p => p.name === e.target.value);
                  if (preset) {
                    setInputText(preset.data);
                    setTimeout(handleRestart, 100);
                  }
                }}
                className="w-full border p-2 outline-none focus:border-neutral-500 rounded"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                {PRESETS.map(preset => (
                  <option key={preset.name} value={preset.name} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>{preset.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Training Data (context|target)</label>
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full border p-2 outline-none focus:border-neutral-500 font-mono rounded"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Configuration JSON</label>
              <textarea
                rows={4}
                value={configText}
                onChange={(e) => setConfigText(e.target.value)}
                className="w-full border p-2 outline-none focus:border-neutral-500 font-mono rounded"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRestart}
                className="font-bold py-2 border uppercase transition duration-150 cursor-pointer rounded"
                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                Update & Restart
              </button>
              <button
                onClick={handleStep}
                className="font-bold py-3 uppercase transition duration-150 text-center cursor-pointer border rounded"
                style={{ 
                  backgroundColor: 'var(--text-primary)', 
                  color: 'var(--bg-primary)', 
                  borderColor: 'var(--text-primary)' 
                }}
              >
                {isInputActive ? "Apply Weight Gradients" : "Feed Next Input & Backprop"}
              </button>
            </div>

            <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-md font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Current Process State</h3>
              <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <p>Step Active: <span className={isInputActive ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>{isInputActive ? 'Backpropagated' : 'Idle/Updated'}</span></p>
                {isInputActive && currentInputIdx >= 0 && inputPairs[currentInputIdx] && (
                  <div className="border p-2 mt-2 rounded" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                    <p style={{ color: 'var(--text-primary)' }}>Active Pair:</p>
                    <p>Context (Input): {inputPairs[currentInputIdx][0].join(", ")}</p>
                    <p>Target (Expected Output): {inputPairs[currentInputIdx][1].join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Neural Net and Visualization */}
          <div className="lg:col-span-2 space-y-8">
            {/* Neurons view */}
            <div className="border p-6 rounded shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Neurons (Input &rarr; Hidden &rarr; Output)</h3>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 800 400" className="w-full h-auto rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  {/* Draw edges */}
                  {inputNeurons.map((inNeuron, inIdx) => {
                    return hiddenNeurons.map((hNeuron, hIdx) => {
                      const edge = inputEdges.find(e => e.source === inIdx && e.target === hIdx);
                      const weight = edge ? edge.weight : 0;
                      const isExcited = inNeuron.value > 0;
                      return (
                        <line
                          key={`in-edge-${inIdx}-${hIdx}`}
                          x1={120}
                          y1={30 + inIdx * (340 / (vocab.length - 1 || 1))}
                          x2={400}
                          y2={50 + hIdx * (300 / (hiddenSize - 1 || 1))}
                          stroke={isExcited ? exciteValueToColor(weight) : "var(--border-color)"}
                          strokeWidth={isExcited ? 3 : 1}
                          opacity={isExcited ? 0.9 : 0.2}
                        />
                      );
                    });
                  })}

                  {hiddenNeurons.map((hNeuron, hIdx) => {
                    return outputNeurons.map((outNeuron, outIdx) => {
                      const edge = outputEdges.find(e => e.source === hIdx && e.target === outIdx);
                      const weight = edge ? edge.weight : 0;
                      const isExcited = hNeuron.value > 0.05;
                      return (
                        <line
                          key={`out-edge-${hIdx}-${outIdx}`}
                          x1={400}
                          y1={50 + hIdx * (300 / (hiddenSize - 1 || 1))}
                          x2={680}
                          y2={30 + outIdx * (340 / (vocab.length - 1 || 1))}
                          stroke={isExcited ? exciteValueToColor(weight) : "var(--border-color)"}
                          strokeWidth={isExcited ? 3 : 1}
                          opacity={isExcited ? 0.9 : 0.2}
                        />
                      );
                    });
                  })}

                  {/* Draw input nodes */}
                  {inputNeurons.map((neuron, idx) => {
                    const cy = 30 + idx * (340 / (vocab.length - 1 || 1));
                    return (
                      <g key={`in-node-${idx}`}>
                        <circle
                          cx={120}
                          cy={cy}
                          r={12}
                          fill={neuron.value > 0 ? "rgb(255, 100, 100)" : "var(--bg-secondary)"}
                          stroke={neuron.value > 0 ? "var(--text-primary)" : "var(--border-color)"}
                          strokeWidth={2}
                        />
                        <text x={95} y={cy + 4} fill="var(--text-primary)" fontSize={12} textAnchor="end">{neuron.word}</text>
                      </g>
                    );
                  })}

                  {/* Draw hidden nodes */}
                  {hiddenNeurons.map((neuron, idx) => {
                    const cy = 50 + idx * (300 / (hiddenSize - 1 || 1));
                    return (
                      <g key={`h-node-${idx}`}>
                        <circle
                          cx={400}
                          cy={cy}
                          r={14}
                          fill={exciteValueToColor(neuron.value)}
                          stroke="var(--border-color)"
                          strokeWidth={2}
                        />
                        <text x={400} y={cy + 4} fill="var(--bg-primary)" fontSize={10} fontWeight="bold" textAnchor="middle">{`h${idx}`}</text>
                      </g>
                    );
                  })}

                  {/* Draw output nodes */}
                  {outputNeurons.map((neuron, idx) => {
                    const cy = 30 + idx * (340 / (vocab.length - 1 || 1));
                    return (
                      <g key={`out-node-${idx}`}>
                        <circle
                          cx={680}
                          cy={cy}
                          r={12}
                          fill={exciteValueToColor(neuron.value)}
                          stroke="var(--border-color)"
                          strokeWidth={2}
                        />
                        <text x={705} y={cy + 4} fill="var(--text-primary)" fontSize={12} textAnchor="start">{neuron.word}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Weight matrices heatmap and projection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Heatmap */}
              <div className="border p-6 rounded" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Weight Matrices Heatmap</h3>
                <div className="grid grid-cols-2 gap-2 text-center text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <div>Input Weights</div>
                  <div>Output Weights</div>
                </div>
                <div className="flex justify-center border p-4 rounded overflow-auto" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  {/* Custom CSS heat grid representation */}
                  <div className="flex space-x-4">
                    {/* Input Edges Grid */}
                    <div className="flex flex-col">
                      {vocab.map((v, i) => (
                        <div key={`heat-in-row-${i}`} className="flex">
                          {Array.from({ length: hiddenSize }).map((_, j) => {
                            const edge = inputEdges.find(e => e.source === i && e.target === j);
                            const val = edge ? edge.weight : 0;
                            return (
                              <div
                                key={`heat-in-${i}-${j}`}
                                className="w-5 h-5 border"
                                style={{ backgroundColor: exciteValueToColor(val), borderColor: 'var(--bg-secondary)' }}
                                title={`W_in[${v}][h${j}]: ${val.toFixed(4)}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Output Edges Grid */}
                    <div className="flex flex-col">
                      {vocab.map((v, i) => (
                        <div key={`heat-out-row-${i}`} className="flex">
                          {Array.from({ length: hiddenSize }).map((_, j) => {
                            const edge = outputEdges.find(e => e.source === j && e.target === i);
                            const val = edge ? edge.weight : 0;
                            return (
                              <div
                                key={`heat-out-${i}-${j}`}
                                className="w-5 h-5 border"
                                style={{ backgroundColor: exciteValueToColor(val), borderColor: 'var(--bg-secondary)' }}
                                title={`W_out[h${j}][${v}]: ${val.toFixed(4)}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PCA Projection Scatterplot */}
              <div className="border p-6 rounded" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>PCA Projections (2D Space)</h3>
                <div className="relative w-full h-64 border rounded" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                  <svg viewBox="0 0 300 200" className="w-full h-full">
                    {/* Grid crosshair */}
                    <line x1={0} y1={100} x2={300} y2={100} stroke="var(--border-color)" strokeDasharray="5,5" />
                    <line x1={150} y1={0} x2={150} y2={200} stroke="var(--border-color)" strokeDasharray="5,5" />

                    {/* Plot vector representations */}
                    {principalComponents.map((coords, idx) => {
                      const word = vocab[idx];
                      if (!word || coords.length < 2) return null;
                      // Map coordinates [-2, 2] to SVG grid
                      const cx = 150 + (coords[0] * 50);
                      const cy = 100 - (coords[1] * 35);
                      return (
                        <g key={`pca-${word}`}>
                          <circle cx={cx} cy={cy} r={5} fill="#1f77b4" stroke="var(--text-primary)" strokeWidth={1} />
                          <text x={cx + 6} y={cy + 3} fill="var(--text-primary)" fontSize={8}>{word}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ClientEmbeddings;
