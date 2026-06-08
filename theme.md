================================================
FILE: README.md
================================================
# CNN Explainer

An interactive visualization system designed to help non-experts learn about Convolutional Neural Networks (CNNs)

[![build](https://github.com/poloclub/cnn-explainer/workflows/build/badge.svg)](https://github.com/poloclub/cnn-explainer/actions)
[![arxiv badge](https://img.shields.io/badge/arXiv-2004.15004-red)](http://arxiv.org/abs/2004.15004)
[![DOI:10.1109/TVCG.2020.3030418](https://img.shields.io/badge/DOI-10.1109/TVCG.2020.3030418-blue)](https://doi.org/10.1109/TVCG.2020.3030418)

<a href="https://youtu.be/HnWIHWFbuUQ" target="_blank"><img src="https://i.imgur.com/sCsudVg.png" style="max-width:100%;"></a>

For more information, check out our manuscript:

[**CNN Explainer: Learning Convolutional Neural Networks with Interactive Visualization**](https://arxiv.org/abs/2004.15004).
Wang, Zijie J., Robert Turko, Omar Shaikh, Haekyu Park, Nilaksh Das, Fred Hohman, Minsuk Kahng, and Duen Horng Chau.
*IEEE Transactions on Visualization and Computer Graphics (TVCG), 2020.*

## Live Demo

For a live demo, visit: http://poloclub.github.io/cnn-explainer/

## Running Locally

Clone or download this repository:

```bash
git clone git@github.com:poloclub/cnn-explainer.git

# use degit if you don't want to download commit histories
degit poloclub/cnn-explainer
```

Install the dependencies:

```bash
npm install
```

Then run CNN Explainer:

```bash
npm run dev
```

Navigate to [localhost:3000](https://localhost:3000). You should see CNN Explainer running in your broswer :)

To see how we trained the CNN, visit the directory [`./tiny-vgg/`](tiny-vgg).
If you want to use CNN Explainer with your own CNN model or image classes, see [#8](/../../issues/8) and [#14](/../../issues/14).

## Credits

CNN Explainer was created by
<a href="https://zijie.wang/">Jay Wang</a>,
<a href="https://www.linkedin.com/in/robert-turko/">Robert Turko</a>,
<a href="http://oshaikh.com/">Omar Shaikh</a>,
<a href="https://haekyu.com/">Haekyu Park</a>,
<a href="http://nilakshdas.com/">Nilaksh Das</a>,
<a href="https://fredhohman.com/">Fred Hohman</a>,
<a href="http://minsuk.com">Minsuk Kahng</a>, and
<a href="https://www.cc.gatech.edu/~dchau/">Polo Chau</a>,
which was the result of a research collaboration between
Georgia Tech and Oregon State.

We thank
[Anmol Chhabria](https://www.linkedin.com/in/anmolchhabria),
[Kaan Sancak](https://kaansancak.com),
[Kantwon Rogers](https://www.kantwon.com), and the
[Georgia Tech Visualization Lab](http://vis.gatech.edu)
for their support and constructive feedback.

## Citation

```bibTeX
@article{wangCNNExplainerLearning2020,
  title = {{{CNN Explainer}}: {{Learning Convolutional Neural Networks}} with {{Interactive Visualization}}},
  shorttitle = {{{CNN Explainer}}},
  author = {Wang, Zijie J. and Turko, Robert and Shaikh, Omar and Park, Haekyu and Das, Nilaksh and Hohman, Fred and Kahng, Minsuk and Chau, Duen Horng},
  journal={IEEE Transactions on Visualization and Computer Graphics (TVCG)},
  year={2020},
  publisher={IEEE}
}
```

## License

The software is available under the [MIT License](https://github.com/poloclub/cnn-explainer/blob/master/LICENSE).

## Contact

If you have any questions, feel free to [open an issue](https://github.com/poloclub/cnn-explainer/issues/new/choose) or contact [Jay Wang](https://zijie.wang).



================================================
FILE: deploy-gh-page.sh
================================================
npm run build
cp -r ./public/assets ./dist
cp -r ./public/bundle* ./dist
cp -r ./public/global.css ./dist
npx gh-pages -m "Deploy $(git log '--format=format:%H' master -1)" -d ./dist


================================================
FILE: LICENSE
================================================
MIT License

Copyright (c) 2020 Polo Club of Data Science

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



================================================
FILE: package.json
================================================
{
  "name": "svelte-app",
  "version": "1.0.0",
  "devDependencies": {
    "@rollup/plugin-replace": "^2.3.2",
    "gh-pages": "^6.0.0",
    "rollup": "^1.27.13",
    "rollup-plugin-commonjs": "^10.0.0",
    "rollup-plugin-livereload": "^1.0.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-svelte": "~6.1.1",
    "rollup-plugin-terser": "^5.1.3",
    "svelte": "^3.31.0"
  },
  "dependencies": {
    "@tensorflow/tfjs": "^1.4.0",
    "sirv-cli": "^0.4.4"
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "start": "sirv public --single",
    "start:dev": "sirv public --single --dev --port 3000",
    "deploy": "npx"
  }
}



================================================
FILE: rollup.config.js
================================================
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import rollup_start_dev from './rollup_start_dev';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),

        replace({PUBLIC_URL: production ? '/cnn-explainer' : ''}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// In dev mode, call `npm run start:dev` once
		// the bundle has been generated
		!production && rollup_start_dev,

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};



================================================
FILE: rollup_start_dev.js
================================================
import * as child_process from 'child_process';

let running_dev_server = false;

export default {
	writeBundle() {
		if (!running_dev_server) {
			running_dev_server = true;
			child_process.spawn('npm', ['run', 'start:dev'], { stdio: ['ignore', 'inherit', 'inherit'], shell: true });
		}
	}
};



================================================
FILE: public/global.css
================================================
:root {
	--outer-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
	--outer-shadow-sm: 0 .125rem .25rem rgba(0,0,0,.075);
	--outer-shadow-lg: 0 1rem 3rem rgba(0,0,0,.175);
	--red: rgb(255, 59, 48);
	--blue: rgb(0, 122, 255);
	--green: rgb(52, 199, 89);
	--teal: rgb(90, 200, 250);
	--light-gray: rgb(250, 250, 250);
	--middle-gray: rgb(190, 190, 190);
	--dark-gray: rgb(155, 155, 155);
	--deep-gray: rgb(100, 100, 100);
}

html, body {
	position: relative;
	width: 100%;
	height: 100%;
	scroll-behavior: smooth;
}

body {
	color: #333;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}




================================================
FILE: public/index.html
================================================
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />

    <!-- Primary Meta Tags -->
    <meta name="title" content="CNN Explainer" />
    <meta
      name="description"
      content="An interactive visualization system designed to help non-experts learn about Convolutional Neural Networks (CNNs)."
    />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="https://poloclub.github.io/cnn-explainer/"
    />
    <meta property="og:title" content="CNN Explainer" />
    <meta
      property="og:description"
      content="An interactive visualization system designed to help non-experts learn about Convolutional Neural Networks (CNNs)."
    />
    <meta
      property="og:image"
      content="https://poloclub.github.io/cnn-explainer/assets/figures/preview.png"
    />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta
      property="twitter:url"
      content="https://poloclub.github.io/cnn-explainer/"
    />
    <meta property="twitter:title" content="CNN Explainer" />
    <meta
      property="twitter:description"
      content="An interactive visualization system designed to help non-experts learn about Convolutional Neural Networks (CNNs)."
    />
    <meta
      property="twitter:image"
      content="https://poloclub.github.io/cnn-explainer/assets/figures/preview.png"
    />
    <meta property="twitter:site" content="@jay4w" />
    <meta property="twitter:creator" content="@jay4w" />

    <title>CNN Explainer</title>

    <link rel="icon" type="image/png" href="/assets/img/favicon.png" />
    <link rel="stylesheet" href="/global.css" />
    <link rel="stylesheet" href="/bundle.css" />

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Neucha&display=swap"
      rel="stylesheet"
    />
    <script src="https://d3js.org/d3.v5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
    <script
      defer
      src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"
    ></script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script src="https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15/dist/smooth-scroll.polyfills.min.js"></script>
    <script
      id="MathJax-script"
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
    ></script>

    <script
      type="module"
      src="https://unpkg.com/recommender-overlay/dist/recommender-overlay.es.js"
    ></script>

    <script defer src="/bundle.js"></script>

    <style>
      @font-face {
        font-family: 'A Love of Thunder';
        src: URL('/assets/font/A Love of Thunder.ttf') format('truetype');
      }
    </style>
  </head>

  <body></body>
</html>



================================================
FILE: public/assets/data/model.json
================================================
{"format": "layers-model", "generatedBy": "keras v2.2.4-tf", "convertedBy": "TensorFlow.js Converter v1.3.1.1", "modelTopology": {"keras_version": "2.2.4-tf", "backend": "tensorflow", "model_config": {"class_name": "Sequential", "config": {"name": "sequential", "layers": [{"class_name": "Conv2D", "config": {"name": "conv_1_1", "trainable": true, "batch_input_shape": [null, 64, 64, 3], "dtype": "float32", "filters": 10, "kernel_size": [3, 3], "strides": [1, 1], "padding": "valid", "data_format": "channels_last", "dilation_rate": [1, 1], "activation": "linear", "use_bias": true, "kernel_initializer": {"class_name": "GlorotUniform", "config": {"seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}}, {"class_name": "Activation", "config": {"name": "relu_1_1", "trainable": true, "dtype": "float32", "activation": "relu"}}, {"class_name": "Conv2D", "config": {"name": "conv_1_2", "trainable": true, "dtype": "float32", "filters": 10, "kernel_size": [3, 3], "strides": [1, 1], "padding": "valid", "data_format": "channels_last", "dilation_rate": [1, 1], "activation": "linear", "use_bias": true, "kernel_initializer": {"class_name": "GlorotUniform", "config": {"seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}}, {"class_name": "Activation", "config": {"name": "relu_1_2", "trainable": true, "dtype": "float32", "activation": "relu"}}, {"class_name": "MaxPooling2D", "config": {"name": "max_pool_1", "trainable": true, "dtype": "float32", "pool_size": [2, 2], "padding": "valid", "strides": [2, 2], "data_format": "channels_last"}}, {"class_name": "Conv2D", "config": {"name": "conv_2_1", "trainable": true, "dtype": "float32", "filters": 10, "kernel_size": [3, 3], "strides": [1, 1], "padding": "valid", "data_format": "channels_last", "dilation_rate": [1, 1], "activation": "linear", "use_bias": true, "kernel_initializer": {"class_name": "GlorotUniform", "config": {"seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}}, {"class_name": "Activation", "config": {"name": "relu_2_1", "trainable": true, "dtype": "float32", "activation": "relu"}}, {"class_name": "Conv2D", "config": {"name": "conv_2_2", "trainable": true, "dtype": "float32", "filters": 10, "kernel_size": [3, 3], "strides": [1, 1], "padding": "valid", "data_format": "channels_last", "dilation_rate": [1, 1], "activation": "linear", "use_bias": true, "kernel_initializer": {"class_name": "GlorotUniform", "config": {"seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}}, {"class_name": "Activation", "config": {"name": "relu_2_2", "trainable": true, "dtype": "float32", "activation": "relu"}}, {"class_name": "MaxPooling2D", "config": {"name": "max_pool_2", "trainable": true, "dtype": "float32", "pool_size": [2, 2], "padding": "valid", "strides": [2, 2], "data_format": "channels_last"}}, {"class_name": "Flatten", "config": {"name": "flatten", "trainable": true, "dtype": "float32", "data_format": "channels_last"}}, {"class_name": "Dense", "config": {"name": "output", "trainable": true, "dtype": "float32", "units": 10, "activation": "softmax", "use_bias": true, "kernel_initializer": {"class_name": "GlorotUniform", "config": {"seed": null}}, "bias_initializer": {"class_name": "Zeros", "config": {}}, "kernel_regularizer": null, "bias_regularizer": null, "activity_regularizer": null, "kernel_constraint": null, "bias_constraint": null}}]}}}, "weightsManifest": [{"paths": ["group1-shard1of1.bin"], "weights": [{"name": "conv_1_1/kernel", "shape": [3, 3, 3, 10], "dtype": "float32"}, {"name": "conv_1_1/bias", "shape": [10], "dtype": "float32"}, {"name": "conv_1_2/kernel", "shape": [3, 3, 10, 10], "dtype": "float32"}, {"name": "conv_1_2/bias", "shape": [10], "dtype": "float32"}, {"name": "conv_2_1/kernel", "shape": [3, 3, 10, 10], "dtype": "float32"}, {"name": "conv_2_1/bias", "shape": [10], "dtype": "float32"}, {"name": "conv_2_2/kernel", "shape": [3, 3, 10, 10], "dtype": "float32"}, {"name": "conv_2_2/bias", "shape": [10], "dtype": "float32"}, {"name": "output/kernel", "shape": [1690, 10], "dtype": "float32"}, {"name": "output/bias", "shape": [10], "dtype": "float32"}]}]}


================================================
FILE: src/App.svelte
================================================
<script>
  import Explainer from './Explainer.svelte';
  import Header from './Header.svelte';
</script>

<style>
</style>

<div id="app-page">
  <recommender-overlay
    my-brand="CNN Explainer"
    brands-to-ignore="CNN 101"
    recommendation-count="10"
    similar-candidate-count="15"
    position-left="30"
    display-delay="30000"
    homepage-url="https://poloclub.github.io/"
  />
  <Header />
  <Explainer />
</div>



================================================
FILE: src/config.js
================================================
/* global d3 */

const layerColorScales = {
  input: [d3.interpolateGreys, d3.interpolateGreys, d3.interpolateGreys],
  conv: d3.interpolateRdBu,
  relu: d3.interpolateRdBu,
  pool: d3.interpolateRdBu,
  fc: d3.interpolateGreys,
  weight: d3.interpolateBrBG,
  logit: d3.interpolateOranges
};

let nodeLength = 40;

export const overviewConfig = {
  nodeLength : nodeLength,
  plusSymbolRadius : nodeLength / 5,
  numLayers : 12,
  edgeOpacity : 0.8,
  edgeInitColor : 'rgb(230, 230, 230)',
  edgeHoverColor : 'rgb(130, 130, 130)',
  edgeHoverOuting : false,
  edgeStrokeWidth : 0.7,
  intermediateColor : 'gray',
  layerColorScales: layerColorScales,
  svgPaddings: {top: 25, bottom: 25, left: 50, right: 50},
  kernelRectLength: 8/3,
  gapRatio: 4,
  overlayRectOffset: 12,
  classLists: ['lifeboat', 'ladybug', 'pizza', 'bell pepper', 'school bus',
    'koala', 'espresso', 'red panda', 'orange', 'sport car']
};


================================================
FILE: src/Explainer.svelte
================================================
<script>
  import Overview from './overview/Overview.svelte';
  import { cnnStore } from './stores.js';

  // Enum to control the displaying view
  const View = {
    OVERVIEW: 'overview',
    LAYERVIEW: 'layerview',
    DETAILVIEW: 'detailview'
  };

  let mainView = View.OVERVIEW;

  /* Example to read loaded cnn in other components:
  $: if ( $cnnStore.length != 0) {
    console.log($cnnStore);
  }
  */

</script>

<style>
#explainer {
  width: 100%;
  padding: 0;
  margin: auto;
  /* outline: 1px solid var(--g-dark-gray); */
}
</style>

<div id='explainer'>
    <Overview />
</div>


================================================
FILE: src/Header.svelte
================================================
<script>
</script>

<style>
	#header {
		height: 50px;
		display: flex;
		padding: 0 20px;
		align-items: center;
		background: rgb(30, 30, 30);
    justify-content: space-between;
	}

	#logo {
		display: flex;
		align-items: center;
	}

	#logo-text {
		font-size: 30px;
		color: var(--light-gray);
		font-family: 'A Love of Thunder';
		margin-right: 10px;
	}

	#svg-logo-tagline {
		font-size: 23px;
		fill: rgb(255, 255, 255);
		dominant-baseline: baseline;
		font-family: 'Neucha';
	}

	.icons {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.icon {
		width: 27px;
		height: 27px;
		margin-left: 15px;
	}

	.icon a{
		width: 100%;
		height: 100%;
	}

	.icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
	}
</style>

<div id="header">

  <div id="logo">
    <div id="logo-text">
      CNN Explainer
    </div>

		<svg width="510px" height="50px">
			<defs>
				<filter x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" id="chalk-texture">
					<feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="5" stitchTiles="stitch" result="f1">
					</feTurbulence>
					<feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" result="f2">
					</feColorMatrix>
					<feComposite operator="in" in2="f2" in="SourceGraphic" result="f3">
					</feComposite>
				</filter>
			</defs>

			<g filter="url(#chalk-texture)" transform="translate(0, 35)">
				<text id="svg-logo-tagline">
					Learn Convolutional Neural Network (CNN) in your browser! 
				</text>
			</g>
		</svg>
  </div>

	<div class="icons">
	
		<div class="icon" title="Research paper">
			<a target="_blank" href="https://arxiv.org/abs/2004.15004">
				<img src="PUBLIC_URL/assets/img/pdf.png" alt="pdf icon"/>
			</a>
		</div>

		<div class="icon" title="Demo video">
			<a target="_blank" href="https://youtu.be/HnWIHWFbuUQ">
				<img src="PUBLIC_URL/assets/img/youtube.png" alt="youtube icon"/>
			</a>
		</div>

		<div class="icon" title="Open-source code">
			<a target="_blank" href="https://github.com/poloclub/cnn-explainer">
				<img src="PUBLIC_URL/assets/img/github.png" alt="github icon"/>
			</a>
		</div>

	</div>
</div>


================================================
FILE: src/main.js
================================================
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});

export default app;


================================================
FILE: src/stores.js
================================================
import { writable } from 'svelte/store';

export const cnnStore = writable([]);
export const svgStore = writable(undefined);

export const vSpaceAroundGapStore = writable(undefined);
export const hSpaceAroundGapStore = writable(undefined);

export const nodeCoordinateStore = writable([]);
export const selectedScaleLevelStore = writable(undefined);

export const cnnLayerRangesStore = writable({});
export const cnnLayerMinMaxStore = writable([]);

export const needRedrawStore = writable([undefined, undefined]);

export const detailedModeStore = writable(true);

export const shouldIntermediateAnimateStore = writable(false);

export const isInSoftmaxStore = writable(false);
export const softmaxDetailViewStore = writable({});
export const allowsSoftmaxAnimationStore = writable(false);

export const hoverInfoStore = writable({});

export const modalStore = writable({});

export const intermediateLayerPositionStore = writable({});


================================================
FILE: src/article/Article.svelte
================================================
<script>
	import HyperparameterView from '../detail-view/Hyperparameterview.svelte';
  import Youtube from './Youtube.svelte';

	let softmaxEquation = `$$\\text{Softmax}(x_{i}) = \\frac{\\exp(x_i)}{\\sum_j \\exp(x_j)}$$`;
	let reluEquation = `$$\\text{ReLU}(x) = \\max(0,x)$$`;

  let currentPlayer;
</script>

<style>
	#description {
    margin-bottom: 60px;
    margin-left: auto;
    margin-right: auto;
    max-width: 78ch;
  }

  #description h2 {
    color: #444;
    font-size: 40px;
    font-weight: 450;
    margin-bottom: 12px;
    margin-top: 60px;
  }

  #description h4 {
    color: #444;
    font-size: 32px;
    font-weight: 450;
    margin-bottom: 8px;
    margin-top: 44px;
  }

  #description h6 {
    color: #444;
    font-size: 24px;
    font-weight: 450;
    margin-bottom: 8px;
    margin-top: 44px;
  }

  #description p {
    margin: 16px 0;
  }

  #description p img {
    vertical-align: middle;
  }

  #description .figure-caption {
    font-size: 13px;
    margin-top: 5px;
  }

  #description ol {
    margin-left: 40px;
  }

  #description p, 
  #description div,
  #description li {
    color: #555;
    font-size: 17px;
    line-height: 1.6;
  }

  #description small {
    font-size: 12px;
  }

  #description ol li img {
    vertical-align: middle;
  }

  #description .video-link {
    color: #3273DC;
    cursor: pointer;
    font-weight: normal;
    text-decoration: none;
  }

  #description ul {
      list-style-type: disc;
      margin-top: -10px;
      margin-left: 40px;
      margin-bottom: 15px;
  }
    
  #description a:hover, 
  #description .video-link:hover {
    text-decoration: underline;
  }

  .figure, .video {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<body>
  <div id="description">
    <h2>What is a Convolutional Neural Network?</h2>
    <p>
		In machine learning, a classifier assigns a class label to a data point.  For example, an <em>image classifier</em> produces a class label (e.g, bird, plane) for what objects exist within an image.  A <em>convolutional neural network</em>, or CNN for short, is a type of classifier, which excels at solving this problem!
	 </p>
  	<p>
  		A CNN is a neural network: an algorithm used to recognize patterns in data. Neural Networks in general are composed of a collection of neurons that are organized in layers, each with their own learnable weights and biases.  Let’s break down a CNN into its basic building blocks.
  	</p>
  	<ol>
  		<li>A <strong>tensor</strong> can be thought of as an n-dimensional matrix.  In the CNN above, tensors will be 3-dimensional with the exception of the output layer.</li>
  		<li>A <strong>neuron</strong> can be thought of as a function that takes in multiple inputs and yields a single output.  The outputs of neurons are represented above as the <span style="color:#FF7577;">red</span> &rarr; <span style="color:#60A7D7;">blue</span> <strong>activation maps</strong>.</li>
  		<li>A <strong>layer</strong> is simply a collection of neurons with the same operation, including the same hyperparameters.</li>
  		<li><strong>Kernel weights and biases</strong>, while unique to each neuron, are tuned during the training phase, and allow the classifier to adapt to the problem and dataset provided.  They are encoded in the visualization with a <span style="color:#BC8435;">yellow</span> &rarr; <span style="color:#39988F;">green</span> diverging colorscale.  The specific values can be viewed in the <em>Interactive Formula View</em> by clicking a neuron or by hovering over the kernel/bias in the <em>Convolutional Elastic Explanation View</em>.</li>
  		<li>A CNN conveys a <strong>differentiable score function</strong>, which is represented as <strong>class scores</strong> in the visualization on the output layer.</li>
  	</ol> 
  	<p>
  		If you have studied neural networks before, these terms may sound familiar to you.  So what makes a CNN different? CNNs utilize a special type of layer, aptly named a convolutional layer, that makes them well-positioned to learn from image and image-like data.  Regarding image data, CNNs can be used for many different computer vision tasks, such as <a href="http://ijcsit.com/docs/Volume%207/vol7issue5/ijcsit20160705014.pdf" title="CNN Applications">image processing, classification, segmentation, and object detection</a>.
  	</p>  
  	<p>
  		In CNN Explainer, you can see how a simple CNN can be used for image classification.  Because of the network’s simplicity, its performance isn’t perfect, but that’s okay! The network architecture, <a href="http://cs231n.stanford.edu/" title="Tiny VGG Net presented by Stanford's CS231n">Tiny VGG</a>, used in CNN Explainer contains many of the same layers and operations used in state-of-the-art CNNs today, but on a smaller scale.  This way, it will be easier to understand getting started.
      </p>     

      <h2>What does each layer of the network do?</h2>
      <p>
  		Let’s walk through each layer in the network.  Feel free to interact with the visualization above by clicking and hovering over various parts of it as you read. 
      </p>
      <h4 id='article-input'>Input Layer</h4>
      <p>
      	The input layer (leftmost layer) represents the input image into the CNN.  Because we use RGB images as input, the input layer has three channels, corresponding to the red, green, and blue channels, respectively, which are shown in this layer. Use the color scale when you click on the <img class="is-rounded" width="12%" height="12%" src="PUBLIC_URL/assets/figures/network_details.png" alt="network details icon"/> icon above to display detailed information (on this layer, and others).
      </p>
      <h4 id='article-convolution'>Convolutional Layers</h4>
      <p>
  		The convolutional layers are the foundation of CNN, as they contain the learned kernels (weights), which extract features that distinguish different images from one another&mdash;this is what we want for classification!  As you interact with the convolutional layer, you will notice links between the previous layers and the convolutional layers.  Each link represents a unique kernel, which is used for the convolution operation to produce the current convolutional neuron’s output or activation map.  
  	</p>
  	<p>
  		The convolutional neuron performs an elementwise dot product with a unique kernel and the output of the previous layer’s corresponding neuron.  This will yield as many intermediate results as there are unique kernels.  The convolutional neuron is the result of all of the intermediate results summed together with the learned bias.
  	</p>
  	<p>
  		For example, let’s look at the first convolutional layer in the Tiny VGG architecture above.  Notice that there are 10 neurons in this layer, but only 3 neurons in the previous layer.  In the Tiny VGG architecture, convolutional layers are fully-connected, meaning each neuron is connected to every other neuron in the previous layer.  Focusing on the output of the topmost convolutional neuron from the first convolutional layer, we see that there are 3 unique kernels when we hover over the activation map.  
  	</p>
    <div class="figure">
      <img src="PUBLIC_URL/assets/figures/convlayer_overview_demo.gif" alt="clicking on topmost first conv. layer activation map" width=60% height=60% align="middle"/>
      <div class="figure-caption">
  		  Figure 1.  As you hover over the activation map of the topmost node from the first convolutional layer, you can see that 3 kernels were applied to yield this activation map.  After clicking this activation map, you can see the convolution operation occuring with each unique kernel.
  	  </div>
    </div>

  	<p>
  		The size of these kernels is a hyper-parameter specified by the designers of the network architecture.  In order to produce the output of the convolutional neuron (activation map), we must perform an elementwise dot product with the output of the previous layer and the unique kernel learned by the network.  In TinyVGG, the dot product operation uses a stride of 1, which means that the kernel is shifted over 1 pixel per dot product, but this is a hyperparameter that the network architecture designer can adjust to better fit their dataset.  We must do this for all 3 kernels, which will yield 3 intermediate results.  
  	</p>
    <div class="figure">
      <img src="PUBLIC_URL/assets/figures/convlayer_detailedview_demo.gif" alt="clicking on topmost first conv. layer activation map" />
      <div class="figure-caption">
        Figure 2. The kernel being applied to yield the topmost intermediate result for the discussed activation map.
      </div>
    </div>
  	<p>
  		Then, an elementwise sum is performed containing all 3 intermediate results along with the bias the network has learned.  After this, the resulting 2-dimensional tensor will be the activation map viewable on the interface above for the topmost neuron in the first convolutional layer.  This same operation must be applied to produce each neuron’s activation map.
  	</p>
  	<p>
  		With some simple math, we are able to deduce that there are 3 x 10 = 30 unique kernels, each of size 3x3, applied in the first convolutional layer.  The connectivity between the convolutional layer and the previous layer is a design decision when building a network architecture, which will affect the number of kernels per convolutional layer.  Click around the visualization to better understand the operations behind the convolutional layer.  See if you can follow the example above!
    </p>
    <h6>Understanding Hyperparameters</h6>
    <p>
    	<HyperparameterView/>
    </p>
    <ol>
    	<li><strong>Padding</strong> is often necessary when the kernel extends beyond the activation map.  Padding conserves data at the borders of activation maps, which leads to better performance, and it can help <a href="https://arxiv.org/pdf/1603.07285.pdf" title="See page 13">preserve the input's spatial size</a>, which allows an architecture designer to build deeper, higher performing networks.  There exist <a href="https://arxiv.org/pdf/1811.11718.pdf" title="Outlines major padding techniques">many padding techniques</a>, but the most commonly used approach is zero-padding because of its performance, simplicity, and computational efficiency.  The technique involves adding zeros symmetrically around the edges of an input.  This approach is adopted by many high-performing CNNs such as <a href="https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf" title="AlexNet">AlexNet</a>.</li>
    	<li><strong>Kernel size</strong>, often also referred to as filter size, refers to the dimensions of the sliding window over the input.  Choosing this hyperparameter has a massive impact on the image classification task.  For example, small kernel sizes are able to extract a much larger amount of information containing highly local features from the input.  As you can see on the visualization above, a smaller kernel size also leads to a smaller reduction in layer dimensions, which allows for a deeper architecture.  Conversely, a large kernel size extracts less information, which leads to a faster reduction in layer dimensions, often leading to worse performance.  Large kernels are better suited to extract features that are larger.  At the end of the day, choosing an appropriate kernel size will be dependent on your task and dataset, but generally, smaller kernel sizes lead to better performance for the image classification task because an architecture designer is able to stack <a href="https://arxiv.org/pdf/1409.1556.pdf" title="Learn why deeper networks perform better!">more and more layers together to learn more and more complex features</a>!</li>
    	<li><strong>Stride</strong> indicates how many pixels the kernel should be shifted over at a time.  For example, as described in the convolutional layer example above, Tiny VGG uses a stride of 1 for its convolutional layers, which means that the dot product is performed on a 3x3 window of the input to yield an output value, then is shifted to the right by one pixel for every subsequent operation.  The impact stride has on a CNN is similar to kernel size.  As stride is decreased, more features are learned because more data is extracted, which also leads to larger output layers.  On the contrary, as stride is increased, this leads to more limited feature extraction and smaller output layer dimensions.  One responsibility of the architecture designer is to ensure that the kernel slides across the input symmetrically when implementing a CNN.  Use the hyperparameter visualization above to alter stride on various input/kernel dimensions to understand this constraint!</li>
    </ol>
    <h4>Activation Functions</h4>
    <h6 id='article-relu'>ReLU</h6>
    <p>
    	Neural networks are extremely prevalent in modern technology&mdash;because they are so accurate!  The highest performing CNNs today consist of an absurd amount of layers, which are able to learn more and more features.  Part of the reason these groundbreaking CNNs are able to achieve such <a href="https://arxiv.org/pdf/1512.03385.pdf" title="ResNet">tremendous accuracies</a> is because of their non-linearity.  ReLU applies much-needed non-linearity into the model.  Non-linearity is necessary to produce non-linear decision boundaries, so that the output cannot be written as a linear combination of the inputs.  If a non-linear activation function was not present, deep CNN architectures would devolve into a single, equivalent convolutional layer, which would not perform nearly as well.  The ReLU activation function is specifically used as a non-linear activation function, as opposed to other non-linear functions such as <em>Sigmoid</em> because it has been <a href="https://arxiv.org/pdf/1906.01975.pdf" title="See page 29">empirically observed</a> that CNNs using ReLU are faster to train than their counterparts.
    </p>
    <p>
  	The ReLU activation function is an elementwise mathematical operation: {reluEquation}
    </p>
    <div class="figure">
    <img src="PUBLIC_URL/assets/figures/relu_graph.png" alt="relu graph" width="30%" height="30%"/>
      <div class="figure-caption">
        Figure 3. The ReLU activation function graphed, which disregards all negative data.
      </div>
    </div>
    <p>
  	This activation function is applied elementwise on every value from the input tensor.  For example, if applied ReLU on the value 2.24, the result would be 2.24, since 2.24 is larger than 0.  You can observe how this activation function is applied by clicking a ReLU neuron in the network above.  The Rectified Linear Activation function (ReLU) is performed after every convolutional layer in the network architecture outlined above.  Notice the impact this layer has on the activation map of various neurons throughout the network!
    </p>
    <h6 id='article-softmax'>Softmax</h6>
    <p>
    	{softmaxEquation}
    	A softmax operation serves a key purpose: making sure the CNN outputs sum to 1.  Because of this, softmax operations are useful to scale model outputs into probabilities.  Clicking on the last layer reveals the softmax operation in the network. Notice how the logits after flatten aren’t scaled between zero to one.  For a visual indication of the impact of each logit (unscaled scalar value), they are encoded using a <span style="color:#FFC385;">light orange</span> &rarr; <span style="color:#C44103;">dark orange</span> color scale.  After passing through the softmax function, each class now corresponds to an appropriate probability! 
    </p>
    <p>
    	You might be thinking what the difference between standard normalization and softmax is&mdash;after all, both rescale the logits between 0 and 1.  Remember that backpropagation is a key aspect of training neural networks&mdash;we want the correct answer to have the largest “signal.” By using softmax, we are effectively “approximating” argmax while gaining differentiability.  Rescaling doesn’t weigh the max significantly higher than other logits, whereas softmax does.  Simply put, softmax is a “softer” argmax&mdash;see what we did there?
    </p>
    <div class="figure">
    <img src="PUBLIC_URL/assets/figures/softmax_animation.gif" alt="softmax interactive formula view"/>
      <div class="figure-caption">
        Figure 4. The <em>Softmax Interactive Formula View</em> allows a user to interact with both the color encoded logits and formula to understand how the prediction scores after the flatten layer are normalized to yield classification scores.
      </div>
    </div>
    <h4 id='article-pooling'>Pooling Layers</h4>
    <p>
    	There are many types of pooling layers in different CNN architectures, but they all have the purpose of gradually decreasing the spatial extent of the network, which reduces the parameters and overall computation of the network.  The type of pooling used in the Tiny VGG architecture above is Max-Pooling.
    </p>
    <p>
    	The Max-Pooling operation requires selecting a kernel size and a stride length during architecture design.  Once selected, the operation slides the kernel with the specified stride over the input while only selecting the largest value at each kernel slice from the input to yield a value for the output.  This process can be viewed by clicking a pooling neuron in the network above.
    </p>
    <p>
    	In the Tiny VGG architecture above, the pooling layers use a 2x2 kernel and a stride of 2.  This operation with these specifications results in the discarding of 75% of activations.  By discarding so many values, Tiny VGG is more computationally efficient and avoids overfitting.
    </p>
    <h4 id='article-flatten'>Flatten Layer</h4>
    <p>      
      This layer converts a three-dimensional layer in the network into a one-dimensional vector to fit the  input of a fully-connected layer for classification.  For example, a 5x5x2 tensor would be converted into a vector of size 50.  The previous convolutional layers of the network extracted the features from the input image, but now it is time to classify the features.  We use the softmax function to classify these features, which requires a 1-dimensional input.  This is why the flatten layer is necessary.  This layer can be viewed by clicking any output class.  
    </p>

    <h2>Interactive features</h2>
    <ol>
    	<li><strong>Upload your own image</strong> by selecting <img class="icon is-rounded" src="PUBLIC_URL/assets/figures/upload_image_icon.png" alt="upload image icon"/> to understand how your image is classified into the 10 classes.  By analyzing the neurons throughout the network, you can understand the activations maps and extracted features.</li>
    	<li><strong>Change the activation map colorscale</strong> to better understand the impact of activations at different levels of abstraction by adjusting <img class="is-rounded" width="12%" height="12%" src="PUBLIC_URL/assets/figures/heatmap_scale.png" alt="heatmap"/>.</li>
    	<li><strong>Understand network details</strong> such as layer dimensions and colorscales by clicking the <img class="is-rounded" width="12%" height="12%" src="PUBLIC_URL/assets/figures/network_details.png" alt="network details icon"/> icon.</li>
    	<li><strong>Simulate network operations</strong> by clicking the <img class="icon is-rounded" src="PUBLIC_URL/assets/figures/play_button.png" alt="play icon"/> button or interact with the layer slice in the <em>Interactive Formula View</em> by hovering over portions of the input or output to understand the mappings and underlying operations.</li>
      <li><strong>Learn layer functions</strong> by clicking <img class="icon is-rounded" src="PUBLIC_URL/assets/figures/info_button.png" alt="info icon"/> from the <em>Interactive Formula View</em> to read layer details from the article.</li>
    </ol> 

    <h2>Video Tutorial</h2>
    <ul>
      <li class="video-link" on:click={currentPlayer.play(0)}>
        CNN Explainer Introduction
        <small>(0:00-0:22)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(27)}>
        <em>Overview</em>
        <small>(0:27-0:37)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(37)}>
        Convolutional <em>Elastic Explanation View</em>
        <small>(0:37-0:46)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(46)}>
        Convolutional, ReLU, and Pooling <em>Interactive Formula Views</em>
        <small>(0:46-1:21)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(82)}>
        Flatten <em>Elastic Explanation View</em>
        <small>(1:22-1:41)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(101)}>
        Softmax <em>Interactive Formula View</em>
        <small>(1:41-2:02)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(126)}>
        Engaging Learning Experience: Understanding Classification
        <small>(2:06-2:28)</small>
      </li>
      <li class="video-link" on:click={currentPlayer.play(149)}>
        Interactive Tutorial Article
        <small>(2:29-2:54)</small>
      </li>
    </ul>
    <div class="video">
      <Youtube videoId="HnWIHWFbuUQ" playerId="demo_video" bind:this={currentPlayer}/>
    </div>

    <h2>How is CNN Explainer implemented?</h2>
    <p>
      CNN Explainer uses <a href="https://js.tensorflow.org/"><em>TensorFlow.js</em></a>, an in-browser GPU-accelerated deep learning library to load the pretrained model for visualization.  The entire interactive system is written in Javascript using <a href="https://svelte.dev/"><em>Svelte</em></a> as a framework and <a href="https://d3js.org/"><em>D3.js</em></a> for visualizations. You only need a web browser to get started learning CNNs today!
    </p>

    <h2>Who developed CNN Explainer?</h2>
    <p>
      CNN Explainer was created by 
      <a href="https://zijie.wang/">Jay Wang</a>,
      <a href="https://www.linkedin.com/in/robert-turko/">Robert Turko</a>, 
      <a href="http://oshaikh.com/">Omar Shaikh</a>,
      <a href="https://haekyu.com/">Haekyu Park</a>,
      <a href="http://nilakshdas.com/">Nilaksh Das</a>,
      <a href="https://fredhohman.com/">Fred Hohman</a>,
      <a href="http://minsuk.com">Minsuk Kahng</a>, and
      <a href="https://www.cc.gatech.edu/~dchau/">Polo Chau</a>,
      which was the result of a research collaboration between 
      Georgia Tech and Oregon State.  We thank Anmol Chhabria, Kaan Sancak, Kantwon Rogers, and the Georgia Tech Visualization Lab for their support and constructive feedback.  This work was supported in part by NSF grants IIS-1563816, CNS-1704701, NASA NSTRF, DARPA GARD, gifts from Intel, NVIDIA, Google, Amazon.
    </p>
  </div>
</body>



================================================
FILE: src/article/Youtube.svelte
================================================
<script context="module">
	let iframeApiReady = false;

	import { setContext, onMount } from "svelte";
	var tag = document.createElement("script");
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName("script")[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	window.onYouTubeIframeAPIReady = () =>
	window.dispatchEvent(new Event("iframeApiReady"));
</script>

<script>
	import { createEventDispatcher } from "svelte";
	import { getContext } from "svelte";
	export let videoId;
	export let playerId = "player";

	let player;
	export function play(startSecond = 0){
		player.seekTo(startSecond);
		player.playVideo()
	}
	const dispatch = createEventDispatcher();
	window.addEventListener("iframeApiReady", function(e) {
		player = new YT.Player(playerId, {
			videoId,
			events: {
				onReady: onPlayerReady
			}
		});
	});
	function onPlayerReady(event) {
      player.mute()
    }
</script>

<div id={playerId} />


================================================
FILE: src/detail-view/ActivationAnimator.svelte
================================================
<script>
  import { createEventDispatcher } from 'svelte';
  import { array1d, getMatrixSliceFromOutputHighlights,
    getVisualizationSizeConstraint, getMatrixSliceFromInputHighlights, gridData
  } from './DetailviewUtils.js';
  import Dataview from './Dataview.svelte';

  export let image;
  export let output;
  export let isPaused;
  export let dataRange;

  const dispatch = createEventDispatcher();
  const padding = 0;
  let padded_input_size = image.length + padding * 2;
  $: padded_input_size = image.length + padding * 2;

  let gridInputMatrixSlice = gridData([[0]]);
  let gridOutputMatrixSlice = gridData([[0]]);
  let inputHighlights = array1d(image.length * image.length, (i) => true);
  let outputHighlights = array1d(output.length * output.length, (i) => true);
  let interval;
  $ : {
    let inputHighlights = array1d(image.length * image.length, (i) => true);
    let outputHighlights = array1d(output.length * output.length, (i) => true);
    let interval;
  }

  let counter;

  // lots of replication between mouseover and start-relu. TODO: fix this.
  function startRelu() {
    counter = 0;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (isPaused) return;
      const flat_animated = counter % (output.length * output.length);
      outputHighlights = array1d(output.length * output.length, (i) => false);
      inputHighlights = array1d(image.length * image.length, (i) => undefined);
      const animatedH = Math.floor(flat_animated / output.length);
      const animatedW = flat_animated % output.length;
      outputHighlights[animatedH * output.length + animatedW] = true;
      inputHighlights[animatedH * output.length + animatedW] = true;
      const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, 1);
      gridInputMatrixSlice = gridData(inputMatrixSlice);
      const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
      gridOutputMatrixSlice = gridData(outputMatrixSlice);
      counter++;
    }, 250)
  }

  function handleMouseover(event) {
    outputHighlights = array1d(output.length * output.length, (i) => false);
    const animatedH = event.detail.hoverH;
    const animatedW = event.detail.hoverW;
    outputHighlights[animatedH * output.length + animatedW] = true;
    inputHighlights = array1d(image.length * image.length, (i) => undefined);
    inputHighlights[animatedH * output.length + animatedW] = true;
    const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, 1);
    gridInputMatrixSlice = gridData(inputMatrixSlice);
    const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    gridOutputMatrixSlice = gridData(outputMatrixSlice);
    isPaused = true;
    dispatch('message', {
      text: isPaused
    });
  }

  startRelu();
  let gridImage = gridData(image)
  let gridOutput = gridData(output)
  $ : {
    startRelu();
    gridImage = gridData(image)
    gridOutput = gridData(output)
  }
</script>

<style>
  .column {
    padding: 5px;
  }
</style>

<div class="column has-text-centered">
  <div class="header-text">
    Input ({image.length}, {image[0].length})
  </div>
  <Dataview on:message={handleMouseover} data={gridImage} highlights={inputHighlights} outputLength={output.length}
      isKernelMath={false} constraint={getVisualizationSizeConstraint(image.length)} dataRange={dataRange} stride={1}/>  
</div>
<div class="column has-text-centered">
  <span>
    max(
    <Dataview data={gridData([[0]])} highlights={outputHighlights} isKernelMath={true} 
    constraint={20} dataRange={dataRange}/>
    ,
    <Dataview data={gridInputMatrixSlice} highlights={outputHighlights} isKernelMath={true} 
    constraint={20} dataRange={dataRange}/>
    )
    =
    <Dataview data={gridOutputMatrixSlice} highlights={outputHighlights} isKernelMath={true} 
      constraint={20} dataRange={dataRange}/>
  </span> 
</div>
<div class="column has-text-centered">
  <div class="header-text">
    Output ({output.length}, {output[0].length})
  </div>
  <Dataview on:message={handleMouseover} data={gridOutput} highlights={outputHighlights} isKernelMath={false} 
      outputLength={output.length} constraint={getVisualizationSizeConstraint(output.length)} dataRange={dataRange} stride={1}/>
</div>


================================================
FILE: src/detail-view/Activationview.svelte
================================================
<script>
	import ActivationAnimator from './ActivationAnimator.svelte';
  import { createEventDispatcher } from 'svelte';

  export let input;
  export let output;
  export let dataRange;
  export let isExited;

  const dispatch = createEventDispatcher();
  let isPaused = false;
  
  function handleClickPause() {
    isPaused = !isPaused;
  }

  function handlePauseFromInteraction(event) {
    isPaused = event.detail.text;
  }

  function handleClickX() {
    dispatch('message', {
      text: true
    });
  }

  function handleScroll() {
    let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
    let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
    let anchor = document.querySelector(`#article-relu`);
    scroll.animateScroll(anchor);
  }
</script>

<style>
  .control-pannel {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .control-button {
    color: gray;
    font-size: 15px;
    opacity: 0.4;
    cursor: pointer;
  }

  .control-button:not(:first-child) {
    margin-left: 5px;
  }

  .annotation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left : 10px;
    font-size: 12px;
  }

  .annotation > img {
    width: 17px;
    margin-right: 5px;
  }

  .control-button:hover {
    opacity: 0.8;
  }

  .box {
    padding: 5px 15px 10px 15px;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-text {
    font-size: 1.2em;
    font-weight: 500;
    color: #4a4a4a;
  }
</style>

{#if !isExited}
  <div class="container">
    <div class="box">

      <div class="control-pannel">

        <div class="title-text">
          ReLU Activation
        </div>

        <div class="buttons">

          <div class="control-button" on:click={handleScroll} title="Jump to article section">
            <i class="fas fa-info-circle"></i>
          </div>

          <div class="play-button control-button" on:click={handleClickPause} title="Play animation">
            {@html isPaused ?
              '<i class="fas fa-play-circle play-icon"></i>' :
              '<i class="fas fa-pause-circle"></i>'}
          </div>

          <div class="delete-button control-button" on:click={handleClickX} title="Close">
              <i class="fas control-icon fa-times-circle"></i>
          </div>
        </div>

      </div>

      <div class="container is-centered is-vcentered">
        <ActivationAnimator on:message={handlePauseFromInteraction} 
          image={input} output={output} isPaused={isPaused}
          dataRange={dataRange}/>
      </div>

      <div class="annotation">
        <img src='PUBLIC_URL/assets/img/pointer.svg' alt='pointer icon'>
        <div class="annotation-text">
          <span style="font-weight:600">Hover over</span> the matrices to change pixel.
        </div>
      </div>

    </div>
  </div>
{/if}


================================================
FILE: src/detail-view/ConvolutionAnimator.svelte
================================================
<script>
  import { createEventDispatcher } from 'svelte';
  import { array1d, getMatrixSliceFromOutputHighlights,
    compute_input_multiplies_with_weight, getDataRange,
    getVisualizationSizeConstraint, generateOutputMappings,
    getMatrixSliceFromInputHighlights, gridData
  } from './DetailviewUtils.js';
  import Dataview from './Dataview.svelte';
  import KernelMathView from './KernelMathView.svelte';
  // image: nxn array -- prepadded.
  // kernel: mxm array.
  // stride: int
  export let stride;
  export let dilation
  export let kernel;
  export let image;
  export let output;
  export let isPaused;
  export let dataRange;
  export let colorScale;
  export let isInputInputLayer = false;

  const dispatch = createEventDispatcher();
  const padding = 0;
  let padded_input_size = image.length + padding * 2;
  $: padded_input_size = image.length + padding * 2;

  // Dummy data for original state of component.
  let testInputMatrixSlice = [];
  for (let i = 0; i < kernel.length; i++) {
    testInputMatrixSlice.push([]);
    for (let j = 0; j < kernel.length; j++) {
      testInputMatrixSlice[i].push(0)
    }
  }
  testInputMatrixSlice = gridData(testInputMatrixSlice)
  let testOutputMatrixSlice = gridData([0]);

  let inputHighlights = [];
  let outputHighlights = array1d(output.length * output.length, (i) => true);
  let interval;
  $ : {
    let inputHighlights = [];
    let outputHighlights = array1d(output.length * output.length, (i) => true);
    let interval;
  }

  let counter;
  // lots of replication between mouseover and start-conv. TODO: fix this.
  function startConvolution(stride) {
    counter = 0;
    let outputMappings = generateOutputMappings(stride, output, kernel.length, padded_input_size, dilation);
    if (stride <= 0) return;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (isPaused) return;
      const flat_animated = counter % (output.length * output.length);
      outputHighlights = array1d(output.length * output.length, (i) => false);
      const animatedH = Math.floor(flat_animated / output.length);
      const animatedW = flat_animated % output.length;
      outputHighlights[animatedH * output.length + animatedW] = true;
      inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernel.length, outputMappings, kernel.length)
      const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernel.length);
      testInputMatrixSlice = gridData(inputMatrixSlice);
      const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
      testOutputMatrixSlice = gridData(outputMatrixSlice);
      counter++;
    }, 250)
  }

  function handleMouseover(event) {
    let outputMappings = generateOutputMappings(stride, output, kernel.length, padded_input_size, dilation);
    outputHighlights = array1d(output.length * output.length, (i) => false);
    const animatedH = event.detail.hoverH;
    const animatedW = event.detail.hoverW;
    outputHighlights[animatedH * output.length + animatedW] = true;
    inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernel.length, outputMappings, kernel.length)
    const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernel.length);
    testInputMatrixSlice = gridData(inputMatrixSlice);
    const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    testOutputMatrixSlice = gridData(outputMatrixSlice);
    isPaused = true;
    dispatch('message', {
      text: isPaused
    });
  }

  startConvolution(stride);
  let testImage = gridData(image)
  let testOutput = gridData(output)
  let testKernel = gridData(kernel)
  $ : {
    startConvolution(stride);
    testImage = gridData(image)
    testOutput = gridData(output)
    testKernel = gridData(kernel)
  }
</script>

<style>
  .column {
    padding: 5px;
  }
</style>

<div class="column has-text-centered">
  <div class="header-text">
    Input ({image.length}, {image[0].length})
  </div>
  <Dataview on:message={handleMouseover} data={testImage} highlights={inputHighlights} outputLength={output.length}
      isKernelMath={false} constraint={getVisualizationSizeConstraint(image.length)}
      dataRange={dataRange} stride={stride} colorScale={colorScale}
      isInputLayer={isInputInputLayer}/>
</div>
<div class="column has-text-centered">
  <KernelMathView data={testInputMatrixSlice} kernel={testKernel} constraint={getVisualizationSizeConstraint(kernel.length)}
                  dataRange={dataRange} kernelRange={getDataRange(kernel)} colorScale={colorScale}
                  isInputLayer={isInputInputLayer}/>
  <Dataview data={testOutputMatrixSlice} highlights={outputHighlights} isKernelMath={true} 
      constraint={getVisualizationSizeConstraint(kernel.length)} dataRange={dataRange}/>
</div>
<div class="column has-text-centered">
  <div class="header-text">
    Output ({output.length}, {output[0].length})
  </div>
  <Dataview on:message={handleMouseover} data={testOutput} highlights={outputHighlights} isKernelMath={false}
      outputLength={output.length} constraint={getVisualizationSizeConstraint(output.length)} dataRange={dataRange} stride={stride}/>
</div>


================================================
FILE: src/detail-view/Convolutionview.svelte
================================================
<script>
	import ConvolutionAnimator from './ConvolutionAnimator.svelte';
  import { singleConv } from '../utils/cnn.js';
  import { createEventDispatcher } from 'svelte';

  export let input;
  export let kernel;
  export let dataRange;
  export let colorScale = d3.interpolateRdBu;
  export let isInputInputLayer = false;
  export let isExited = false;
  // export let output;
  
  const dispatch = createEventDispatcher();
	let stride = 1;
  const dilation = 1;
  var isPaused = false;
  var outputFinal = singleConv(input, kernel, stride);
  $: if (stride > 0) {
    try { 
      outputFinal = singleConv(input, kernel, stride);
    } catch {
      console.log("Cannot handle stride of " + stride);
    }
  }
  
  function handleClickPause() {
    isPaused = !isPaused;
  }

  function handleScroll() {
    let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
    let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
    let anchor = document.querySelector(`#article-convolution`);
    scroll.animateScroll(anchor);
  }

  function handlePauseFromInteraction(event) {
    isPaused = event.detail.text;
  }

  function handleClickX() {
    isExited = true;
    dispatch('message', {
      text: isExited
    });
  }
</script>

<style>
  .control-pannel {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .control-button {
    color: gray;
    font-size: 15px;
    opacity: 0.4;
    cursor: pointer;
  }

  .control-button:not(:first-child) {
    margin-left: 5px;
  }

  .annotation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left : 10px;
    font-size: 12px;
  }

  .annotation > img {
    width: 17px;
    margin-right: 5px;
  }

  .control-button:hover {
    opacity: 0.8;
  }

  .box {
    padding: 5px 15px 10px 15px;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .title-text {
    font-size: 1.2em;
    font-weight: 500;
    color: #4a4a4a;
  }
</style>

{#if !isExited}
  <div class="container" id="detailview-container">

    <!-- old stride input -->
    <!-- <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input class="input" type="text" placeholder="Stride" bind:value={stride} />
          </p>
          <p class="control">
            <button class="button is-success" on:click={handleClickPause}>
              Toggle Movement
            </button>
          </p>
        </div>
      </div>
    </div> -->

    <div class="box">

      <div class="control-pannel">

        <div class="title-text">
          Convolution
        </div>

        <div class="buttons">
          <div class="control-button" on:click={handleScroll} title="Jump to article section">
            <i class="fas fa-info-circle"></i>
          </div>

          <div class="play-button control-button" on:click={handleClickPause} title="Play animation">
            {@html isPaused ?
              '<i class="fas fa-play-circle play-icon"></i>' :
              '<i class="fas fa-pause-circle"></i>'}
          </div>

          <div class="delete-button control-button" on:click={handleClickX} title="Close">
            <i class="fas control-icon fa-times-circle"></i>
          </div>
        </div>
      </div>

      <div class="container is-centered">
        <ConvolutionAnimator on:message={handlePauseFromInteraction} 
          kernel={kernel} image={input} output={outputFinal} 
          stride={stride} dilation={dilation} isPaused={isPaused}
          dataRange={dataRange} colorScale={colorScale}
          isInputInputLayer={isInputInputLayer} />
      </div>

      <div class="annotation">
        <img src='PUBLIC_URL/assets/img/pointer.svg' alt='pointer icon'>
        <div class="annotation-text">
          <span style="font-weight:600">Hover over</span> the matrices to change kernel position.
        </div>
      </div>

    </div>
  </div>
{/if}


================================================
FILE: src/detail-view/Dataview.svelte
================================================
<script>
  export let data;
  export let highlights;
  export let isKernelMath;
  export let constraint;
  export let dataRange;
  export let outputLength = undefined;
  export let stride = undefined;
  export let colorScale = d3.interpolateRdBu;
  export let isInputLayer = false;

  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import { beforeUpdate, afterUpdate } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  let grid_final;
  const textConstraintDivisor = 2.6;
  const standardCellColor = "ddd";
  const dispatch = createEventDispatcher();

  let oldHighlight = highlights;
  let oldData = data;

  const redraw = () => {
    d3.select(grid_final).selectAll("#grid > *").remove();
    const constrainedSvgSize = data.length * constraint + 2;
    var grid = d3.select(grid_final).select("#grid")
      .attr("width", constrainedSvgSize + "px")
      .attr("height", constrainedSvgSize + "px")
      .append("svg")
      .attr("width", constrainedSvgSize + "px")
      .attr("height", constrainedSvgSize + "px")
    var row = grid.selectAll(".row")
      .data(data)
      .enter().append("g")
      .attr("class", "row");
    var column = row.selectAll(".square")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("class","square")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .style("opacity", 0.8)
      .style("fill", function(d) {
        let normalizedValue = d.text;
        if (isInputLayer){
          normalizedValue = 1 - d.text;
        } else {
          normalizedValue = (d.text + dataRange / 2) / dataRange;
        }
        return colorScale(normalizedValue);
      })
      .on('mouseover', function(d) {
        if (data.length != outputLength) {
          dispatch('message', {
            hoverH: Math.min(Math.floor(d.row / stride), outputLength - 1),
            hoverW: Math.min(Math.floor(d.col / stride), outputLength - 1)
          });
        } else {
          dispatch('message', {
            hoverH: Math.min(Math.floor(d.row / 1), outputLength - 1),
            hoverW: Math.min(Math.floor(d.col / 1), outputLength - 1)
          });
        }
      });
    if (isKernelMath) {
      var text = row.selectAll(".text")
        .data(function(d) { return d; })
        .enter().append("text")
        .attr("class","text")
        .style("font-size", Math.floor(constraint / textConstraintDivisor) + "px")
        .attr("x", function(d) { return d.x + d.width / 2; })
        .attr("y", function(d) { return d.y + d.height / 2; })
        .style("fill", function(d) {
        let normalizedValue = d.text;
          if (isInputLayer){
            normalizedValue = 1 - d.text;
          } else {
            normalizedValue = (d.text + dataRange / 2) / dataRange;
          }
          if (normalizedValue < 0.2 || normalizedValue > 0.8) {
            return 'white';
          } else {
            return 'black';
          }
        })
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text(function(d) {
          return d.text.toString().replace('-', '－');
        })
    }
  }

  afterUpdate(() => {
    if (data != oldData) {
      redraw();
      oldData = data;
    }

    if (highlights != oldHighlight) {
      var grid = d3.select(grid_final).select('#grid').select("svg")
      grid.selectAll(".square")
        .style("stroke", (d) => isKernelMath || (highlights.length && highlights[d.row * data.length + d.col]) ? "black" : null )
      oldHighlight = highlights;
    }

  });

  onMount(() => {
    redraw();
  });

</script>

<div style="display: inline-block; vertical-align: middle;" class="grid"
  bind:this={grid_final}>
  <svg id="grid" width=100% height=100%></svg>
</div>


================================================
FILE: src/detail-view/DetailviewUtils.js
================================================
import { matrixSlice } from '../utils/cnn.js';

export function array1d(length, f) {
  return Array.from({length: length}, f ? ((v, i) => f(i)) : undefined);
}

function array2d(height, width, f) {
  return Array.from({length: height}, (v, i) => Array.from({length: width}, f ? ((w, j) => f(i, j)) : undefined));
}

export function generateOutputMappings(stride, output, kernelLength, padded_input_size, dilation) {
  const outputMapping = array2d(output.length, output.length, (i, j) => array2d(kernelLength, kernelLength));
  for (let h_out = 0; h_out < output.length; h_out++) {
    for (let w_out = 0; w_out < output.length; w_out++) {
      for (let h_kern = 0; h_kern < kernelLength; h_kern++) {
        for (let w_kern = 0; w_kern < kernelLength; w_kern++) {
          const h_im = h_out * stride + h_kern * dilation;
          const w_im = w_out * stride + w_kern * dilation;
          outputMapping[h_out][w_out][h_kern][w_kern] = h_im * padded_input_size + w_im;
        }
      }
    }
  }
  return outputMapping;
}

export function compute_input_multiplies_with_weight(hoverH, hoverW, 
                                              padded_input_size, weight_dims, outputMappings, kernelLength) {
  
  const [h_weight, w_weight] = weight_dims;
  const input_multiplies_with_weight = array1d(padded_input_size * padded_input_size);
  for (let h_weight = 0; h_weight < kernelLength; h_weight++) {
    for (let w_weight = 0; w_weight < kernelLength; w_weight++) {
      const flat_input = outputMappings[hoverH][hoverW][h_weight][w_weight];
      if (typeof flat_input === "undefined") continue;
      input_multiplies_with_weight[flat_input] = [h_weight, w_weight];
    }
  }
  return input_multiplies_with_weight;
}

export function getMatrixSliceFromInputHighlights(matrix, highlights, kernelLength) {
  var indices = highlights.reduce((total, value, index) => {
  if (value != undefined) total.push(index);
    return total;
  }, []);
  return matrixSlice(matrix, Math.floor(indices[0] / matrix.length), Math.floor(indices[0] / matrix.length) + kernelLength, indices[0] % matrix.length, indices[0] % matrix.length + kernelLength);
}

export function getMatrixSliceFromOutputHighlights(matrix, highlights) {
  var indices = highlights.reduce((total, value, index) => {
  if (value != false) total.push(index);
    return total;
  }, []);
  return matrixSlice(matrix, Math.floor(indices[0] / matrix.length), Math.floor(indices[0] / matrix.length) + 1, indices[0] % matrix.length, indices[0] % matrix.length + 1);
}

// Edit these values to change size of low-level conv visualization.
export function getVisualizationSizeConstraint(imageLength) {
  let sizeOfGrid = 150;
  let maxSizeOfGridCell = 20;
  return sizeOfGrid / imageLength > maxSizeOfGridCell ? maxSizeOfGridCell : sizeOfGrid / imageLength;
}

export function getDataRange(image) {
  let maxRow = image.map(function(row){ return Math.max.apply(Math, row); });
  let max = Math.max.apply(null, maxRow);
  let minRow = image.map(function(row){ return Math.min.apply(Math, row); });
  let min = Math.min.apply(null, minRow);
  let range = {
    range: 2 * Math.max(Math.abs(min), Math.abs(max)),
    min: min,
    max: max
  };
  return range;
}

export function gridData(image, constraint=getVisualizationSizeConstraint(image.length)) {
  // Constrain grids based on input image size.
  var data = new Array();
  var xpos = 1;
  var ypos = 1;
  var width = constraint;
  var height = constraint;
  for (var row = 0; row < image.length; row++) {
    data.push( new Array() );
    for (var column = 0; column < image[0].length; column++) {
      data[row].push({
        text: Math.round(image[row][column] * 100) / 100,
        row: row,
        col: column,
        x: xpos,
        y: ypos,
        width: width,
        height: height
      })
      xpos += width;
    }
    xpos = 1;
    ypos += height; 
  }
  return data;
}


================================================
FILE: src/detail-view/HyperparameterAnimator.svelte
================================================
<script>
  import { createEventDispatcher } from 'svelte';
  import { array1d, compute_input_multiplies_with_weight,
          generateOutputMappings, gridData
  } from './DetailviewUtils.js';
  import HyperparameterDataview from './HyperparameterDataview.svelte';
  import KernelMathView from './KernelMathView.svelte';
  // image: nxn array -- prepadded.
  // kernel: mxm array.
  // stride: int
  export let stride;
  export let dilation
  export let kernel;
  export let image;
  export let output;
  export let isPaused;
  export let padding;
  export let isStrideValid;

  const dispatch = createEventDispatcher();

  let inputHighlights = [];
  let outputHighlights = array1d(output.length * output.length, (i) => true);
  let interval;
  $ : {
    let inputHighlights = [];
    let outputHighlights = array1d(output.length * output.length, (i) => true);
    let interval;
  }

  let counter;
  // lots of replication between mouseover and start-conv. TODO: fix this.
  function startConvolution(stride) {
    counter = 0;
    isPaused = false;
    dispatch('message', {
      text: isPaused
    });
    let outputMappings = generateOutputMappings(stride, output, kernel.length, image.length, dilation);
    if (stride <= 0) return;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (isPaused || !isStrideValid) return;
      const flat_animated = counter % (output.length * output.length);
      outputHighlights = array1d(output.length * output.length, (i) => false);
      const animatedH = Math.floor(flat_animated / output.length);
      const animatedW = flat_animated % output.length;
      outputHighlights[animatedH * output.length + animatedW] = true;
      inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, image.length, kernel.length, outputMappings, kernel.length)
      counter++;
    }, 1000)
  }

  function handleMouseover(event) {
    let outputMappings = generateOutputMappings(stride, output, kernel.length, image.length, dilation);
    outputHighlights = array1d(output.length * output.length, (i) => false);
    const animatedH = event.detail.hoverH;
    const animatedW = event.detail.hoverW;
    outputHighlights[animatedH * output.length + animatedW] = true;
    inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, image.length, kernel.length, outputMappings, kernel.length)
    isPaused = true;
    dispatch('message', {
      text: isPaused
    });
  }

  // Fix the total grid size to change hyperparameters without changing the grid
  // size.  This must be two pixels smaller than the HyperparameterDataview svg
  // size, so that the stroke on the right side of the grid does not get cut off.
  const gridSize = 198;
  startConvolution(stride);
  let testImage = gridData(image, gridSize / image.length);
  let testOutput = gridData(output, gridSize / output.length);
  let testKernel = gridData(kernel, gridSize / kernel.length);
  $ : {
    startConvolution(stride);
    testImage = gridData(image, gridSize / image.length);
    testOutput = gridData(output, gridSize / output.length);
    testKernel = gridData(kernel, gridSize / kernel.length);
  }
</script>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  .column {
    padding: 5px 10px 10px 10px;
  }

  .header-text {
    line-height: 1.1;
  }

  .header-sub-text {
    font-size: 13px;
    color: #9a9a9a;
    margin-bottom: 2px;
  }
</style>

<div class="wrapper">
  <div class="column has-text-centered">
    <div class="header-text">
      Input ({image.length - 2 * padding}, {image.length - 2 * padding}) <br/>
    </div>
    <div class="header-sub-text">
      After-padding ({image.length}, {image.length})
    </div>
    <HyperparameterDataview on:message={handleMouseover} data={testImage} highlights={inputHighlights}
        outputLength={output.length} stride={stride} padding={padding} isStrideValid={isStrideValid}/>
  </div>
  <div class="column has-text-centered">
    <div class="header-text" style="padding-top: 27px;">
      Output ({output.length}, {output.length})
    </div>
    <div class="header-sub-text">
      &nbsp;
    </div>
    <HyperparameterDataview on:message={handleMouseover} data={testOutput} highlights={outputHighlights}
        outputLength={output.length} stride={stride} padding={padding} isOutput={true} isStrideValid={isStrideValid}/>
  </div>
</div>


================================================
FILE: src/detail-view/HyperparameterDataview.svelte
================================================
<script>
  export let data;
  export let highlights;
  export let outputLength;
  export let stride;
  export let padding;
  export let isOutput = false;
  export let isStrideValid;

  import { onMount } from 'svelte';
  import { afterUpdate } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  let grid_final;
  const standardCellColor = "#ddd";
  const paddingCellColor = "#aaa";
  const dispatch = createEventDispatcher();

  let oldHighlight = highlights;
  let oldData = data;

  const redraw = () => {
    d3.select(grid_final).selectAll("#grid > *").remove();
    var grid = d3.select(grid_final).select("#grid")
      .attr("width", 200)
      .attr("height", 200)
      .append("svg")
      .attr("width", 200)
      .attr("height", 200)
    var row = grid.selectAll(".row")
      .data(data)
      .enter().append("g")
      .attr("class", "row");
    var column = row.selectAll(".square")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("class","square")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .style("opacity", 0.5)
      .style("stroke", "black")
      .style("fill", function(d) {
        // Colors cells appropriately that represent padding.
        if (!isOutput && (d.row < padding || d.row > data.length - padding - 1
          || d.col < padding || d.col > data.length - padding - 1)) {
          return paddingCellColor;
        } 
        return standardCellColor;
      })
      .on('mouseover', function(d) {
        if (!isStrideValid) return;
        if (data.length != outputLength) {
          dispatch('message', {
            hoverH: Math.min(Math.floor(d.row / stride), outputLength - 1),
            hoverW: Math.min(Math.floor(d.col / stride), outputLength - 1)
          });
        } else {
          dispatch('message', {
            hoverH: Math.min(Math.floor(d.row / 1), outputLength - 1),
            hoverW: Math.min(Math.floor(d.col / 1), outputLength - 1)
          });
        }
      });
  }

  afterUpdate(() => {
    if (data != oldData) {
      redraw();
      oldData = data;
    }    

    if (highlights != oldHighlight) {
      var grid = d3.select(grid_final).select('#grid').select("svg")
      grid.selectAll(".square")
        .style("fill", function(d) {
          if (highlights.length && highlights[d.row * data.length + d.col]) {
            return "#FF2738";
          } else {
            // Colors cells appropriately that represent padding.
            if (!isOutput && (d.row < padding || d.row > data.length - padding - 1
              || d.col < padding || d.col > data.length - padding - 1)) {
              return paddingCellColor;
            } 
          return standardCellColor;
          }
      })
      oldHighlight = highlights;
    }
  });

  onMount(() => {
    redraw();
  });

</script>

<div style="display: inline-block; vertical-align: middle;" class="grid"
  bind:this={grid_final}>
  <svg id="grid" width=100% height=100%></svg>
</div>


================================================
FILE: src/detail-view/Hyperparameterview.svelte
================================================
<script>
	import HyperparameterAnimator from './HyperparameterAnimator.svelte';
  import { singleConv } from '../utils/cnn.js';

  let inputSize = 5;
  let kernelSize = 2;
  let padding = 0;
  let stride = 1;
  const dilation = 1;
  let isPaused = false;
  let isStrideValid = true;
  $: inputSizeWithPadding = inputSize + 2 * padding;

  function generateSquareArray(arrayDim) {
    let arr = [];
    for (let i = 0; i < arrayDim; i++) {
      arr.push([]);
      for (let j = 0; j < arrayDim; j++) {
        arr[i].push(0)
      }
    }
    return arr;
  }

  function handleClickPause() {
    isPaused = !isPaused;
  }

  function handlePauseFromInteraction(event) {
    isPaused = event.detail.text;
  }

  // Update input, kernel, and output as user adjusts hyperparameters.
  let input = generateSquareArray(inputSize + padding * 2);
  let kernel = generateSquareArray(kernelSize);
  $: input = generateSquareArray(inputSize + padding * 2);
  $: kernel = generateSquareArray(kernelSize);
  let outputFinal = singleConv(input, kernel, stride);
  $: if (stride > 0) {
    const stepSize = (inputSizeWithPadding - kernelSize) / stride + 1;
    let strideNumberInput = document.getElementById("strideNumber");
    if (Number.isInteger(stepSize)) {
      outputFinal = singleConv(input, kernel, stride);
      if (strideNumberInput != null) {
        strideNumberInput.className = strideNumberInput.className.replace("is-danger", "");
      }
      isStrideValid = true;
    } else {
      if (!strideNumberInput.className.includes("is-danger")) {
        strideNumberInput.className += " is-danger";
      }
      isStrideValid = false;
      console.log("Cannot handle stride of " + stride);
    }
  }
</script>

<style>
  .control-button {
    position: absolute;
    top: 5px;
    right: 15px;
    color: gray;
    font-size: 22px;
    opacity: 0.4;
    cursor: pointer;
  }

  .control-button:hover {
    opacity: 0.8;
  }

  .box {
    padding: 5px 30px 20px 30px;
    position: relative;
  }

  .left-part {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
  }

  .right-part {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .content-container {
    display: flex;
    justify-content: space-around;
  }

  .field {
    padding-top: 5px;
  }

  .annotation {
    display: flex;
    align-items: center;
    padding-left : 10px;
  }

  .annotation-text-hyper {
    font-size: 15px;
    font-style: italic;
  }

  .annotation > img {
    width: 20px;
    margin-right: 5px;
  }

  .is-very-small {
    font-size: 12px; 
  }

  .field {
    align-items: center;
  }

  .field-label.is-normal {
    padding-top: 0;
  }

  .field:not(:last-child) {
    margin-bottom: 7px;
  }

  label {
    display: inline-block;
    width: 105px;
    text-align: right;
    font-weight: 500;
    color: #4a4a4a;
  } 

  input[type=number] {
    width: 50px;
  }

  input[type=range] {
    width: 160px;
  }
</style>

<div class="container has-text-centered" id="detailview-container">
  <div class="box">

      <div class="control-button" on:click={handleClickPause}>
        {@html isPaused ?
          '<i class="fas fa-play-circle play-icon"></i>' :
          '<i class="fas fa-pause-circle"></i>'}
      </div>

    <div class="content-container">
      <div class="left-part">

        <div class="input-row">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Input Size:</label>
            </div>
            <input class="input is-very-small" type="number" bind:value={inputSize}
              min={kernelSize} max={7}>
          </div>

          <input type="range" bind:value={inputSize}
            min={kernelSize} max={7}>
        </div>

        <div class="input-row">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Padding:</label>
            </div>
            <input class="input is-very-small" type="number" bind:value={padding} min={0}
              max={kernelSize - 1}>
          </div>

          <input type="range" bind:value={padding} min={0}
            max={kernelSize - 1}>
        </div>

        <div class="input-row">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Kernel Size:</label>
            </div>
            <input class="input is-very-small" type="number" bind:value={kernelSize} min={padding + 1}
              max={inputSizeWithPadding}>
          </div>

          <input type="range" bind:value={kernelSize} min={padding + 1}
            max={inputSizeWithPadding}>
        </div>

        <div class="input-row">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Stride:</label>
            </div>
            <input class="input is-very-small" type=number id="strideNumber" bind:value={stride} min=1
              max={Math.max(inputSizeWithPadding - kernelSize + 1, 2)}>
          </div>

          <input type="range" bind:value={stride} min=1
            max={Math.max(inputSizeWithPadding - kernelSize + 1, 2)}>
        </div>
      </div>

        <div class="right-part">
          <HyperparameterAnimator on:message={handlePauseFromInteraction} 
            kernel={kernel} image={input} output={outputFinal} isStrideValid={isStrideValid}
            stride={stride} dilation={dilation} padding={padding} isPaused={isPaused}/>

          <div class="annotation">
            <img src='PUBLIC_URL/assets/img/pointer.svg' alt='pointer icon' width="25px">
            <div class="annotation-text-hyper">
              <span style="font-weight:600">Hover over</span> the matrices to change kernel position.
            </div>
          </div>
          
        </div>

    </div>


  </div>
</div>


================================================
FILE: src/detail-view/KernelMathView.svelte
================================================
<script>
  export let data;
  export let kernel;
  export let constraint;
  export let dataRange;
  export let kernelRange;
  export let colorScale = d3.interpolateRdBu;
  export let kernelColorScale = d3.interpolateBrBG;
  export let isInputLayer = false;

  import { onMount } from 'svelte';
  import { afterUpdate } from 'svelte';

  let gridFinal;
  let legendFinal;
  const textConstraintDivisor = 2.6;
  const multiplicationSymbolPadding = Math.floor(constraint / 3);

  let oldData = data;
  let oldKernel = kernel;

  // Legend drawn similarly to legends in overview/intermediate-view.
  const addOverlayGradient = (gradientID, stops, group) => {
    if (group === undefined) {
      group = svg;
    }

    // Create a gradient
    let defs = group.append("defs")
      .attr('class', 'overlay-gradient');

    let gradient = defs.append("linearGradient")
      .attr("id", gradientID)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "100%")
      .attr("y2", "100%");
    
    stops.forEach(s => {
      gradient.append('stop')
        .attr('offset', s.offset)
        .attr('stop-color', s.color)
        .attr('stop-opacity', s.opacity);
    })
  }

  // Draw the legend for intermediate layer
  const redrawDetailedConvViewLegend = (arg) => {
    let legendHeight = arg.legendHeight,
      range = arg.range,
      minMax = arg.minMax,
      width = arg.width,
      colorScale = arg.colorScale,
      gradientGap = arg.gradientGap;

    d3.select(legendFinal).selectAll("#legend > *").remove();
    let legend = d3.select(legendFinal).select("#legend")
      .attr("width", 150 + "px")
      .attr("height", 25 + "px")
      .attr("align","center")
      .style("dominant-baseline", "middle");
    let detailedViewKernel = legend.append('g')
      .attr('transform', `translate(10, 0)`);
    
    if (colorScale === undefined) { colorScale = layerColorScales.conv; }
    if (gradientGap === undefined) { gradientGap = 0; }
    
    // Add a legend color gradient
    let gradientName = `url(#detailed-kernel-gradient)`;
    let normalizedColor = v => colorScale(v * (1 - 2 * gradientGap) + gradientGap);

    let leftValue = (minMax.min + range / 2) / range,
      zeroValue = (0 + range / 2) / range,
      rightValue = (minMax.max + range / 2) / range,
      totalRange = minMax.max - minMax.min,
      zeroLocation = (0 - minMax.min) / totalRange,
      leftMidValue = leftValue + (zeroValue - leftValue)/2,
      rightMidValue = zeroValue + (rightValue - zeroValue)/2;

    let stops = [
      {offset: 0, color: normalizedColor(leftValue), opacity: 1},
      {offset: zeroLocation / 2,
        color: normalizedColor(leftMidValue),
        opacity: 1},
      {offset: zeroLocation,
        color: normalizedColor(zeroValue),
        opacity: 1},
      {offset: zeroLocation + (1 - zeroValue) / 2,
        color: normalizedColor(rightMidValue),
        opacity: 1},
      {offset: 1, color: normalizedColor(rightValue), opacity: 1}
    ];

    addOverlayGradient(`detailed-kernel-gradient`, stops, detailedViewKernel);

    let legendScale = d3.scaleLinear()
      .range([0, width - 1.2])
      .domain([minMax.min, minMax.max]);

    let legendAxis = d3.axisBottom()
      .scale(legendScale)
      .tickFormat(d3.format('.2f'))
      .tickValues([minMax.min, 0, minMax.max]);
    
    let detailedLegend = detailedViewKernel.append('g')
      .attr('id', `detailed-legend-0`)
    
    let legendGroup = detailedLegend.append('g')
      .attr('transform', `translate(0, ${legendHeight - 3})`)
      .call(legendAxis);
    
    legendGroup.selectAll('text')
      .style('font-size', '9px')
      .style('fill', "black");
    
    legendGroup.selectAll('path, line')
      .style('stroke', "black");

    detailedLegend.append('rect')
      .attr('width', width)
      .attr('height', legendHeight)
      .style('fill', gradientName);
  }

  // Draw the elementwise dot-product math.
  const redraw = () => {
    d3.select(gridFinal).selectAll("#grid > *").remove();
    const constrainedSvgSize = kernel ? 2 * (data.length * constraint) + 2 : data.length * constraint + 2;
    var grid = d3.select(gridFinal).select("#grid")
      .attr("width", constrainedSvgSize + "px")
      .attr("height", constrainedSvgSize + "px")
      .append("svg")
      .attr("width", constrainedSvgSize + "px")
      .attr("height", constrainedSvgSize + "px")
    var row = grid.selectAll(".row")
      .data(data)
      .enter().append("g")
      .attr("class", "row");
    
    var columns = row.selectAll(".square")
      .data(function(d) { return d; })
      .enter();
    // Draw cells for slice from input matrix.
    columns.append("rect")
      .attr("class","square")
      .attr("x", function(d) { return d.x === 1 ? d.x + multiplicationSymbolPadding : d.x * 2 + multiplicationSymbolPadding})
      .attr("y", function(d) { return d.y === 1 ? d.y : d.y * 2 })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .style("opacity", 0.5)
      .style("fill", function(d) { 
        let normalizedValue = d.text;
        if (isInputLayer){
          normalizedValue = 1 - d.text;
        } else {
          normalizedValue = (d.text + dataRange / 2) / dataRange;
        }
        return colorScale(normalizedValue); 
      })
      .style("stroke", "black");
    // Draw cells for the kernel.
    columns.append("rect")
      .attr("class","square")
      .attr("x", function(d) { return d.x === 1 ? d.x + multiplicationSymbolPadding: d.x * 2 + multiplicationSymbolPadding})
      .attr("y", function(d) { return d.y === 1 ? d.y + d.height : d.y * 2 + d.height })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height / 2; })
      .style("opacity", 0.5)
      // Same colorscale as is used for the flatten layers.
      .style("fill", function(d) { 
        let normalizedValue = (kernel[d.row][d.col].text + kernelRange.range / 2) / kernelRange.range;
        const gap = 0.2;
        let normalizedValueWithGap = normalizedValue * (1 - 2 * gap) + gap;
        return kernelColorScale(normalizedValueWithGap); 
      })

    var texts = row.selectAll(".text")
      .data(function(d) { return d; })
      .enter();
    // Draw numbers from input matrix slice.
    texts.append("text")
      .attr("class","text")
      .style("font-size", Math.floor(constraint / textConstraintDivisor) + "px")
      .attr("x", function(d) { return d.x === 1 ? d.x + d.width / 2 + multiplicationSymbolPadding: d.x * 2 + d.width / 2 + multiplicationSymbolPadding})
      .attr("y", function(d) { return d.y === 1 ? d.y + d.height / 2 : d.y * 2 + d.height / 2 })
      .style("fill", function(d) { 
        let normalizedValue = d.text;
        if (isInputLayer){
          normalizedValue = 1 - d.text;
        } else {
          normalizedValue = (d.text + dataRange / 2) / dataRange;
        }
        if (normalizedValue < 0.2 || normalizedValue > 0.8) {
          if (isInputLayer && normalizedValue < 0.2) {
            return 'black';
          } 
          return 'white';
        } else {
          return 'black';
        }
      })
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(function(d) { return d.text; })
    // Attempted to use FontAwesome icons for the 'x', '+', and '=', but none of these strategies work: https://github.com/FortAwesome/Font-Awesome/issues/12268
    // Draw 'x' to signify multiplication.
    texts.append("text")
      .attr("class","text")
      .style("font-size", Math.floor(constraint / (textConstraintDivisor)) + "px")
      .attr('font-weight', 600)
      .attr("x", function(d) { return d.x === 1 ? d.x + multiplicationSymbolPadding / 2: d.x * 2 + multiplicationSymbolPadding / 2})
      .attr("y", function(d) { return d.y === 1 ? d.y + d.height + (d.height / 4) : d.y * 2 + d.height + (d.height / 4) })
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(function(d) { return '×' })
    // Draw kernel values.
    texts.append("text")
      .attr("class","text")
      .style("font-size", Math.floor(constraint / textConstraintDivisor) + "px")
      .attr("x", function(d) { return d.x === 1 ? d.x + d.width / 2 + multiplicationSymbolPadding: d.x * 2 + d.width / 2 + multiplicationSymbolPadding})
      .attr("y", function(d) { return d.y === 1 ? d.y + d.height + (d.height / 4) : d.y * 2 + d.height + (d.height / 4) })
      .style("fill", function(d) { 
        let normalizedValue = (kernel[d.row][d.col].text + kernelRange.range / 2) / kernelRange.range;
        const gap = 0.2;
        let normalizedValueWithGap = normalizedValue * (1 - 2 * gap) + gap;
        if (normalizedValueWithGap < 0.2 || normalizedValueWithGap > 0.8) {
          return 'white';
        } else {
          return 'black';
        }
      })
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(function(d) { return kernel[d.row][d.col].text; })
    // Draw '+' to signify the summing of products except for the last kernel cell where '=' is drawn.
    texts.append("text")
      .attr("class","text")
      .style("font-size", Math.floor(constraint / (textConstraintDivisor - 1)) + "px")
      .attr("x", function(d) { return d.x === 1 ? d.x + d.width + d.width / 2 + multiplicationSymbolPadding: d.x * 2 + d.width + d.width / 2 + multiplicationSymbolPadding})
      .attr("y", function(d) { return d.y === 1 ? d.y + d.height / 2 : d.y * 2 + d.height / 2 })
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(function(d) { return d.row == kernel.length - 1 && d.col == kernel.length - 1 ? '=' : '+'; })
    }

  afterUpdate(() => {
    if (data != oldData) {
      redraw();
      oldData = data;
    }
    if (kernel != oldKernel) {
      /*
      redrawDetailedConvViewLegend({
          legendHeight: 5,
          range: kernelRange.range,
          minMax: {min: kernelRange.min, max: kernelRange.max},
          width: 130,
          colorScale: kernelColorScale,
          gradientGap: 0.35,
      });
      */
      oldKernel = kernel;
    }
  });

  onMount(() => {
    redraw();
    /*
    redrawDetailedConvViewLegend({
          legendHeight: 5,
          range: kernelRange.range,
          minMax: {min: kernelRange.min, max: kernelRange.max},
          width: 130,
          colorScale: kernelColorScale,
          gradientGap: 0.35,
    });
    */
  });

</script>

<div class="legend"
  bind:this={legendFinal}>
  <!-- <svg id="legend" width=100% height=100%></svg> -->
</div>

<div class="grid"
  bind:this={gridFinal}>
  <svg id="grid" width=100% height=100%></svg>
</div>


================================================
FILE: src/detail-view/PoolAnimator.svelte
================================================
<script>
  import { createEventDispatcher } from 'svelte';
  import { array1d, getMatrixSliceFromOutputHighlights,
    compute_input_multiplies_with_weight, getVisualizationSizeConstraint,
    generateOutputMappings, getMatrixSliceFromInputHighlights, gridData
  } from './DetailviewUtils.js';
  import Dataview from './Dataview.svelte';

  export let stride;
  export let dilation
  export let kernelLength;
  export let image;
  export let output;
  export let isPaused;
  export let dataRange;

  const dispatch = createEventDispatcher();
  const padding = 0;
  let padded_input_size = image.length + padding * 2;
  $: padded_input_size = image.length + padding * 2;

  // Dummy data for original state of component.
  let testInputMatrixSlice = [];
  for (let i = 0; i < kernelLength; i++) {
    testInputMatrixSlice.push([]);
    for (let j = 0; j < kernelLength; j++) {
      testInputMatrixSlice[i].push(0)
    }
  }
  testInputMatrixSlice = gridData(testInputMatrixSlice)
  let testOutputMatrixSlice = gridData([[0]]);

  let inputHighlights = [];
  let outputHighlights = array1d(output.length * output.length, (i) => true);
  let interval;
  $ : {
    let inputHighlights = [];
    let outputHighlights = array1d(output.length * output.length, (i) => true);
    let interval;
  }
  
  let counter;

  // lots of replication between mouseover and start-pool. TODO: fix this.
  function startMaxPool(stride) {
    counter = 0;
    let outputMappings = generateOutputMappings(stride, output, kernelLength, padded_input_size, dilation);
    if (stride <= 0) return;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (isPaused) return;
      const flat_animated = counter % (output.length * output.length);
      outputHighlights = array1d(output.length * output.length, (i) => false);
      const animatedH = Math.floor(flat_animated / output.length);
      const animatedW = flat_animated % output.length;
      outputHighlights[animatedH * output.length + animatedW] = true;
      inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernelLength, outputMappings, kernelLength)
      const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernelLength);
      testInputMatrixSlice = gridData(inputMatrixSlice);
      const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
      testOutputMatrixSlice = gridData(outputMatrixSlice);
      counter++;
    }, 250)
  }

  function handleMouseover(event) {
    let outputMappings = generateOutputMappings(stride, output, kernelLength, padded_input_size, dilation);
    outputHighlights = array1d(output.length * output.length, (i) => false);
    const animatedH = event.detail.hoverH;
    const animatedW = event.detail.hoverW;
    outputHighlights[animatedH * output.length + animatedW] = true;
    inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernelLength, outputMappings, kernelLength)
    const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernelLength);
    testInputMatrixSlice = gridData(inputMatrixSlice);
    const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    testOutputMatrixSlice = gridData(outputMatrixSlice);
    isPaused = true;
    dispatch('message', {
      text: isPaused
    });
  }

  startMaxPool(stride);
  let testImage = gridData(image)
  let testOutput = gridData(output)
  $ : {
    startMaxPool(stride);
    testImage = gridData(image)
    testOutput = gridData(output)
  }
</script>

<style>
  .column {
    padding: 5px;
  }
</style>

<div class="column has-text-centered">
  <div class="header-text">
    Input ({testImage.length}, {testImage[0].length})
  </div>

  <Dataview on:message={handleMouseover} data={testImage} highlights={inputHighlights} outputLength={output.length}
      isKernelMath={false} constraint={getVisualizationSizeConstraint(image.length)} dataRange={dataRange} stride={stride}/>  
</div>
<div class="column has-text-centered">
  <span>
    max(
    <Dataview data={testInputMatrixSlice} highlights={outputHighlights} isKernelMath={true} 
      constraint={getVisualizationSizeConstraint(kernelLength)} dataRange={dataRange}/>
    )
    =
    <Dataview data={testOutputMatrixSlice} highlights={outputHighlights} isKernelMath={true} 
      constraint={getVisualizationSizeConstraint(kernelLength)} dataRange={dataRange}/>
  </span> 
</div>
<div class="column has-text-centered">
  <div class="header-text">
    Output ({testOutput.length}, {testOutput[0].length})
  </div>
  <Dataview on:message={handleMouseover} data={testOutput} highlights={outputHighlights} isKernelMath={false} 
      outputLength={output.length} constraint={getVisualizationSizeConstraint(output.length)} dataRange={dataRange} stride={stride}/>
</div>


================================================
FILE: src/detail-view/Poolview.svelte
================================================
<script>
	import PoolAnimator from './PoolAnimator.svelte';
  import { singleMaxPooling } from '../utils/cnn.js';
  import { createEventDispatcher } from 'svelte';

  export let input;
  export let kernelLength;
  export let dataRange;
  export let isExited;
  
  const dispatch = createEventDispatcher();
  // let isExited = false;
	let stride = 2;
  const dilation = 1;
  var isPaused = false;
  var outputFinal = singleMaxPooling(input);
  // let dragging = false;
  // let dragInfo = {x1: 0, x2: 0, y1: 0, y2: 0};
  // let detailView = d3.select('#detailview').node();
  $: if (stride > 0) {
    try { 
      outputFinal = singleMaxPooling(input);
    } catch {
      console.log("Cannot handle stride of " + stride);
    }
  }
  
  function handleClickPause() {
    isPaused = !isPaused;
    console.log(isPaused)
  }

  function handlePauseFromInteraction(event) {
    isPaused = event.detail.text;
  }

  function handleClickX() {
    dispatch('message', {
      text: true
    });
  }

  function handleScroll() {
    let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
    let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
    let anchor = document.querySelector(`#article-pooling`);
    scroll.animateScroll(anchor);
  }

  // Test dragging detail view, need more work
  // const detailViewDragStart = (e) => {
  //   // Record the starting pos
  //   dragInfo.x1 = 0;
  //   dragInfo.y1 = 0;
  //   dragInfo.x2 = e.clientX;
  //   dragInfo.y2 = e.clientY;
  
  //   dragging = true;
  // }

  // const detailViewDragEnd = (e) => {
  //   dragging = false;
  // }

  // const detailViewDragMove = (e) => {
  //   // Add up move to the starting pos
  //   dragInfo.x1 = dragInfo.x2 - e.clientX;
  //   dragInfo.y1 = dragInfo.y2 - e.clientY;
  //   dragInfo.x2 = e.clientX;
  //   dragInfo.y2 = e.clientY;

  //   // Move detail view
  //   detailView.style.top = (detailView.offsetTop - dragInfo.y1) + 'px';
  //   detailView.style.left = (detailView.offsetLeft - dragInfo.x1) + 'px';
  // }
</script>

<style>
  .control-pannel {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    cursor: pointer;
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .control-button {
    color: gray;
    font-size: 15px;
    opacity: 0.4;
    cursor: pointer;
  }

  .control-button:not(:first-child) {
    margin-left: 5px;
  }

  .annotation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left : 10px;
    font-size: 12px;
  }

  .annotation > img {
    width: 17px;
    margin-right: 5px;
  }


  .control-button:hover {
    opacity: 0.8;
  }

  .box {
    padding: 5px 15px 10px 15px;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-text {
    font-size: 1.2em;
    font-weight: 500;
    color: #4a4a4a;
  }
</style>

{#if !isExited}
  <div class="container">

    <!-- old stride input -->
    <!-- <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input class="input" type="text" placeholder="Stride" bind:value={stride} />
          </p>
          <p class="control">
            <button class="button is-success" on:click={handleClickPause}>
              Toggle Movement
            </button>
          </p>
        </div>
      </div>
    </div> -->
    <div class="box">

      <div class="control-pannel">
      
        <div class="title-text">
          Max Pooling
        </div>

        <div class="buttons">

          <div class="control-button" on:click={handleScroll} title="Jump to article section">
            <i class="fas fa-info-circle"></i>
          </div>

          <div class="play-button control-button" on:click={handleClickPause} title="Play animation">
            {@html isPaused ?
              '<i class="fas fa-play-circle play-icon"></i>' :
              '<i class="fas fa-pause-circle"></i>'}
          </div>

          <div class="delete-button control-button" on:click={handleClickX} title="Close">
            <i class="fas control-icon fa-times-circle"></i>
          </div>
        </div>

      </div>

      <div class="container is-centered is-vcentered">
        <PoolAnimator on:message={handlePauseFromInteraction} 
          kernelLength={kernelLength} image={input} output={outputFinal} 
          stride={stride} dilation={dilation} isPaused={isPaused}
          dataRange={dataRange} />
      </div>

      <div class="annotation">
        <img src='PUBLIC_URL/assets/img/pointer.svg' alt='pointer icon'>
          <div class="annotation-text">
            <span style="font-weight:600">Hover over</span> the matrices to change kernel position.
          </div>
      </div>

    </div>
  </div>
{/if}


================================================
FILE: src/detail-view/Softmaxview.svelte
================================================
<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  export let logits;
  export let logitColors;
  export let selectedI;
  export let highlightI = -1;
  export let outputName;
  export let outputValue;
  export let startAnimation;

  let softmaxViewComponent;
  let svg = null;
  const dispatch = createEventDispatcher();
  const formater = (n, d) => {
    if (d === undefined) {
      return d3.format('.2f')(n);
    } else {
      return d3.format(`.${d}f`)(n);
    }
  }

  $: highlightI, (() => {
    if (svg !== null) {
      svg.selectAll(`.formula-term`)
        .style('text-decoration', 'none')
        .style('font-weight', 'normal');

      svg.selectAll(`.formula-term-${highlightI}`)
      .style('font-weight', 'bold')
      .style('text-decoration', 'underline');
    }
  })();

  $: startAnimation, (() => {
    if (svg !== null) {
      svg.select(`.formula-term-${startAnimation.i}`)
        .transition('softmax-edge')
        .duration(startAnimation.duration)
        .style('fill-opacity', 1);
    }
  })();

  const mouseOverHandler = (d, i, g, curI) => {
    highlightI = curI;
    dispatch('mouseOver', {curI: curI});
  }

  const mouseLeaveHandler = (d, i, g, curI) => {
    highlightI = -1;
    dispatch('mouseLeave', {curI: curI});
  }

  const handleClickX = () => {
    dispatch('xClicked', {});
  }

  function handleScroll() {
    let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
    let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
    let anchor = document.querySelector(`#article-softmax`);
    scroll.animateScroll(anchor);
  }

  onMount(() => {
    svg = d3.select(softmaxViewComponent)
      .select('#softmax-svg');

    let formulaRightGroup = svg.append('g')
      .attr('class', 'formula-right')
      .attr('transform', `translate(${10}, ${0})`)
      .style('font-size', '15px');

    // Denominator
    let denominatorGroup = formulaRightGroup.append('g')
      .attr('class', 'denominator')
      .attr('transform', `translate(${0}, ${58})`);
      
    // Add the left (
    denominatorGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'gray')
      .text('(');

    // Need to loop through the logits array instead of data-binding because
    // we want dynamic positioning based on prior '-' occurance
    let curX = 8;
    let numOfRows = 4;

    logits.forEach((d, i) => {
      if (i / numOfRows >= 1 && i % numOfRows === 0) {
          curX = 8;
      }

      let curText = denominatorGroup.append('text')
        .attr('x', curX)
        .attr('y', Math.floor(i / numOfRows) * 20)
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .on('mouseover', (d, n, g) => mouseOverHandler(d, n, g, i))
        .on('mouseleave', (d, n, g) => mouseLeaveHandler(d, n, g, i))
        .text(`exp(`);
      
      curText.append('tspan')
        .attr('class', `formula-term-${i} formula-term`)
        .attr('dx', '1')
        .style('fill', logitColors[i])
        .style('fill-opacity', (i === selectedI) || startAnimation.hasInitialized ? 1 : 0)
        .text(formater(d));
      
      curText.append('tspan')
        .attr('dx', '1')
        .text(')');
      
      let curBBox = curText.node().getBBox();
      curX += curBBox.width + 4;

      if (i !== logits.length - 1) {
        denominatorGroup.append('text')
          .attr('x', curX)
          .attr('y', Math.floor(i / numOfRows) * 20)
          .text('+');
        curX += 14;
      } else {
        denominatorGroup.append('text')
          .attr('x', curX-2)
          .attr('y', Math.floor(i / numOfRows) * 20)
          .style('fill', 'gray')
          .text(')');
      }
    })

    denominatorGroup.selectAll('text')
      .data(logits)
      .enter()
      .append('text')
      .attr('x', (d, i) => 40 * i)
      .attr('y', 0)
      .text(d => formater(d));
    
    // Calculate the dynamic denominator group width
    let denominatorGroupBBox = denominatorGroup.node().getBBox();

    // Draw the fraction line
    formulaRightGroup.append('line')
      .attr('class', 'separation-line')
      .attr('x1', -5)
      .attr('x2', denominatorGroupBBox.width + 5)
      .attr('y1', 32)
      .attr('y2', 32)
      .style('stroke-width', 1.2)
      .style('stroke', 'gray');
    
    // Draw the numerator
    let numeratorGroup = formulaRightGroup.append('g')
      .attr('class', 'numerator-group')
      .attr('transform', `translate(${0}, ${20})`);
    
    let numeratorText = numeratorGroup.append('text')
      .attr('x', denominatorGroupBBox.x + denominatorGroupBBox.width / 2)
      .attr('y', 0)
      .on('mouseover', (d, n, g) => mouseOverHandler(d, n, g, selectedI))
      .on('mouseleave', (d, n, g) => mouseLeaveHandler(d, n, g, selectedI))
      .style('pointer-events', 'all')
      .style('cursor', 'crosshair')
      .style('text-anchor', 'middle')
      .text('exp(');

    numeratorText.append('tspan')
      .attr('class', `formula-term-${selectedI} formula-term`)
      .attr('dx', 1)
      .style('fill', logitColors[selectedI])
      .text(`${formater(logits[selectedI])}`);

    numeratorText.append('tspan')
       .attr('dx', 1)
      .text(')');
    
    // Draw the left part of the formula
    let formulaLeftGroup = svg.append('g')
      .attr('class', 'formula-left')
      .attr('transform', `translate(${395}, ${32})`);
    
    let softmaxText = formulaLeftGroup.append('text')
      .attr('x', 20)
      .attr('dominant-baseline', 'middle')
      .text(`${formater(outputValue, 4)}`);
    
    let softmaxTextBBox = softmaxText.node().getBBox();
    
    formulaLeftGroup.append('text')
      .attr('dominant-baseline', 'middle')
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'gray')
      .style('font-weight', 'bold')
      .text('=');

  })

</script>

<style>
  .buttons {
    cursor: pointer;
    position: absolute;
    top: 6px;
    right: 10px;
  }

  .control-button {
    color: gray;
    font-size: 15px;
    opacity: 0.4;
  }

  .control-button:hover {
    opacity: 0.8;
  }

  .control-button:not(:first-child) {
    margin-left: 5px;
  }

  .title-text {
    font-size: 1.2em;
    font-weight: 500;
    color: #4a4a4a;
  }

  .annotation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left : 10px;
    font-size: 12px;
  }

  .annotation > img {
    width: 17px;
    margin-right: 5px;
  }

  .box {
    padding: 5px 10px 15px 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  svg {
    margin: 10px 0 12px 0;
  }
</style>

<div class="container" bind:this={softmaxViewComponent}>
  <div class="box">

    <div class="buttons">
      <div class="control-button" on:click={handleScroll} title="Jump to article section">
        <i class="fas fa-info-circle"></i>
      </div>

      <div class="delete-button control-button" on:click={handleClickX} title="Close">
        <i class="fas control-icon fa-times-circle"></i>
      </div>
    </div>

    <div class="title-text">
      Softmax Score for <i>"{outputName}"</i>
    </div>

    <svg id="softmax-svg" width="470" height="105"/>

    <div class="annotation">
      <img src='PUBLIC_URL/assets/img/pointer.svg' alt='pointer icon'>
      <div class="annotation-text">
        <span style="font-weight:600">Hover over</span> the numbers to highlight logit circles.
      </div>
    </div>

  </div>
</div>




================================================
FILE: src/overview/draw-utils.js
================================================
import { overviewConfig } from '../config.js';

// Configs
const nodeLength = overviewConfig.nodeLength;

/**
 * Compute the [minimum, maximum] of a 1D or 2D array.
 * @param {[number]} array 
 */
export  const getExtent = (array) => {
  let min = Infinity;
  let max = -Infinity;

  // Scalar
  if (array.length === undefined) {
    return [array, array];
  }

  // 1D array
  if (array[0].length === undefined) {
    for (let i = 0; i < array[0].length; i++) {
      if (array[i] < min) {
        min = array[i];
      } else if (array[i] > max) {
        max = array[i];
      }
    }
    return [min, max];
  }

  // 2D array
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[0].length; j++) {
      if (array[i][j] < min) {
        min = array[i][j];
      } else if (array[i][j] > max) {
        max = array[i][j];
      }
    }
  }
  return [min, max];
}

/**
 * Convert the svg element center coord to document absolute value
 * // Inspired by https://github.com/caged/d3-tip/blob/master/index.js#L286
 * @param {elem} elem 
 */
export const getMidCoords = (svg, elem) => {
  if (svg !== undefined) {
    let targetel = elem;
    while (targetel.getScreenCTM == null && targetel.parentNode != null) {
      targetel = targetel.parentNode;
    }
    // Get the absolute coordinate of the E point of element bbox
    let point = svg.node().ownerSVGElement.createSVGPoint();
    let matrix = targetel.getScreenCTM();
    let tbbox = targetel.getBBox();
    // let width = tbbox.width;
    let height = tbbox.height;

    point.x += 0;
    point.y -= height / 2;
    let bbox = point.matrixTransform(matrix);
    return {
      top: bbox.y,
      left: bbox.x
    };
  }
}

/**
 * Return the output knot (right boundary center)
 * @param {object} point {x: x, y:y}
 */
export const getOutputKnot = (point) => {
  return {
    x: point.x + nodeLength,
    y: point.y + nodeLength / 2
  };
}

/**
 * Return the output knot (left boundary center)
 * @param {object} point {x: x, y:y}
 */
export const getInputKnot = (point) => {
  return {
    x: point.x,
    y: point.y + nodeLength / 2
  }
}

/**
 * Compute edge data
 * @param {[[[number, number]]]} nodeCoordinate Constructed neuron svg locations
 * @param {[object]} cnn Constructed CNN model
 */
export const getLinkData = (nodeCoordinate, cnn) => {
  let linkData = [];
  // Create links backward (starting for the first conv layer)
  for (let l = 1; l < cnn.length; l++) {
    for (let n = 0; n < cnn[l].length; n++) {
      let isOutput = cnn[l][n].layerName === 'output';
      let curTarget = getInputKnot(nodeCoordinate[l][n]);
      for (let p = 0; p < cnn[l][n].inputLinks.length; p++) {
        // Specially handle output layer (since we are ignoring the flatten)
        let inputNodeIndex = cnn[l][n].inputLinks[p].source.index;
        
        if (isOutput) {
          let flattenDimension = cnn[l-1][0].output.length *
            cnn[l-1][0].output.length;
          if (inputNodeIndex % flattenDimension !== 0){
              continue;
          }
          inputNodeIndex = Math.floor(inputNodeIndex / flattenDimension);
        }
        let curSource = getOutputKnot(nodeCoordinate[l-1][inputNodeIndex]);
        let curWeight = cnn[l][n].inputLinks[p].weight;
        linkData.push({
          source: curSource,
          target: curTarget,
          weight: curWeight,
          targetLayerIndex: l,
          targetNodeIndex: n,
          sourceNodeIndex: inputNodeIndex
        });
      }
    }
  }
  return linkData;
}


/**
 * Color scale wrapper (support artificially lighter color!)
 * @param {function} colorScale D3 color scale function
 * @param {number} range Color range (max - min)
 * @param {number} value Color value
 * @param {number} gap Tail of the color scale to skip
 */
export const gappedColorScale = (colorScale, range, value, gap) => {
  if (gap === undefined) { gap = 0; }
  let normalizedValue = (value + range / 2) / range;
  return colorScale(normalizedValue * (1 - 2 * gap) + gap);
}


================================================
FILE: src/overview/intermediate-utils.js
================================================
/* global d3 */

import { svgStore, vSpaceAroundGapStore } from '../stores.js';
import { overviewConfig } from '../config.js';

// Configs
const layerColorScales = overviewConfig.layerColorScales;
const nodeLength = overviewConfig.nodeLength;
const intermediateColor = overviewConfig.intermediateColor;
const svgPaddings = overviewConfig.svgPaddings;

// Shared variables
let svg = undefined;
svgStore.subscribe( value => {svg = value;} )

let vSpaceAroundGap = undefined;
vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap = value;} )

/**
 * Move one layer horizontally
 * @param {object} arg Multiple arguments {
 *   layerIndex: current layer index
 *   targetX: destination x
 *   disable: make this layer unresponsible
 *   delay: animation delay
 *   opacity: change the current layer's opacity
 *   specialIndex: avoid manipulating `specialIndex`th node
 *   onEndFunc: call this function when animation finishes
 *   transitionName: animation ID
 * }
 */
export const moveLayerX = (arg) => {
  let layerIndex = arg.layerIndex;
  let targetX = arg.targetX;
  let disable = arg.disable;
  let delay = arg.delay;
  let opacity = arg.opacity;
  let specialIndex = arg.specialIndex;
  let onEndFunc = arg.onEndFunc;
  let transitionName = arg.transitionName === undefined ? 'move' : arg.transitionName;
  let duration = arg.duration === undefined ? 500 : arg.duration;

  // Move the selected layer
  let curLayer = svg.select(`g#cnn-layer-group-${layerIndex}`);
  curLayer.selectAll('g.node-group').each((d, i, g) => {
    d3.select(g[i])
      .style('cursor', disable && i !== specialIndex ? 'default' : 'pointer')
      .style('pointer-events', disable && i !== specialIndex ? 'none' : 'all')
      .select('image')
      .transition(transitionName)
      .ease(d3.easeCubicInOut)
      .delay(delay)
      .duration(duration)
      .attr('x', targetX);
    
    d3.select(g[i])
      .select('rect.bounding')
      .transition(transitionName)
      .ease(d3.easeCubicInOut)
      .delay(delay)
      .duration(duration)
      .attr('x', targetX);
    
    if (opacity !== undefined && i !== specialIndex) {
      d3.select(g[i])
        .select('image')
        .style('opacity', opacity);
    }
  });
  
  // Also move the layer labels
  svg.selectAll(`g#layer-label-${layerIndex}`)
    .transition(transitionName)
    .ease(d3.easeCubicInOut)
    .delay(delay)
    .duration(duration)
    .attr('transform', () => {
      let x = targetX + nodeLength / 2;
      let y = (svgPaddings.top + vSpaceAroundGap) / 2 + 5;
      return `translate(${x}, ${y})`;
    })
    .on('end', onEndFunc);

  svg.selectAll(`g#layer-detailed-label-${layerIndex}`)
    .transition(transitionName)
    .ease(d3.easeCubicInOut)
    .delay(delay)
    .duration(duration)
    .attr('transform', () => {
      let x = targetX + nodeLength / 2;
      let y = (svgPaddings.top + vSpaceAroundGap) / 2 - 6;
      return `translate(${x}, ${y})`;
    })
    .on('end', onEndFunc);
}

/**
 * Append a gradient definition to `group`
 * @param {string} gradientID CSS ID for the gradient def
 * @param {[{offset: number, color: string, opacity: number}]} stops Gradient stops
 * @param {element} group Element to append def to
 */
export const addOverlayGradient = (gradientID, stops, group) => {
  if (group === undefined) {
    group = svg;
  }

  // Create a gradient
  let defs = group.append("defs")
    .attr('class', 'overlay-gradient');

  let gradient = defs.append("linearGradient")
    .attr("id", gradientID)
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "100%")
    .attr("y2", "100%");
  
  stops.forEach(s => {
    gradient.append('stop')
      .attr('offset', s.offset)
      .attr('stop-color', s.color)
      .attr('stop-opacity', s.opacity);
  })
}

/**
 * Draw the legend for intermediate layer
 * @param {object} arg 
 * {
 *   legendHeight: height of the legend rectangle
 *   curLayerIndex: the index of selected layer
 *   range: colormap range
 *   group: group to append the legend
 *   minMax: {min: min value, max: max value}
 *   width: width of the legend
 *   x: x position of the legend
 *   y: y position of the legend
 *   isInput: if the legend is for the input layer (special handle black to
 *      white color scale)
 *   colorScale: d3 color scale
 *   gradientAppendingName: name of the appending gradient
 *   gradientGap: gap to make the color lighter
 * }
 */
export const drawIntermediateLayerLegend = (arg) => {
  let legendHeight = arg.legendHeight,
    curLayerIndex = arg.curLayerIndex,
    range = arg.range,
    group = arg.group,
    minMax = arg.minMax,
    width = arg.width,
    x = arg.x,
    y = arg.y,
    isInput = arg.isInput,
    colorScale = arg.colorScale,
    gradientAppendingName = arg.gradientAppendingName,
    gradientGap = arg.gradientGap;
  
  if (colorScale === undefined) { colorScale = layerColorScales.conv; }
  if (gradientGap === undefined) { gradientGap = 0; }
  
  // Add a legend color gradient
  let gradientName = 'url(#inputGradient)';
  let normalizedColor = v => colorScale(v * (1 - 2 * gradientGap) + gradientGap);

  if (!isInput) {
    let leftValue = (minMax.min + range / 2) / range,
      zeroValue = (0 + range / 2) / range,
      rightValue = (minMax.max + range / 2) / range,
      totalRange = minMax.max - minMax.min,
      zeroLocation = (0 - minMax.min) / totalRange,
      leftMidValue = leftValue + (zeroValue - leftValue)/2,
      rightMidValue = zeroValue + (rightValue - zeroValue)/2;

    let stops = [
      {offset: 0, color: normalizedColor(leftValue), opacity: 1},
      {offset: zeroLocation / 2,
        color: normalizedColor(leftMidValue),
        opacity: 1},
      {offset: zeroLocation,
        color: normalizedColor(zeroValue),
        opacity: 1},
      {offset: zeroLocation + (1 - zeroValue) / 2,
        color: normalizedColor(rightMidValue),
        opacity: 1},
      {offset: 1, color: normalizedColor(rightValue), opacity: 1}
    ];

    if (gradientAppendingName === undefined) {
      addOverlayGradient('intermediate-legend-gradient', stops, group);
      gradientName = 'url(#intermediate-legend-gradient)';
    } else {
      addOverlayGradient(`${gradientAppendingName}`, stops, group);
      gradientName = `url(#${gradientAppendingName})`;
    }
  }

  let legendScale = d3.scaleLinear()
    .range([0, width - 1.2])
    .domain(isInput ? [0, range] : [minMax.min, minMax.max]);

  let legendAxis = d3.axisBottom()
    .scale(legendScale)
    .tickFormat(d3.format(isInput ? 'd' : '.2f'))
    .tickValues(isInput ? [0, range] : [minMax.min, 0, minMax.max]);
  
  let intermediateLegend = group.append('g')
    .attr('class', `intermediate-legend-${curLayerIndex - 1}`)
    .attr('transform', `translate(${x}, ${y})`);
  
  let legendGroup = intermediateLegend.append('g')
    .attr('transform', `translate(0, ${legendHeight - 3})`)
    .call(legendAxis);
  
  legendGroup.selectAll('text')
    .style('font-size', '9px')
    .style('fill', intermediateColor);
  
  legendGroup.selectAll('path, line')
    .style('stroke', intermediateColor);

  intermediateLegend.append('rect')
    .attr('width', width)
    .attr('height', legendHeight)
    .attr('transform', `rotate(${isInput ? 180 : 0},
      ${width / 2}, ${legendHeight / 2})`)
    .style('fill', gradientName);
}

/**
 * Draw an very neat arrow!
 * @param {object} arg 
 * {
 *   group: element to append this arrow to
 *   sx: source x
 *   sy: source y
 *   tx: target x
 *   ty: target y
 *   dr: radius of curve (I'm using a circle)
 *   hFlip: the direction to choose the circle (there are always two ways)
 * }
 */
export const drawArrow = (arg) => {
  let group = arg.group,
    sx = arg.sx,
    sy = arg.sy,
    tx = arg.tx,
    ty = arg.ty,
    dr = arg.dr,
    hFlip = arg.hFlip,
    marker = arg.marker === undefined ? 'marker' : arg.marker;

  /* Cool graphics trick -> merge translate and scale together
  translateX = (1 - scaleX) * tx,
  translateY = (1 - scaleY) * ty;
  */
  
  let arrow = group.append('g')
    .attr('class', 'arrow-group');

  arrow.append('path')
    .attr("d", `M${sx},${sy}A${dr},${dr} 0 0,${hFlip ? 0 : 1} ${tx},${ty}`)
    .attr('marker-end', `url(#${marker})`)
    .style('stroke', 'gray')
    .style('fill', 'none');
}



================================================
FILE: src/overview/Modal.svelte
================================================
<script>
  /* global d3 */

  import { onMount, createEventDispatcher } from 'svelte';
  import { modalStore } from '../stores.js';

  let modalComponent;
  let valiImg;
  let inputValue = '';
  let showLoading = false;
  let files;
  let usingURL = true;
  let errorInfo = {
    show: false,
    error: ''
  };
  const dispatch = createEventDispatcher();

  let modalInfo = {
    show: false
  };
  modalStore.set(modalInfo);
  modalStore.subscribe(value => {modalInfo = value});

  const errorCallback = () => {
    // The URL is invalid, show an error message on the UI
    showLoading = false;
    errorInfo.show = true;
    errorInfo.error = usingURL ? "We can't find the image at that URL." :
      "Not a valid image file.";
  }

  const loadCallback = () => {
    // The URL is valid, but we are not sure if loading it to canvas would be
    // blocked by crossOrigin setting. Try it here before dispatch to parent.

    // https://stackoverflow.com/questions/13674835/canvas-tainted-by-cross-origin-data
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    canvas.width = valiImg.width;
    canvas.height = valiImg.height;
    context.drawImage(valiImg, 0, 0);

    try {
      context.getImageData(0, 0, valiImg.width, valiImg.height);
      // If the foreign image does support CORS -> use this image
      // dispatch to parent component to use the input image
      showLoading = false;
      modalInfo.show = false;
      modalStore.set(modalInfo);
      dispatch('urlTyped', {url: valiImg.src});
      inputValue = null;
    } catch(err) {
      // If the foreign image does not support CORS -> use this image
      showLoading = false;
      errorInfo.show = true;
      errorInfo.error = "No permission to load this image."
    }
  }

  const imageUpload = () => {
    usingURL = false;
    let reader = new FileReader();
    reader.onload = (event) => {
      valiImg.src = event.target.result;
    }
    reader.readAsDataURL(files[0]);
  }

  const crossClicked = () => {
    modalInfo.show = false;
    modalStore.set(modalInfo);
    // Dispatch the parent component
    dispatch('xClicked', {preImage: modalInfo.preImage});
  }

  const addClicked = () => {
    // Validate the input URL
    showLoading = true;
    errorInfo.show = false;
    valiImg.crossOrigin = "Anonymous";
    valiImg.src = inputValue;
  }

  onMount(() => {
    let modal = d3.select(modalComponent)
      .select('#input-modal');
  })

</script>

<style>
  .modal-card {
    max-width: 500px;
  }

  .modal-card-title {
    font-size: 20px;
  }

  .modal-card-head {
    padding: 15px 20px;
  }

  .modal-card-foot {
    padding: 12px 20px;
    justify-content: space-between;
  }

  .is-smaller {
    font-size: 15px;
    padding: 0.5em 0.8em;
    max-height: 2.2em;
  }

  .small-font {
    font-size: 15px;
  }

  .error-message {
    font-size: 15px;
    padding: 0.5em 0;
    color: #F22B61;
  }

  .control {
    width: 100%;
  }

  .or-label {
    font-size: 15px;
    margin: 0 10px;
    padding: 0.5em 0;
  }

  .field {
    display: flex;
    justify-content: space-between;
  }

</style>


<div class="modal-component"
  bind:this={modalComponent}>

  <div class="modal"
    id="input-modal"
    class:is-active={modalInfo.show}>

    <div class="modal-background" on:click={crossClicked}></div>

    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Input Image</p>
        <button class="delete" aria-label="close" on:click={crossClicked}></button>
      </header>

      <section class="modal-card-body">
        <div class="field">
          <div class="control has-icons-left"
            class:is-loading={showLoading}>

            <input class="input small-font" type="url"
              bind:value={inputValue}
              placeholder="Paste URL of image...">

            <span class="icon small-font is-left">
              <i class="fas fa-link"></i>
            </span>

          </div>

          <div class="or-label">or</div>

          <div class="file">
            <label class="file-label">
              <input class="file-input" type="file" name="image"
                accept=".png,.jpeg,.tiff,.jpg,.png"
                bind:files={files}
                on:change={imageUpload}>
              <span class="file-cta small-font">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                  Upload
                </span>
              </span>
            </label>
          </div>

        </div>

      </section>

      <footer class="modal-card-foot">

        <div class="error-message"
          class:hidden={!errorInfo.show}>
          {errorInfo.error}
        </div>

        <div class="button-container">
          <button class="button is-smaller"
            on:click={crossClicked}>
            Cancel
          </button>

          <button class="button is-success is-smaller"
            on:click={addClicked}>
            Add
          </button>
        </div>


      </footer>
    </div>

  </div>

  <!-- An invisible image to check if the user input URL is valid -->
  <img style="display: none"
    id="vali-image"
    alt="hidden image"
    bind:this={valiImg}
    on:error={errorCallback}
    on:load={loadCallback} />

</div>



================================================
FILE: src/overview/overview-draw.js
================================================
/* global d3, SmoothScroll */

import {
  svgStore, vSpaceAroundGapStore, hSpaceAroundGapStore, cnnStore,
  nodeCoordinateStore, selectedScaleLevelStore, cnnLayerRangesStore,
  detailedModeStore, cnnLayerMinMaxStore, hoverInfoStore
} from '../stores.js';
import {
  getExtent, getLinkData
} from './draw-utils.js';
import { overviewConfig } from '../config.js';

// Configs
const layerColorScales = overviewConfig.layerColorScales;
const nodeLength = overviewConfig.nodeLength;
const numLayers = overviewConfig.numLayers;
const edgeOpacity = overviewConfig.edgeOpacity;
const edgeInitColor = overviewConfig.edgeInitColor;
const edgeStrokeWidth = overviewConfig.edgeStrokeWidth;
const svgPaddings = overviewConfig.svgPaddings;
const gapRatio = overviewConfig.gapRatio;
const classLists = overviewConfig.classLists;
const formater = d3.format('.4f');

// Shared variables
let svg = undefined;
svgStore.subscribe( value => {svg = value;} )

let vSpaceAroundGap = undefined;
vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap = value;} )

let hSpaceAroundGap = undefined;
hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap = value;} )

let cnn = undefined;
cnnStore.subscribe( value => {cnn = value;} )

let nodeCoordinate = undefined;
nodeCoordinateStore.subscribe( value => {nodeCoordinate = value;} )

let selectedScaleLevel = undefined;
selectedScaleLevelStore.subscribe( value => {selectedScaleLevel = value;} )

let cnnLayerRanges = undefined;
cnnLayerRangesStore.subscribe( value => {cnnLayerRanges = value;} )

let cnnLayerMinMax = undefined;
cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax = value;} )

let detailedMode = undefined;
detailedModeStore.subscribe( value => {detailedMode = value;} )

/**
 * Use bounded d3 data to draw one canvas
 * @param {object} d d3 data
 * @param {index} i d3 data index
 * @param {[object]} g d3 group
 * @param {number} range color range map (max - min)
 */
export const drawOutput = (d, i, g, range) => {
  let image = g[i];
  let colorScale = layerColorScales[d.type];

  if (d.type === 'input') {
    colorScale = colorScale[d.index];
  }

  // Set up a second convas in order to resize image
  let imageLength = d.output.length === undefined ? 1 : d.output.length;
  let bufferCanvas = document.createElement("canvas");
  let bufferContext = bufferCanvas.getContext("2d");
  bufferCanvas.width = imageLength;
  bufferCanvas.height = imageLength;

  // Fill image pixel array
  let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
  let imageSingleArray = imageSingle.data;

  if (imageLength === 1) {
    imageSingleArray[0] = d.output;
  } else {
    for (let i = 0; i < imageSingleArray.length; i+=4) {
      let pixeIndex = Math.floor(i / 4);
      let row = Math.floor(pixeIndex / imageLength);
      let column = pixeIndex % imageLength;
      let color = undefined;
      if (d.type === 'input' || d.type === 'fc' ) {
        color = d3.rgb(colorScale(1 - d.output[row][column]))
      } else {
        color = d3.rgb(colorScale((d.output[row][column] + range / 2) / range));
      }

      imageSingleArray[i] = color.r;
      imageSingleArray[i + 1] = color.g;
      imageSingleArray[i + 2] = color.b;
      imageSingleArray[i + 3] = 255;
    }
  }

  // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
  // higher DPI by rescaling the image using canvas magic
  let largeCanvas = document.createElement('canvas');
  largeCanvas.width = nodeLength * 3;
  largeCanvas.height = nodeLength * 3;
  let largeCanvasContext = largeCanvas.getContext('2d');

  // Use drawImage to resize the original pixel array, and put the new image
  // (canvas) into corresponding canvas
  bufferContext.putImageData(imageSingle, 0, 0);
  largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
    0, 0, nodeLength * 3, nodeLength * 3);
  
  let imageDataURL = largeCanvas.toDataURL();
  d3.select(image).attr('xlink:href', imageDataURL);

  // Destory the buffer canvas
  bufferCanvas.remove();
  largeCanvas.remove();
}

/**
 * Draw bar chart to encode the output value
 * @param {object} d d3 data
 * @param {index} i d3 data index
 * @param {[object]} g d3 group
 * @param {function} scale map value to length
 */
const drawOutputScore = (d, i, g, scale) => {
  let group = d3.select(g[i]);
  group.select('rect.output-rect')
    .transition('output')
    .delay(500)
    .duration(800)
    .ease(d3.easeCubicIn)
    .attr('width', scale(d.output))
}

export const drawCustomImage = (image, inputLayer) => {

  let imageWidth = image.width;
  // Set up a second convas in order to resize image
  let imageLength = inputLayer[0].output.length;
  let bufferCanvas = document.createElement("canvas");
  let bufferContext = bufferCanvas.getContext("2d");
  bufferCanvas.width = imageLength;
  bufferCanvas.height = imageLength;

  // Fill image pixel array
  let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
  let imageSingleArray = imageSingle.data;

  for (let i = 0; i < imageSingleArray.length; i+=4) {
    let pixeIndex = Math.floor(i / 4);
    let row = Math.floor(pixeIndex / imageLength);
    let column = pixeIndex % imageLength;

    let red = inputLayer[0].output[row][column];
    let green = inputLayer[1].output[row][column];
    let blue = inputLayer[2].output[row][column];

    imageSingleArray[i] = red * 255;
    imageSingleArray[i + 1] = green * 255;
    imageSingleArray[i + 2] = blue * 255;
    imageSingleArray[i + 3] = 255;
  }

  // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
  // higher DPI by rescaling the image using canvas magic
  let largeCanvas = document.createElement('canvas');
  largeCanvas.width = imageWidth * 3;
  largeCanvas.height = imageWidth * 3;
  let largeCanvasContext = largeCanvas.getContext('2d');

  // Use drawImage to resize the original pixel array, and put the new image
  // (canvas) into corresponding canvas
  bufferContext.putImageData(imageSingle, 0, 0);
  largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
    0, 0, imageWidth * 3, imageWidth * 3);
  
  let imageDataURL = largeCanvas.toDataURL();
  // d3.select(image).attr('xlink:href', imageDataURL);
  image.src = imageDataURL;

  // Destory the buffer canvas
  bufferCanvas.remove();
  largeCanvas.remove();
}

/**
 * Create color gradient for the legend
 * @param {[object]} g d3 group
 * @param {function} colorScale Colormap
 * @param {string} gradientName Label for gradient def
 * @param {number} min Min of legend value
 * @param {number} max Max of legend value
 */
const getLegendGradient = (g, colorScale, gradientName, min, max) => {
  if (min === undefined) { min = 0; }
  if (max === undefined) { max = 1; }
  let gradient = g.append('defs')
    .append('svg:linearGradient')
    .attr('id', `${gradientName}`)
    .attr('x1', '0%')
    .attr('y1', '100%')
    .attr('x2', '100%')
    .attr('y2', '100%')
    .attr('spreadMethod', 'pad');
  let interpolation = 10
  for (let i = 0; i < interpolation; i++) {
    let curProgress = i / (interpolation - 1);
    let curColor = colorScale(curProgress * (max - min) + min);
    gradient.append('stop')
      .attr('offset', `${curProgress * 100}%`)
      .attr('stop-color', curColor)
      .attr('stop-opacity', 1);
  }
}

/**
 * Draw all legends
 * @param {object} legends Parent group
 * @param {number} legendHeight Height of the legend element
 */
const drawLegends = (legends, legendHeight) => {
  // Add local legends
  for (let i = 0; i < 2; i++){
    let start = 1 + i * 5;
    let range1 = cnnLayerRanges.local[start];
    let range2 = cnnLayerRanges.local[start + 2];

    let localLegendScale1 = d3.scaleLinear()
      .range([0, 2 * nodeLength + hSpaceAroundGap - 1.2])
      .domain([-range1 / 2, range1 / 2]);
    
    let localLegendScale2 = d3.scaleLinear()
      .range([0, 3 * nodeLength + 2 * hSpaceAroundGap - 1.2])
      .domain([-range2 / 2, range2 / 2]);

    let localLegendAxis1 = d3.axisBottom()
      .scale(localLegendScale1)
      .tickFormat(d3.format('.2f'))
      .tickValues([-range1 / 2, 0, range1 / 2]);
    
    let localLegendAxis2 = d3.axisBottom()
      .scale(localLegendScale2)
      .tickFormat(d3.format('.2f'))
      .tickValues([-range2 / 2, 0, range2 / 2]);

    let localLegend1 = legends.append('g')
      .attr('class', 'legend local-legend')
      .attr('id', `local-legend-${i}-1`)
      .classed('hidden', !detailedMode || selectedScaleLevel !== 'local')
      .attr('transform', `translate(${nodeCoordinate[start][0].x}, ${0})`);

    localLegend1.append('g')
      .attr('transform', `translate(0, ${legendHeight - 3})`)
      .call(localLegendAxis1)

    localLegend1.append('rect')
      .attr('width', 2 * nodeLength + hSpaceAroundGap)
      .attr('height', legendHeight)
      .style('fill', 'url(#convGradient)');

    let localLegend2 = legends.append('g')
      .attr('class', 'legend local-legend')
      .attr('id', `local-legend-${i}-2`)
      .classed('hidden', !detailedMode || selectedScaleLevel !== 'local')
      .attr('transform', `translate(${nodeCoordinate[start + 2][0].x}, ${0})`);

    localLegend2.append('g')
      .attr('transform', `translate(0, ${legendHeight - 3})`)
      .call(localLegendAxis2)

    localLegend2.append('rect')
      .attr('width', 3 * nodeLength + 2 * hSpaceAroundGap)
      .attr('height', legendHeight)
      .style('fill', 'url(#convGradient)');
  }

  // Add module legends
  for (let i = 0; i < 2; i++){
    let start = 1 + i * 5;
    let range = cnnLayerRanges.module[start];

    let moduleLegendScale = d3.scaleLinear()
      .range([0, 5 * nodeLength + 3 * hSpaceAroundGap +
        1 * hSpaceAroundGap * gapRatio - 1.2])
      .domain([-range / 2, range / 2]);

    let moduleLegendAxis = d3.axisBottom()
      .scale(moduleLegendScale)
      .tickFormat(d3.format('.2f'))
      .tickValues([-range / 2, -(range / 4), 0, range / 4, range / 2]);

    let moduleLegend = legends.append('g')
      .attr('class', 'legend module-legend')
      .attr('id', `module-legend-${i}`)
      .classed('hidden', !detailedMode || selectedScaleLevel !== 'module')
      .attr('transform', `translate(${nodeCoordinate[start][0].x}, ${0})`);
    
    moduleLegend.append('g')
      .attr('transform', `translate(0, ${legendHeight - 3})`)
      .call(moduleLegendAxis)

    moduleLegend.append('rect')
      .attr('width', 5 * nodeLength + 3 * hSpaceAroundGap +
        1 * hSpaceAroundGap * gapRatio)
      .attr('height', legendHeight)
      .style('fill', 'url(#convGradient)');
  }

  // Add global legends
  let start = 1;
  let range = cnnLayerRanges.global[start];

  let globalLegendScale = d3.scaleLinear()
    .range([0, 10 * nodeLength + 6 * hSpaceAroundGap +
      3 * hSpaceAroundGap * gapRatio - 1.2])
    .domain([-range / 2, range / 2]);

  let globalLegendAxis = d3.axisBottom()
    .scale(globalLegendScale)
    .tickFormat(d3.format('.2f'))
    .tickValues([-range / 2, -(range / 4), 0, range / 4, range / 2]);

  let globalLegend = legends.append('g')
    .attr('class', 'legend global-legend')
    .attr('id', 'global-legend')
    .classed('hidden', !detailedMode || selectedScaleLevel !== 'global')
    .attr('transform', `translate(${nodeCoordinate[start][0].x}, ${0})`);

  globalLegend.append('g')
    .attr('transform', `translate(0, ${legendHeight - 3})`)
    .call(globalLegendAxis)

  globalLegend.append('rect')
    .attr('width', 10 * nodeLength + 6 * hSpaceAroundGap +
      3 * hSpaceAroundGap * gapRatio)
    .attr('height', legendHeight)
    .style('fill', 'url(#convGradient)');


  // Add output legend
  let outputRectScale = d3.scaleLinear()
        .domain(cnnLayerRanges.output)
        .range([0, nodeLength - 1.2]);

  let outputLegendAxis = d3.axisBottom()
    .scale(outputRectScale)
    .tickFormat(d3.format('.1f'))
    .tickValues([0, cnnLayerRanges.output[1]])
  
  let outputLegend = legends.append('g')
    .attr('class', 'legend output-legend')
    .attr('id', 'output-legend')
    .classed('hidden', !detailedMode)
    .attr('transform', `translate(${nodeCoordinate[11][0].x}, ${0})`);
  
  outputLegend.append('g')
    .attr('transform', `translate(0, ${legendHeight - 3})`)
    .call(outputLegendAxis);

  outputLegend.append('rect')
    .attr('width', nodeLength)
    .attr('height', legendHeight)
    .style('fill', 'gray');
  
  // Add input image legend
  let inputScale = d3.scaleLinear()
    .range([0, nodeLength - 1.2])
    .domain([0, 1]);

  let inputLegendAxis = d3.axisBottom()
    .scale(inputScale)
    .tickFormat(d3.format('.1f'))
    .tickValues([0, 0.5, 1]);

  let inputLegend = legends.append('g')
    .attr('class', 'legend input-legend')
    .classed('hidden', !detailedMode)
    .attr('transform', `translate(${nodeCoordinate[0][0].x}, ${0})`);
  
  inputLegend.append('g')
    .attr('transform', `translate(0, ${legendHeight - 3})`)
    .call(inputLegendAxis);

  inputLegend.append('rect')
    .attr('x', 0.3)
    .attr('width', nodeLength - 0.3)
    .attr('height', legendHeight)
    .attr('transform', `rotate(180, ${nodeLength/2}, ${legendHeight/2})`)
    .style('stroke', 'rgb(20, 20, 20)')
    .style('stroke-width', 0.3)
    .style('fill', 'url(#inputGradient)');
}

/**
 * Draw the overview
 * @param {number} width Width of the cnn group
 * @param {number} height Height of the cnn group
 * @param {object} cnnGroup Group to appen cnn elements to
 * @param {function} nodeMouseOverHandler Callback func for mouseOver
 * @param {function} nodeMouseLeaveHandler Callback func for mouseLeave
 * @param {function} nodeClickHandler Callback func for click
 */
export const drawCNN = (width, height, cnnGroup, nodeMouseOverHandler,
  nodeMouseLeaveHandler, nodeClickHandler) => {
  // Draw the CNN
  // There are 8 short gaps and 5 long gaps
  hSpaceAroundGap = (width - nodeLength * numLayers) / (8 + 5 * gapRatio);
  hSpaceAroundGapStore.set(hSpaceAroundGap);
  let leftAccuumulatedSpace = 0;

  // Iterate through the cnn to draw nodes in each layer
  for (let l = 0; l < cnn.length; l++) {
    let curLayer = cnn[l];
    let isOutput = curLayer[0].layerName === 'output';

    nodeCoordinate.push([]);

    // Compute the x coordinate of the whole layer
    // Output layer and conv layer has long gaps
    if (isOutput || curLayer[0].type === 'conv') {
      leftAccuumulatedSpace += hSpaceAroundGap * gapRatio;
    } else {
      leftAccuumulatedSpace += hSpaceAroundGap;
    }

    // All nodes share the same x coordiante (left in div style)
    let left = leftAccuumulatedSpace;

    let layerGroup = cnnGroup.append('g')
      .attr('class', 'cnn-layer-group')
      .attr('id', `cnn-layer-group-${l}`);

    vSpaceAroundGap = (height - nodeLength * curLayer.length) /
      (curLayer.length + 1);
    vSpaceAroundGapStore.set(vSpaceAroundGap);

    let nodeGroups = layerGroup.selectAll('g.node-group')
      .data(curLayer, d => d.index)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .style('pointer-events', 'all')
      .on('click', nodeClickHandler)
      .on('mouseover', nodeMouseOverHandler)
      .on('mouseleave', nodeMouseLeaveHandler)
      .classed('node-output', isOutput)
      .attr('id', (d, i) => {
        // Compute the coordinate
        // Not using transform on the group object because of a decade old
        // bug on webkit (safari)
        // https://bugs.webkit.org/show_bug.cgi?id=23113
        let top = i * nodeLength + (i + 1) * vSpaceAroundGap;
        top += svgPaddings.top;
        nodeCoordinate[l].push({x: left, y: top});
        return `layer-${l}-node-${i}`
      });
    
    // Overwrite the mouseover and mouseleave function for output nodes to show
    // hover info in the UI
    layerGroup.selectAll('g.node-output')
      .on('mouseover', (d, i, g) => {
        nodeMouseOverHandler(d, i, g);
        hoverInfoStore.set( {show: true, text: `Output value: ${formater(d.output)}`} );
      })
      .on('mouseleave', (d, i, g) => {
        nodeMouseLeaveHandler(d, i, g);
        hoverInfoStore.set( {show: false, text: `Output value: ${formater(d.output)}`} );
      });
    
    if (curLayer[0].layerName !== 'output') {
      // Embed raster image in these groups
      nodeGroups.append('image')
        .attr('class', 'node-image')
        .attr('width', nodeLength)
        .attr('height', nodeLength)
        .attr('x', left)
        .attr('y', (d, i) => nodeCoordinate[l][i].y);
      
      // Add a rectangle to show the border
      nodeGroups.append('rect')
        .attr('class', 'bounding')
        .attr('width', nodeLength)
        .attr('height', nodeLength)
        .attr('x', left)
        .attr('y', (d, i) => nodeCoordinate[l][i].y)
        .style('fill', 'none')
        .style('stroke', 'gray')
        .style('stroke-width', 1)
        .classed('hidden', true);
    } else {
      nodeGroups.append('rect')
        .attr('class', 'output-rect')
        .attr('x', left)
        .attr('y', (d, i) => nodeCoordinate[l][i].y + nodeLength / 2 + 8)
        .attr('height', nodeLength / 4)
        .attr('width', 0)
        .style('fill', 'gray');
      nodeGroups.append('text')
        .attr('class', 'output-text')
        .attr('x', left)
        .attr('y', (d, i) => nodeCoordinate[l][i].y + nodeLength / 2)
        .style('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('fill', 'black')
        .style('opacity', 0.5)
        .text((d, i) => classLists[i]);
      
      // Add annotation text to tell readers the exact output probability
      // nodeGroups.append('text')
      //   .attr('class', 'annotation-text')
      //   .attr('id', (d, i) => `output-prob-${i}`)
      //   .attr('x', left)
      //   .attr('y', (d, i) => nodeCoordinate[l][i].y + 10)
      //   .text(d => `(${d3.format('.4f')(d.output)})`);
    }
    leftAccuumulatedSpace += nodeLength;
  }

  // Share the nodeCoordinate
  nodeCoordinateStore.set(nodeCoordinate)

  // Compute the scale of the output score width (mapping the the node
  // width to the max output score)
  let outputRectScale = d3.scaleLinear()
        .domain(cnnLayerRanges.output)
        .range([0, nodeLength]);

  // Draw the canvas
  for (let l = 0; l < cnn.length; l++) {
    let range = cnnLayerRanges[selectedScaleLevel][l];
    svg.select(`g#cnn-layer-group-${l}`)
      .selectAll('image.node-image')
      .each((d, i, g) => drawOutput(d, i, g, range));
  }

  svg.selectAll('g.node-output').each(
    (d, i, g) => drawOutputScore(d, i, g, outputRectScale)
  );

  // Add layer label
  let layerNames = cnn.map(d => {
    if (d[0].layerName === 'output') {
      return {
        name: d[0].layerName,
        dimension: `(${d.length})`
      }
    } else {
      return {
        name: d[0].layerName,
        dimension: `(${d[0].output.length}, ${d[0].output.length}, ${d.length})`
      }
    }
  });

  let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
  let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
  
  let detailedLabels = svg.selectAll('g.layer-detailed-label')
    .data(layerNames)
    .enter()
    .append('g')
    .attr('class', 'layer-detailed-label')
    .attr('id', (d, i) => `layer-detailed-label-${i}`)
    .classed('hidden', !detailedMode)
    .attr('transform', (d, i) => {
      let x = nodeCoordinate[i][0].x + nodeLength / 2;
      let y = (svgPaddings.top + vSpaceAroundGap) / 2 - 6;
      return `translate(${x}, ${y})`;
    })
    .style('cursor', d => d.name.includes('output') ? 'default' : 'help')
    .on('click', (d) => {
      let target = '';
      if (d.name.includes('conv')) { target = 'convolution' }
      if (d.name.includes('relu')) { target = 'relu' }
      if (d.name.includes('max_pool')) { target = 'pooling'}
      if (d.name.includes('input')) { target = 'input'}

      // Scroll to a article element
      let anchor = document.querySelector(`#article-${target}`);
      scroll.animateScroll(anchor);
    });
  
  detailedLabels.append('title')
    .text('Move to article section');
    
  detailedLabels.append('text')
    .style('opacity', 0.7)
    .style('dominant-baseline', 'middle')
    .append('tspan')
    .style('font-size', '12px')
    .text(d => d.name)
    .append('tspan')
    .style('font-size', '8px')
    .style('font-weight', 'normal')
    .attr('x', 0)
    .attr('dy', '1.5em')
    .text(d => d.dimension);
  
  let labels = svg.selectAll('g.layer-label')
    .data(layerNames)
    .enter()
    .append('g')
    .attr('class', 'layer-label')
    .attr('id', (d, i) => `layer-label-${i}`)
    .classed('hidden', detailedMode)
    .attr('transform', (d, i) => {
      let x = nodeCoordinate[i][0].x + nodeLength / 2;
      let y = (svgPaddings.top + vSpaceAroundGap) / 2 + 5;
      return `translate(${x}, ${y})`;
    })
    .style('cursor', d => d.name.includes('output') ? 'default' : 'help')
    .on('click', (d) => {
      let target = '';
      if (d.name.includes('conv')) { target = 'convolution' }
      if (d.name.includes('relu')) { target = 'relu' }
      if (d.name.includes('max_pool')) { target = 'pooling'}
      if (d.name.includes('input')) { target = 'input'}

      // Scroll to a article element
      let anchor = document.querySelector(`#article-${target}`);
      scroll.animateScroll(anchor);
    });
  
  labels.append('title')
    .text('Move to article section');
  
  labels.append('text')
    .style('dominant-baseline', 'middle')
    .style('opacity', 0.8)
    .text(d => {
      if (d.name.includes('conv')) { return 'conv' }
      if (d.name.includes('relu')) { return 'relu' }
      if (d.name.includes('max_pool')) { return 'max_pool'}
      return d.name
    });

  // Add layer color scale legends
  getLegendGradient(svg, layerColorScales.conv, 'convGradient');
  getLegendGradient(svg, layerColorScales.input[0], 'inputGradient');

  let legendHeight = 5;
  let legends = svg.append('g')
      .attr('class', 'color-legend')
      .attr('transform', `translate(${0}, ${
        svgPaddings.top + vSpaceAroundGap * (10) + vSpaceAroundGap +
        nodeLength * 10
      })`);
  
  drawLegends(legends, legendHeight);

  // Add edges between nodes
  let linkGen = d3.linkHorizontal()
    .x(d => d.x)
    .y(d => d.y);
  
  let linkData = getLinkData(nodeCoordinate, cnn);

  let edgeGroup = cnnGroup.append('g')
    .attr('class', 'edge-group');
  
  edgeGroup.selectAll('path.edge')
    .data(linkData)
    .enter()
    .append('path')
    .attr('class', d =>
      `edge edge-${d.targetLayerIndex} edge-${d.targetLayerIndex}-${d.targetNodeIndex}`)
    .attr('id', d => 
      `edge-${d.targetLayerIndex}-${d.targetNodeIndex}-${d.sourceNodeIndex}`)
    .attr('d', d => linkGen({source: d.source, target: d.target}))
    .style('fill', 'none')
    .style('stroke-width', edgeStrokeWidth)
    .style('opacity', edgeOpacity)
    .style('stroke', edgeInitColor);

  // Add input channel annotations
  let inputAnnotation = cnnGroup.append('g')
    .attr('class', 'input-annotation');

  let redChannel = inputAnnotation.append('text')
    .attr('x', nodeCoordinate[0][0].x + nodeLength / 2)
    .attr('y', nodeCoordinate[0][0].y + nodeLength + 5)
    .attr('class', 'annotation-text')
    .style('dominant-baseline', 'hanging')
    .style('text-anchor', 'middle');
  
  redChannel.append('tspan')
    .style('dominant-baseline', 'hanging')
    .style('fill', '#C95E67')
    .text('Red');
  
  redChannel.append('tspan')
    .style('dominant-baseline', 'hanging')
    .text(' channel');

  inputAnnotation.append('text')
    .attr('x', nodeCoordinate[0][1].x + nodeLength / 2)
    .attr('y', nodeCoordinate[0][1].y + nodeLength + 5)
    .attr('class', 'annotation-text')
    .style('dominant-baseline', 'hanging')
    .style('text-anchor', 'middle')
    .style('fill', '#3DB665')
    .text('Green');

  inputAnnotation.append('text')
    .attr('x', nodeCoordinate[0][2].x + nodeLength / 2)
    .attr('y', nodeCoordinate[0][2].y + nodeLength + 5)
    .attr('class', 'annotation-text')
    .style('dominant-baseline', 'hanging')
    .style('text-anchor', 'middle')
    .style('fill', '#3F7FBC')
    .text('Blue');
}

/**
 * Update canvas values when user changes input image
 */
export const updateCNN = () => {
  // Compute the scale of the output score width (mapping the the node
  // width to the max output score)
  let outputRectScale = d3.scaleLinear()
      .domain(cnnLayerRanges.output)
      .range([0, nodeLength]);

  // Rebind the cnn data to layer groups layer by layer
  for (let l = 0; l < cnn.length; l++) {
    let curLayer = cnn[l];
    let range = cnnLayerRanges[selectedScaleLevel][l];
    let layerGroup = svg.select(`g#cnn-layer-group-${l}`);

    let nodeGroups = layerGroup.selectAll('g.node-group')
      .data(curLayer);

    if (l < cnn.length - 1) {
      // Redraw the canvas and output node
      nodeGroups.transition('disappear')
        .duration(300)
        .ease(d3.easeCubicOut)
        .style('opacity', 0)
        .on('end', function() {
          d3.select(this)
            .select('image.node-image')
            .each((d, i, g) => drawOutput(d, i, g, range));
          d3.select(this).transition('appear')
            .duration(700)
            .ease(d3.easeCubicIn)
            .style('opacity', 1);
        });
    } else {
      nodeGroups.each(
        (d, i, g) => drawOutputScore(d, i, g, outputRectScale)
      );
    }
  }

  // Update the color scale legend
  // Local legends
  for (let i = 0; i < 2; i++){
    let start = 1 + i * 5;
    let range1 = cnnLayerRanges.local[start];
    let range2 = cnnLayerRanges.local[start + 2];

    let localLegendScale1 = d3.scaleLinear()
      .range([0, 2 * nodeLength + hSpaceAroundGap])
      .domain([-range1 / 2, range1 / 2]);
    
    let localLegendScale2 = d3.scaleLinear()
      .range([0, 3 * nodeLength + 2 * hSpaceAroundGap])
      .domain([-range2 / 2, range2 / 2]);

    let localLegendAxis1 = d3.axisBottom()
      .scale(localLegendScale1)
      .tickFormat(d3.format('.2f'))
      .tickValues([-range1 / 2, 0, range1 / 2]);
    
    let localLegendAxis2 = d3.axisBottom()
      .scale(localLegendScale2)
      .tickFormat(d3.format('.2f'))
      .tickValues([-range2 / 2, 0, range2 / 2]);
    
    svg.select(`g#local-legend-${i}-1`).select('g').call(localLegendAxis1);
    svg.select(`g#local-legend-${i}-2`).select('g').call(localLegendAxis2);
  }

  // Module legend
  for (let i = 0; i < 2; i++){
    let start = 1 + i * 5;
    let range = cnnLayerRanges.local[start];

    let moduleLegendScale = d3.scaleLinear()
      .range([0, 5 * nodeLength + 3 * hSpaceAroundGap +
        1 * hSpaceAroundGap * gapRatio - 1.2])
      .domain([-range, range]);

    let moduleLegendAxis = d3.axisBottom()
      .scale(moduleLegendScale)
      .tickFormat(d3.format('.2f'))
      .tickValues([-range, -(range / 2), 0, range/2, range]);
    
    svg.select(`g#module-legend-${i}`).select('g').call(moduleLegendAxis);
  }

  // Global legend
  let start = 1;
  let range = cnnLayerRanges.global[start];

  let globalLegendScale = d3.scaleLinear()
    .range([0, 10 * nodeLength + 6 * hSpaceAroundGap +
      3 * hSpaceAroundGap * gapRatio - 1.2])
    .domain([-range, range]);

  let globalLegendAxis = d3.axisBottom()
    .scale(globalLegendScale)
    .tickFormat(d3.format('.2f'))
    .tickValues([-range, -(range / 2), 0, range/2, range]);

  svg.select(`g#global-legend`).select('g').call(globalLegendAxis);

  // Output legend
  let outputLegendAxis = d3.axisBottom()
    .scale(outputRectScale)
    .tickFormat(d3.format('.1f'))
    .tickValues([0, cnnLayerRanges.output[1]]);
  
  svg.select('g#output-legend').select('g').call(outputLegendAxis);
}

/**
 * Update the ranges for current CNN layers
 */
export const updateCNNLayerRanges = () => {
  // Iterate through all nodes to find a output ranges for each layer
  let cnnLayerRangesLocal = [1];
  let curRange = undefined;

  // Also track the min/max of each layer (avoid computing during intermediate
  // layer)
  cnnLayerMinMax = [];

  for (let l = 0; l < cnn.length - 1; l++) {
    let curLayer = cnn[l];

    // Compute the min max
    let outputExtents = curLayer.map(l => getExtent(l.output));
    let aggregatedExtent = outputExtents.reduce((acc, cur) => {
      return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
    })
    cnnLayerMinMax.push({min: aggregatedExtent[0], max: aggregatedExtent[1]});

    // conv layer refreshes curRange counting
    if (curLayer[0].type === 'conv' || curLayer[0].type === 'fc') {
      aggregatedExtent = aggregatedExtent.map(Math.abs);
      // Plus 0.1 to offset the rounding error (avoid black color)
      curRange = 2 * (0.1 + 
        Math.round(Math.max(...aggregatedExtent) * 1000) / 1000);
    }

    if (curRange !== undefined){
      cnnLayerRangesLocal.push(curRange);
    }
  }

  // Finally, add the output layer range
  cnnLayerRangesLocal.push(1);
  cnnLayerMinMax.push({min: 0, max: 1});

  // Support different levels of scales (1) lcoal, (2) component, (3) global
  let cnnLayerRangesComponent = [1];
  let numOfComponent = (numLayers - 2) / 5;
  for (let i = 0; i < numOfComponent; i++) {
    let curArray = cnnLayerRangesLocal.slice(1 + 5 * i, 1 + 5 * i + 5);
    let maxRange = Math.max(...curArray);
    for (let j = 0; j < 5; j++) {
      cnnLayerRangesComponent.push(maxRange);
    }
  }
  cnnLayerRangesComponent.push(1);

  let cnnLayerRangesGlobal = [1];
  let maxRange = Math.max(...cnnLayerRangesLocal.slice(1,
    cnnLayerRangesLocal.length - 1));
  for (let i = 0; i < numLayers - 2; i++) {
    cnnLayerRangesGlobal.push(maxRange);
  }
  cnnLayerRangesGlobal.push(1);

  // Update the ranges dictionary
  cnnLayerRanges.local = cnnLayerRangesLocal;
  cnnLayerRanges.module = cnnLayerRangesComponent;
  cnnLayerRanges.global = cnnLayerRangesGlobal;
  cnnLayerRanges.output = [0, d3.max(cnn[cnn.length - 1].map(d => d.output))];

  cnnLayerRangesStore.set(cnnLayerRanges);
  cnnLayerMinMaxStore.set(cnnLayerMinMax);
}


================================================
FILE: src/utils/cnn-tf.js
================================================
/* global tf */

// Network input image size
const networkInputSize = 64;

// Enum of node types
const nodeType = {
  INPUT: 'input',
  CONV: 'conv',
  POOL: 'pool',
  RELU: 'relu',
  FC: 'fc',
  FLATTEN: 'flatten'
}

class Node {
  /**
   * Class structure for each neuron node.
   * 
   * @param {string} layerName Name of the node's layer.
   * @param {int} index Index of this node in its layer.
   * @param {string} type Node type {input, conv, pool, relu, fc}. 
   * @param {number} bias The bias assocated to this node.
   * @param {number[]} output Output of this node.
   */
  constructor(layerName, index, type, bias, output) {
    this.layerName = layerName;
    this.index = index;
    this.type = type;
    this.bias = bias;
    this.output = output;

    // Weights are stored in the links
    this.inputLinks = [];
    this.outputLinks = [];
  }
}

class Link {
  /**
   * Class structure for each link between two nodes.
   * 
   * @param {Node} source Source node.
   * @param {Node} dest Target node.
   * @param {number} weight Weight associated to this link. It can be a number,
   *  1D array, or 2D array.
   */
  constructor(source, dest, weight) {
    this.source = source;
    this.dest = dest;
    this.weight = weight;
  }
}

/**
 * Construct a CNN with given extracted outputs from every layer.
 * 
 * @param {number[][]} allOutputs Array of outputs for each layer.
 *  allOutputs[i][j] is the output for layer i node j.
 * @param {Model} model Loaded tf.js model.
 * @param {Tensor} inputImageTensor Loaded input image tensor.
 */
const constructCNNFromOutputs = (allOutputs, model, inputImageTensor) => {
  let cnn = [];

  // Add the first layer (input layer)
  let inputLayer = [];
  let inputShape = model.layers[0].batchInputShape.slice(1);
  let inputImageArray = inputImageTensor.transpose([2, 0, 1]).arraySync();

  // First layer's three nodes' outputs are the channels of inputImageArray
  for (let i = 0; i < inputShape[2]; i++) {
    let node = new Node('input', i, nodeType.INPUT, 0, inputImageArray[i]);
    inputLayer.push(node);
  }
                                                                                                                   
  cnn.push(inputLayer);
  let curLayerIndex = 1;

  for (let l = 0; l < model.layers.length; l++) {
    let layer = model.layers[l];
    // Get the current output
    let outputs = allOutputs[l].squeeze();
    outputs = outputs.arraySync();

    let curLayerNodes = [];
    let curLayerType;

    // Identify layer type based on the layer name
    if (layer.name.includes('conv')) {
      curLayerType = nodeType.CONV;
    } else if (layer.name.includes('pool')) {
      curLayerType = nodeType.POOL;
    } else if (layer.name.includes('relu')) {
      curLayerType = nodeType.RELU;
    } else if (layer.name.includes('output')) {
      curLayerType = nodeType.FC;
    } else if (layer.name.includes('flatten')) {
      curLayerType = nodeType.FLATTEN;
    } else {
      console.log('Find unknown type');
    }

    // Construct this layer based on its layer type
    switch (curLayerType) {
      case nodeType.CONV: {
        let biases = layer.bias.val.arraySync();
        // The new order is [output_depth, input_depth, height, width]
        let weights = layer.kernel.val.transpose([3, 2, 0, 1]).arraySync();

        // Add nodes into this layer
        for (let i = 0; i < outputs.length; i++) {
          let node = new Node(layer.name, i, curLayerType, biases[i],
            outputs[i]);

          // Connect this node to all previous nodes (create links)
          // CONV layers have weights in links. Links are one-to-multiple.
          for (let j = 0; j < cnn[curLayerIndex - 1].length; j++) {
            let preNode = cnn[curLayerIndex - 1][j];
            let curLink = new Link(preNode, node, weights[i][j]);
            preNode.outputLinks.push(curLink);
            node.inputLinks.push(curLink);
          }
          curLayerNodes.push(node);
        }
        break;
      }
      case nodeType.FC: {
        let biases = layer.bias.val.arraySync();
        // The new order is [output_depth, input_depth]
        let weights = layer.kernel.val.transpose([1, 0]).arraySync();

        // Add nodes into this layer
        for (let i = 0; i < outputs.length; i++) {
          let node = new Node(layer.name, i, curLayerType, biases[i],
            outputs[i]);

          // Connect this node to all previous nodes (create links)
          // FC layers have weights in links. Links are one-to-multiple.

          // Since we are visualizing the logit values, we need to track
          // the raw value before softmax
          let curLogit = 0;
          for (let j = 0; j < cnn[curLayerIndex - 1].length; j++) {
            let preNode = cnn[curLayerIndex - 1][j];
            let curLink = new Link(preNode, node, weights[i][j]);
            preNode.outputLinks.push(curLink);
            node.inputLinks.push(curLink);
            curLogit += preNode.output * weights[i][j];
          }
          curLogit += biases[i];
          node.logit = curLogit;
          curLayerNodes.push(node);
        }

        // Sort flatten layer based on the node TF index
        cnn[curLayerIndex - 1].sort((a, b) => a.realIndex - b.realIndex);
        break;
      }
      case nodeType.RELU:
      case nodeType.POOL: {
        // RELU and POOL have no bias nor weight
        let bias = 0;
        let weight = null;

        // Add nodes into this layer
        for (let i = 0; i < outputs.length; i++) {
          let node = new Node(layer.name, i, curLayerType, bias, outputs[i]);

          // RELU and POOL layers have no weights. Links are one-to-one
          let preNode = cnn[curLayerIndex - 1][i];
          let link = new Link(preNode, node, weight);
          preNode.outputLinks.push(link);
          node.inputLinks.push(link);

          curLayerNodes.push(node);
        }
        break;
      }
      case nodeType.FLATTEN: {
        // Flatten layer has no bias nor weights.
        let bias = 0;

        for (let i = 0; i < outputs.length; i++) {
          // Flatten layer has no weights. Links are multiple-to-one.
          // Use dummy weights to store the corresponding entry in the previsou
          // node as (row, column)
          // The flatten() in tf2.keras has order: channel -> row -> column
          let preNodeWidth = cnn[curLayerIndex - 1][0].output.length,
            preNodeNum = cnn[curLayerIndex - 1].length,
            preNodeIndex = i % preNodeNum,
            preNodeRow = Math.floor(Math.floor(i / preNodeNum) / preNodeWidth),
            preNodeCol = Math.floor(i / preNodeNum) % preNodeWidth,
            // Use channel, row, colume to compute the real index with order
            // row -> column -> channel
            curNodeRealIndex = preNodeIndex * (preNodeWidth * preNodeWidth) +
              preNodeRow * preNodeWidth + preNodeCol;
          
          let node = new Node(layer.name, i, curLayerType,
              bias, outputs[i]);
          
          // TF uses the (i) index for computation, but the real order should
          // be (curNodeRealIndex). We will sort the nodes using the real order
          // after we compute the logits in the output layer.
          node.realIndex = curNodeRealIndex;

          let link = new Link(cnn[curLayerIndex - 1][preNodeIndex],
              node, [preNodeRow, preNodeCol]);

          cnn[curLayerIndex - 1][preNodeIndex].outputLinks.push(link);
          node.inputLinks.push(link);

          curLayerNodes.push(node);
        }

        // Sort flatten layer based on the node TF index
        curLayerNodes.sort((a, b) => a.index - b.index);
        break;
      }
      default:
        console.error('Encounter unknown layer type');
        break;
    }

    // Add current layer to the NN
    cnn.push(curLayerNodes);
    curLayerIndex++;
  }

  return cnn;
}

/**
 * Construct a CNN with given model and input.
 * 
 * @param {string} inputImageFile filename of input image.
 * @param {Model} model Loaded tf.js model.
 */
export const constructCNN = async (inputImageFile, model) => {
  // Load the image file
  let inputImageTensor = await getInputImageArray(inputImageFile, true);

  // Need to feed the model with a batch
  let inputImageTensorBatch = tf.stack([inputImageTensor]);

  // To get intermediate layer outputs, we will iterate through all layers in
  // the model, and sequencially apply transformations.
  let preTensor = inputImageTensorBatch;
  let outputs = [];

  // Iterate through all layers, and build one model with that layer as output
  for (let l = 0; l < model.layers.length; l++) {
    let curTensor = model.layers[l].apply(preTensor);

    // Record the output tensor
    // Because there is only one element in the batch, we use squeeze()
    // We also want to use CHW order here
    let output = curTensor.squeeze();
    if (output.shape.length === 3) {
      output = output.transpose([2, 0, 1]);
    }
    outputs.push(output);

    // Update preTensor for next nesting iteration
    preTensor = curTensor;
  }

  let cnn = constructCNNFromOutputs(outputs, model, inputImageTensor);
  return cnn;
}

// Helper functions

/**
 * Crop the largest central square of size 64x64x3 of a 3d array.
 * 
 * @param {[int8]} arr array that requires cropping and padding (if a 64x64 crop
 * is not present)
 * @returns 64x64x3 array
 */
const cropCentralSquare = (arr) => {
  let width = arr.length;
  let height = arr[0].length;
  let croppedArray;

  // Crop largest square from image if the image is smaller than 64x64 and pad the
  // cropped image.
  if (width < networkInputSize || height < networkInputSize) {
    // TODO(robert): Finish the padding logic.  Pushing now for Omar to work on when he is ready.
    let cropDimensions = Math.min(width, height);
    let startXIdx = Math.floor(width / 2) - (cropDimensions / 2);
    let startYIdx = Math.floor(height / 2) - (cropDimensions / 2);
    let unpaddedSubarray = arr.slice(startXIdx, startXIdx + cropDimensions).map(i => i.slice(startYIdx, startYIdx + cropDimensions));
  } else {
    let startXIdx = Math.floor(width / 2) - Math.floor(networkInputSize / 2);
    let startYIdx = Math.floor(height / 2) - Math.floor(networkInputSize / 2);
    croppedArray = arr.slice(startXIdx, startXIdx + networkInputSize).map(i => i.slice(startYIdx, startYIdx + networkInputSize));
  }
  return croppedArray;
}

/**
 * Convert canvas image data into a 3D tensor with dimension [height, width, 3].
 * Recall that tensorflow uses NHWC order (batch, height, width, channel).
 * Each pixel is in 0-255 scale.
 * 
 * @param {[int8]} imageData Canvas image data
 * @param {int} width Canvas image width
 * @param {int} height Canvas image height
 */
const imageDataTo3DTensor = (imageData, width, height, normalize=true) => {
  // Create array placeholder for the 3d array
  let imageArray = tf.fill([width, height, 3], 0).arraySync();

  // Iterate through the data to fill out channel arrays above
  for (let i = 0; i < imageData.length; i++) {
    let pixelIndex = Math.floor(i / 4),
      channelIndex = i % 4,
      row = width === height ? Math.floor(pixelIndex / width)
                              : pixelIndex % width,
      column = width === height ? pixelIndex % width
                              : Math.floor(pixelIndex / width);
    
    if (channelIndex < 3) {
      let curEntry  = imageData[i];
      // Normalize the original pixel value from [0, 255] to [0, 1]
      if (normalize) {
        curEntry /= 255;
      }
      imageArray[row][column][channelIndex] = curEntry;
    }
  }

  // If the image is not 64x64, crop and or pad the image appropriately.
  if (width != networkInputSize && height != networkInputSize) {
    imageArray = cropCentralSquare(imageArray)
  }

  let tensor = tf.tensor3d(imageArray);
  return tensor;
}

/**
 * Get the 3D pixel value array of the given image file.
 * 
 * @param {string} imgFile File path to the image file
 * @returns A promise with the corresponding 3D array
 */
const getInputImageArray = (imgFile, normalize=true) => {
  let canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:none;';
  document.getElementsByTagName('body')[0].appendChild(canvas);
  let context = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    let inputImage = new Image();
    inputImage.crossOrigin = "Anonymous";
    inputImage.src = imgFile;
    let canvasImage;
    inputImage.onload = () => {
      canvas.width = inputImage.width;
      canvas.height = inputImage.height;
      // Resize the input image of the network if it is too large to simply crop
      // the center 64x64 portion in order to still provide a representative
      // input image into the network.
      if (inputImage.width > networkInputSize || inputImage.height > networkInputSize) {
        // Step 1 - Resize using smaller dimension to scale the image down. 
        let resizeCanvas = document.createElement('canvas'),
            resizeContext = resizeCanvas.getContext('2d');
        let smallerDimension = Math.min(inputImage.width, inputImage.height);
        const resizeFactor = (networkInputSize + 1) / smallerDimension;
        resizeCanvas.width = inputImage.width * resizeFactor;
        resizeCanvas.height = inputImage.height * resizeFactor;
        resizeContext.drawImage(inputImage, 0, 0, resizeCanvas.width,
          resizeCanvas.height);

        // Step 2 - Flip non-square images horizontally and rotate them 90deg since
        // non-square images are not stored upright.
        if (inputImage.width != inputImage.height) {
          context.translate(resizeCanvas.width, 0);
          context.scale(-1, 1);
          context.translate(resizeCanvas.width / 2, resizeCanvas.height / 2);
          context.rotate(90 * Math.PI / 180);
        }

        // Step 3 - Draw resized image on original canvas.
        if (inputImage.width != inputImage.height) {
          context.drawImage(resizeCanvas, -resizeCanvas.width / 2, -resizeCanvas.height / 2);
        } else {
          context.drawImage(resizeCanvas, 0, 0);
        }
        canvasImage = context.getImageData(0, 0, resizeCanvas.width,
          resizeCanvas.height);

      } else {
        context.drawImage(inputImage, 0, 0);
        canvasImage = context.getImageData(0, 0, inputImage.width,
          inputImage.height);
      }
      // Get image data and convert it to a 3D array
      let imageData = canvasImage.data;
      let imageWidth = canvasImage.width;
      let imageHeight = canvasImage.height;

      // Remove this newly created canvas element
      canvas.parentNode.removeChild(canvas);

      resolve(imageDataTo3DTensor(imageData, imageWidth, imageHeight, normalize));
    }
    inputImage.onerror = reject;
  })
}

/**
 * Wrapper to load a model.
 * 
 * @param {string} modelFile Filename of converted (through tensorflowjs.py)
 *  model json file.
 */
export const loadTrainedModel = (modelFile) => {
  return tf.loadLayersModel(modelFile);
}



================================================
FILE: src/utils/cnn.js
================================================
// Enum of node types
const nodeType = {
  INPUT: 'input',
  CONV: 'conv',
  POOL: 'pool',
  RELU: 'relu',
  FC: 'fc',
  FLATTEN: 'flatten'
}

class Node {
  /**
   * Class structure for each neuron node.
   * 
   * @param {string} layerName Name of the node's layer.
   * @param {int} index Index of this node in its layer.
   * @param {string} type Node type {input, conv, pool, relu, fc}. 
   * @param {number} bias The bias assocated to this node.
   * @param {[[number]]} output Output of this node.
   */
  constructor(layerName, index, type, bias, output) {
    this.layerName = layerName;
    this.index = index;
    this.type = type;
    this.bias = bias;
    this.output = output;

    // Weights are stored in the links
    this.inputLinks = [];
    this.outputLinks = [];
  }
}

class Link {
  constructor(source, dest, weight) {
    this.source = source;
    this.dest = dest;
    this.weight = weight;
  }
}

const constructNNFromJSON = (nnJSON, inputImageArray) => {
  console.log(nnJSON);
  console.log(inputImageArray);
  let nn = [];

  // Add the first layer (input layer)
  let inputLayer = [];
  let inputShape = nnJSON[0].input_shape;

  // First layer's three nodes' outputs are the channels of inputImageArray
  for (let i = 0; i < inputShape[2]; i++) {
    let node = new Node('input', i, nodeType.INPUT, 0, inputImageArray[i]);
    inputLayer.push(node);
  }
                                                                                                                   
  nn.push(inputLayer);
  let curLayerIndex = 1;

  nnJSON.forEach(layer => {
    let curLayerNodes = [];
    let curLayerType;

    if (layer.name.includes('conv')) {
      curLayerType = nodeType.CONV;
    } else if (layer.name.includes('pool')) {
      curLayerType = nodeType.POOL;
    } else if (layer.name.includes('relu')) {
      curLayerType = nodeType.RELU;
    } else if (layer.name.includes('output')) {
      curLayerType = nodeType.FC;
    } else if (layer.name.includes('flatten')) {
      curLayerType = nodeType.FLATTEN;
    } else {
      console.log('Find unknown type');
    }

    let shape = layer.output_shape.slice(0, 2);
    let bias = 0;
    let output;
    if (curLayerType === nodeType.FLATTEN || curLayerType === nodeType.FC) {
      output = 0;
    } else {
      output = init2DArray(shape[0], shape[1], 0);
    }

    // Add neurons into this layer
    for (let i = 0; i < layer.num_neurons; i++) {
      if (curLayerType === nodeType.CONV || curLayerType === nodeType.FC) {
        bias = layer.weights[i].bias;
      }
      let node = new Node(layer.name, i, curLayerType, bias, output)

      // Connect this node to all previous nodes (create links)
      if (curLayerType === nodeType.CONV || curLayerType === nodeType.FC) {
        // CONV and FC layers have weights in links. Links are one-to-multiple
        for (let j = 0; j < nn[curLayerIndex - 1].length; j++) {
          let preNode = nn[curLayerIndex - 1][j];
          let curLink = new Link(preNode, node, layer.weights[i].weights[j]);
          preNode.outputLinks.push(curLink);
          node.inputLinks.push(curLink);
        }
      } else if (curLayerType === nodeType.RELU || curLayerType === nodeType.POOL) {
        // RELU and POOL layers have no weights. Links are one-to-one
        let preNode = nn[curLayerIndex - 1][i];
        let link = new Link(preNode, node, null);
        preNode.outputLinks.push(link);
        node.inputLinks.push(link);
      } else if (curLayerType === nodeType.FLATTEN) {
        // Flatten layer has no weights. Links are multiple-to-one.
        // Use dummy weights to store the corresponding entry in the previsou
        // node as (row, column)
        // The flatten() in tf2.keras has order: channel -> row -> column
        let preNodeWidth = nn[curLayerIndex - 1][0].output.length,
          preNodeNum = nn[curLayerIndex - 1].length,
          preNodeIndex = i % preNodeNum,
          preNodeRow = Math.floor(Math.floor(i / preNodeNum) / preNodeWidth),
          preNodeCol = Math.floor(i / preNodeNum) % preNodeWidth,
          link = new Link(nn[curLayerIndex - 1][preNodeIndex],
            node, [preNodeRow, preNodeCol]);

        nn[curLayerIndex - 1][preNodeIndex].outputLinks.push(link);
        node.inputLinks.push(link);
      }
      curLayerNodes.push(node);
    }

    // Add current layer to the NN
    nn.push(curLayerNodes);
    curLayerIndex++;
  });

  return nn;
}

export const constructNN = (inputImageFile) => {
  // Load the saved model file
  return new Promise((resolve, reject) => {
    fetch('PUBLIC_URL/assets/data/nn_10.json')
      .then(response => {
        response.json().then(nnJSON => {
          getInputImageArray(inputImageFile)
            .then(inputImageArray => {
              let nn = constructNNFromJSON(nnJSON, inputImageArray);
              resolve(nn);
            })
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Helper functions

/**
 * Create a 2D array (matrix) with given size and default value.
 * 
 * @param {int} height Height (number of rows) for the matrix
 * @param {int} width Width (number of columns) for the matrix
 * @param {int} fill Default value to fill this matrix
 */
export const init2DArray = (height, width, fill) => {
  let array = [];
  // Itereate through rows
  for (let r = 0; r < height; r++) {
    let row = new Array(width).fill(fill);
    array.push(row);
  }
  return array;
}

/**
 * Dot product of two matrices.
 * @param {[[number]]} mat1 Matrix 1
 * @param {[[number]]} mat2 Matrix 2
 */
const matrixDot = (mat1, mat2) => {
  console.assert(mat1.length === mat2.length, 'Dimension not matching');
  console.assert(mat1[0].length === mat2[0].length, 'Dimension not matching');

  let result = 0;
  for (let i = 0; i < mat1.length; i++){
    for (let j = 0; j < mat1[0].length; j++){
      result += mat1[i][j] * mat2[i][j];
    }
  }
  
  return result;
}

/**
 * Matrix elementwise addition.
 * @param {[[number]]} mat1 Matrix 1
 * @param {[[number]]} mat2 Matrix 2
 */
export const matrixAdd = (mat1, mat2) => {
  console.assert(mat1.length === mat2.length, 'Dimension not matching');
  console.assert(mat1[0].length === mat2[0].length, 'Dimension not matching');

  let result = init2DArray(mat1.length, mat1.length, 0);

  for (let i = 0; i < mat1.length; i++) {
    for (let j = 0; j < mat1.length; j++) {
      result[i][j] = mat1[i][j] + mat2[i][j];
    }
  }

  return result;
}

/**
 * 2D slice on a matrix.
 * @param {[[number]]} mat Matrix
 * @param {int} xs First dimension (row) starting index
 * @param {int} xe First dimension (row) ending index
 * @param {int} ys Second dimension (column) starting index
 * @param {int} ye Second dimension (column) ending index
 */
export const matrixSlice = (mat, xs, xe, ys, ye) => {
  return mat.slice(xs, xe).map(s => s.slice(ys, ye));
}

/**
 * Compute the maximum of a matrix.
 * @param {[[number]]} mat Matrix
 */
const matrixMax = (mat) => {
  let curMax = -Infinity;
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[0].length; j++) {
      if (mat[i][j] > curMax) {
        curMax = mat[i][j];
      }
    }
  }
  return curMax;
}

/**
 * Convert canvas image data into a 3D array with dimension [height, width, 3].
 * Each pixel is in 0-255 scale.
 * @param {[int8]} imageData Canvas image data
 */
const imageDataTo3DArray = (imageData) => {
  // Get image dimension (assume square image)
  let width = Math.sqrt(imageData.length / 4);

  // Create array placeholder for each channel
  let imageArray = [init2DArray(width, width, 0), init2DArray(width, width, 0),
    init2DArray(width, width, 0)];
  
  // Iterate through the data to fill out channel arrays above
  for (let i = 0; i < imageData.length; i++) {
    let pixelIndex = Math.floor(i / 4),
      channelIndex = i % 4,
      row = Math.floor(pixelIndex / width),
      column = pixelIndex % width;
    
    if (channelIndex < 3) {
      imageArray[channelIndex][row][column] = imageData[i];
    }
  }

  return imageArray;
}

/**
 * Get the 3D pixel value array of the given image file.
 * @param {string} imgFile File path to the image file
 * @returns A promise with the corresponding 3D array
 */
const getInputImageArray = (imgFile) => {
  let canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:none;';
  document.getElementsByTagName('body')[0].appendChild(canvas);
  let context = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    let inputImage = new Image();
    inputImage.src = imgFile;
    inputImage.onload = () => {
      context.drawImage(inputImage, 0, 0,);
      // Get image data and convert it to a 3D array
      let imageData = context.getImageData(0, 0, inputImage.width,
        inputImage.height).data;

      // Remove this newly created canvas element
      canvas.parentNode.removeChild(canvas);

      console.log(imageDataTo3DArray(imageData));
      resolve(imageDataTo3DArray(imageData));
    }
    inputImage.onerror = reject;
  })
}

/**
 * Compute convolutions of one kernel on one matrix (one slice of a tensor).
 * @param {[[number]]} input Input, square matrix
 * @param {[[number]]} kernel Kernel weights, square matrix
 * @param {int} stride Stride size
 * @param {int} padding Padding size
 */
export const singleConv = (input, kernel, stride=1, padding=0) => {
  // TODO: implement padding

  // Only support square input and kernel
  console.assert(input.length === input[0].length,
     'Conv input is not square');
  console.assert(kernel.length === kernel[0].length,
    'Conv kernel is not square');

  let stepSize = (input.length - kernel.length) / stride + 1;

  let result = init2DArray(stepSize, stepSize, 0);

  // Window sliding
  for (let r = 0; r < stepSize; r++) {
    for (let c = 0; c < stepSize; c++) {
      let curWindow = matrixSlice(input, r * stride, r * stride + kernel.length,
        c * stride, c * stride + kernel.length);
      let dot = matrixDot(curWindow, kernel);
      result[r][c] = dot;
    }
  }
  return result;
}

/**
 * Convolution operation. This function update the outputs property of all nodes
 * in the given layer. Previous layer is accessed by the reference in nodes'
 * links.
 * @param {[Node]} curLayer Conv layer.
 */
const convolute = (curLayer) => {
  console.assert(curLayer[0].type === 'conv', 'Wrong layer type');

  // Itereate through all nodes in curLayer to update their outputs
  curLayer.forEach(node => {
    /*
     * Accumulate the single conv result matrices from previous channels.
     * Previous channels (node) are accessed by the reference in Link objects.
     */
    let newOutput = init2DArray(node.output.length, node.output.length, 0);

    for (let i = 0; i < node.inputLinks.length; i++) {
      let curLink = node.inputLinks[i];
      let curConvResult = singleConv(curLink.source.output, curLink.weight);
      newOutput = matrixAdd(newOutput, curConvResult);
    }

    // Add bias to all element in the output
    let biasMatrix = init2DArray(newOutput.length, newOutput.length, node.bias);
    newOutput = matrixAdd(newOutput, biasMatrix);

    node.output = newOutput;
  })
}

/**
 * Activate matrix mat using ReLU (max(0, x)).
 * @param {[[number]]} mat Matrix
 */
const singleRelu = (mat) => {
  // Only support square matrix
  console.assert(mat.length === mat[0].length, 'Activating non-square matrix!');

  let width = mat.length;
  let result = init2DArray(width, width, 0);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      result[i][j] = Math.max(0, mat[i][j]);
    }
  }
  return result;
}

/**
 * Update outputs of all nodes in the current ReLU layer. Values of previous
 * layer nodes are accessed by the links stored in the current layer.
 * @param {[Node]} curLayer ReLU layer
 */
const relu = (curLayer) => {
  console.assert(curLayer[0].type === 'relu', 'Wrong layer type');

  // Itereate through all nodes in curLayer to update their outputs
  for (let i = 0; i < curLayer.length; i++) {
    let curNode = curLayer[i];
    let preNode = curNode.inputLinks[0].source;
    curNode.output = singleRelu(preNode.output);
  }
}

/**
 * Max pool one matrix.
 * @param {[[number]]} mat Matrix
 * @param {int} kernelWidth Pooling kernel length (only supports 2)
 * @param {int} stride Pooling sliding stride (only supports 2)
 * @param {string} padding Pading method when encountering odd number mat,
 * currently this function only supports 'VALID'
 */
export const singleMaxPooling = (mat, kernelWidth=2, stride=2, padding='VALID') => {
  console.assert(kernelWidth === 2, 'Only supports kernen = [2,2]');
  console.assert(stride === 2, 'Only supports stride = 2');
  console.assert(padding === 'VALID', 'Only support valid padding');

  // Handle odd length mat
  // 'VALID': ignore edge rows and columns
  // 'SAME': add zero padding to make the mat have even length
  if (mat.length % 2 === 1 && padding === 'VALID') {
    mat = matrixSlice(mat, 0, mat.length - 1, 0, mat.length - 1);
  }

  let stepSize = (mat.length - kernelWidth) / stride + 1;
  let result = init2DArray(stepSize, stepSize, 0);

  for (let r = 0; r < stepSize; r++) {
    for (let c = 0; c < stepSize; c++) {
      let curWindow = matrixSlice(mat, r * stride, r * stride + kernelWidth,
        c * stride, c * stride + kernelWidth);
      result[r][c] = matrixMax(curWindow);
    }
 }
 return result;
}

/**
 * Max pooling one layer.
 * @param {[Node]} curLayer MaxPool layer
 */
const maxPooling = (curLayer) => {
  console.assert(curLayer[0].type === 'pool', 'Wrong layer type');

  // Itereate through all nodes in curLayer to update their outputs
  for (let i = 0; i < curLayer.length; i++) {
    let curNode = curLayer[i];
    let preNode = curNode.inputLinks[0].source;
    curNode.output = singleMaxPooling(preNode.output);
  }
}

/**
 * Flatten a previous 2D layer (conv2d or maxpool2d). The flatten order matches
 * tf2.keras' implementation: channel -> row -> column.
 * @param {[Node]} curLayer Flatten layer
 */
const flatten = (curLayer) => {
  console.assert(curLayer[0].type === 'flatten', 'Wrong layer type');

  // Itereate through all nodes in curLayer to update their outputs
  for (let i = 0; i < curLayer.length; i++) {
    let curNode = curLayer[i];
    let preNode = curNode.inputLinks[0].source;
    let coordinate = curNode.inputLinks[0].weight;
    // Take advantage of the dummy weights
    curNode.output = preNode.output[coordinate[0]][coordinate[1]];
  }
}

const fullyConnect = (curLayer) => {
  console.assert(curLayer[0].type === 'fc', 'Wrong layer type');
  // TODO
}

export const tempMain = async () => {
  let nn = await constructNN('PUBLIC_URL/assets/img/koala.jpeg');
  convolute(nn[1]);
  relu(nn[2])
  convolute(nn[3]);
  relu(nn[4]);
  maxPooling(nn[5]);
  convolute(nn[6]);
  relu(nn[7])
  convolute(nn[8]);
  relu(nn[9]);
  maxPooling(nn[10]);
  convolute(nn[11]);
  relu(nn[12])
  convolute(nn[13]);
  relu(nn[14]);
  maxPooling(nn[15]);
  flatten(nn[16]);
  console.log(nn[16].map(d => d.output));
}


================================================
FILE: src/utils/deploy-to-gh-pages.sh
================================================
#!/bin/bash
set -o errexit

# config
git config --global user.email "xiao.hk1997@gmail.com"
git config --global user.name "xiaohk"

# build
git clone git@github.com:poloclub/cnn-explainer.git
cd cnn-explainer

npm install
npm run build

mkdir dist
copy -r ./public/* ./dist
sed -i 's/\/assets/\/cnn-explainer\/assets/g' ./dist/index.html

git add dist
git commit -m "Deploy gh-pages from Travis"
git subtree push --prefix dist origin gh-pages



================================================
FILE: src/utils/utlis.py
================================================
import tensorflow as tf
from json import dump

assert(int(tf.__version__.split('.')[0]) == 2)


def convert_h5_to_json(model_h5_file, model_json_file):
    """
    Helper function to convert tf2 stored model h5 file to a customized json
    format.

    Args:
        model_h5_file(string): filename of the stored h5 file
        model_json_file(string): filename of the output json file
    """

    model = tf.keras.models.load_model(model_h5_file)
    json_dict = {}

    for l in model.layers:
        json_dict[l.name] = {
            'input_shape': l.input_shape[1:],
            'output_shape': l.output_shape[1:],
            'num_neurons': l.output_shape[-1]
        }

        if 'conv' in l.name:
            all_weights = l.weights[0]
            neuron_weights = []

            # Iterate through neurons in that layer
            for n in range(all_weights.shape[3]):
                cur_neuron_dict = {}
                cur_neuron_dict['bias'] = l.bias.numpy()[n].item()

                # Get the current weights
                cur_weights = all_weights[:, :, :, n].numpy().astype(float)

                # Reshape the weights from (height, width, input_c) to
                # (input_c, height, width)
                cur_weights = cur_weights.transpose((2, 0, 1)).tolist()
                cur_neuron_dict['weights'] = cur_weights

                neuron_weights.append(cur_neuron_dict)

            json_dict[l.name]['weights'] = neuron_weights

        elif 'output' in l.name:
            all_weights = l.weights[0]
            neuron_weights = []

            # Iterate through neurons in that layer
            for n in range(all_weights.shape[1]):
                cur_neuron_dict = {}
                cur_neuron_dict['bias'] = l.bias.numpy()[n].item()

                # Get the current weights
                cur_weights = all_weights[:, n].numpy().astype(float).tolist()
                cur_neuron_dict['weights'] = cur_weights

                neuron_weights.append(cur_neuron_dict)

            json_dict[l.name]['weights'] = neuron_weights

    dump(json_dict, open(model_json_file, 'w'), indent=2)



================================================
FILE: tiny-vgg/README.md
================================================
# Train a Tiny VGG

This directory includes code and data to train a Tiny VGG model
(inspired by the demo CNN in [Stanford CS231n class](http://cs231n.stanford.edu))
on 10 everyday classes from the [Tiny ImageNet](https://tiny-imagenet.herokuapp.com).

## Installation

First, you want to unzip `data.zip`. The file structure would be something like:

```
.
├── data
│   ├── class_10_train
│   │   ├── n01882714
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n01882714_boxes.txt
│   │   ├── n02165456
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n02165456_boxes.txt
│   │   ├── n02509815
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n02509815_boxes.txt
│   │   ├── n03662601
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n03662601_boxes.txt
│   │   ├── n04146614
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n04146614_boxes.txt
│   │   ├── n04285008
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n04285008_boxes.txt
│   │   ├── n07720875
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n07720875_boxes.txt
│   │   ├── n07747607
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n07747607_boxes.txt
│   │   ├── n07873807
│   │   │   ├── images [500 entries exceeds filelimit, not opening dir]
│   │   │   └── n07873807_boxes.txt
│   │   └── n07920052
│   │       ├── images [500 entries exceeds filelimit, not opening dir]
│   │       └── n07920052_boxes.txt
│   ├── class_10_val
│   │   ├── test_images [250 entries exceeds filelimit, not opening dir]
│   │   └── val_images [250 entries exceeds filelimit, not opening dir]
│   ├── class_dict_10.json
│   └── val_class_dict_10.json
├── data.zip
├── environment.yaml
└── tiny-vgg.py
```

To install all dependencies, run the following code

```
conda env create --file environment.yaml
```

## Training

To train Tiny VGG on these 10 classes, run the following code

```
python tiny-vgg.py
```

After training, you will get two saved models in Keras format: `trained_tiny_vgg.h5`
and `trained_vgg_best.h5`. The first file is the final model after training, and
`trained_vgg_best.h5` is the model having the best validation performance.
You can use either one for CNN Explainer.

## Convert Model Format

Before loading the model using *tensorflow.js*, you want to convert the model file
from Keras `h5` format to [tensorflow.js format](https://www.tensorflow.org/js/tutorials/conversion/import_keras).

```
tensorflowjs_converter --input_format keras trained_vgg_best.h5 ./
```

Then you can put the output file `group1-shard1of1.bin` in `/public/data` and use
*tensorflow.js* to load the trained model.




================================================
FILE: tiny-vgg/environment.yaml
================================================
name: tiny-vgg
channels:
  - defaults
dependencies:
  - pip=20.0.2
  - python=3.6.10
  - pip:
    - h5py==2.10.0
    - numpy==1.18.3
    - pandas==1.0.3
    - scipy==1.4.1
    - tensorflow==2.1.0
    - tensorflow-cpu==2.1.0
    - tensorflowjs==1.7.4



================================================
FILE: tiny-vgg/tiny-vgg.py
================================================
import tensorflow as tf
import numpy as np
import pandas as pd
import re
from shutil import copyfile
from glob import glob
from json import load, dump
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPool2D,\
    Activation
from tensorflow.keras import Model, Sequential
from os.path import basename
from time import time

print(tf.__version__)


def create_class_dict():
    # Create a new version only including tiny 200 classes
    df = pd.read_csv('./tiny-imagenet-200/words.txt', sep='\t', header=None)
    keys, classes = df[0], df[1]
    class_dict = dict(zip(keys, classes))

    tiny_class_dict = {}
    cur_index = 0

    for directory in glob('./tiny-imagenet-200/train/*'):
        cur_key = basename(directory)
        tiny_class_dict[cur_key] = {'class': class_dict[cur_key],
                                    'index': cur_index}
        cur_index += 1

    dump(tiny_class_dict, open('./tiny-imagenet-200/class_dict.json', 'w'),
         indent=2)


def create_val_class_dict():
    tiny_class_dict = load(open('./tiny-imagenet-200/class_dict.json', 'r'))
    tiny_val_class_dict = {}

    # Create a dictionary for validation images
    df = pd.read_csv('./tiny-imagenet-200/val/val_annotations.txt', sep='\t',
                     header=None)
    image_names = df[0]
    image_classes = df[1]

    for i in range(len(image_names)):
        tiny_val_class_dict[image_names[i]] = {
            'class': tiny_class_dict[image_classes[i]]['class'],
            'index': tiny_class_dict[image_classes[i]]['index'],
        }

    dump(tiny_val_class_dict, open('./tiny-imagenet-200/val_class_dict.json',
                                   'w'),
         indent=2)


def split_val_data():
    # Split validation images to 50% early stopping and 50% hold-out testing
    val_images = glob('./tiny-imagenet-200/val/images/*.JPEG')
    np.random.shuffle(val_images)

    for i in range(len(val_images)):
        if i < len(val_images) // 2:
            copyfile(val_images[i], val_images[i].replace('images',
                                                          'val_images'))
        else:
            copyfile(val_images[i], val_images[i].replace('images',
                                                          'test_images'))


def process_path_train(path):
    """
    Get the (class label, processed image) pair of the given image path. This
    funciton uses python primitives, so you need to use tf.py_funciton wrapper.
    This function uses global variables:

        WIDTH(int): the width of the targeting image
        HEIGHT(int): the height of the targeting iamge
        NUM_CLASS(int): number of classes

    Args:
        path(string): path to an image file
    """

    # Get the class
    path = path.numpy()
    image_name = basename(path.decode('ascii'))
    label_name = re.sub(r'(.+)_\d+\.JPEG', r'\1', image_name)
    label_index = tiny_class_dict[label_name]['index']

    # Convert label to one-hot encoding
    label = tf.one_hot(indices=[label_index], depth=NUM_CLASS)
    label = tf.reshape(label, [NUM_CLASS])

    # Read image and convert the image to [0, 1] range 3d tensor
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.resize(img, [WIDTH, HEIGHT])

    return(img, label)


def process_path_test(path):
    """
    Get the (class label, processed image) pair of the given image path. This
    funciton uses python primitives, so you need to use tf.py_funciton wrapper.
    This function uses global variables:

        WIDTH(int): the width of the targeting image
        HEIGHT(int): the height of the targeting iamge
        NUM_CLASS(int): number of classes

    The filepath encoding for test images is different from training images.

    Args:
        path(string): path to an image file
    """

    # Get the class
    path = path.numpy()
    image_name = basename(path.decode('ascii'))
    label_index = tiny_val_class_dict[image_name]['index']

    # Convert label to one-hot encoding
    label = tf.one_hot(indices=[label_index], depth=NUM_CLASS)
    label = tf.reshape(label, [NUM_CLASS])

    # Read image and convert the image to [0, 1] range 3d tensor
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.resize(img, [WIDTH, HEIGHT])

    return(img, label)


def prepare_for_training(dataset, batch_size=32, cache=True,
                         shuffle_buffer_size=1000):

    if cache:
        if isinstance(cache, str):
            dataset = dataset.cache(cache)
        else:
            dataset = dataset.cache()

    # Only shuffle elements in the buffer size
    dataset = dataset.shuffle(buffer_size=shuffle_buffer_size)

    # Pre featch batches in the background
    dataset = dataset.batch(batch_size)
    dataset = dataset.prefetch(buffer_size=tf.data.experimental.AUTOTUNE)

    return dataset


def prepare_for_testing(dataset, batch_size=32, cache=True):
    if cache:
        if isinstance(cache, str):
            dataset = dataset.cache(cache)
        else:
            dataset = dataset.cache()

    # Pre featch batches in the background
    dataset = dataset.batch(batch_size)
    dataset = dataset.prefetch(buffer_size=tf.data.experimental.AUTOTUNE)

    return dataset


class TinyVGG(Model):
    """
    Tiny VGG structure is adapted from http://cs231n.stanford.edu:
        > This particular network is classifying CIFAR-10 images into one of 10
        > classes and was trained with ConvNetJS. Its exact architecture is
        > [conv-relu-conv-relu-pool]x3-fc-softmax, for a total of 17 layers and
        > 7000 parameters. It uses 3x3 convolutions and 2x2 pooling regions.
    """
    def __init__(self, filters=10):
        super(TinyVGG, self).__init__()
        self.conv_1_1 = Conv2D(filters, (3, 3), name='conv_1_1')
        self.relu_1_1 = Activation('relu', name='relu_1_1')
        self.conv_1_2 = Conv2D(filters, (3, 3), name='conv_1_2')
        self.relu_1_2 = Activation('relu', name='relu_1_2')
        self.max_pool_1 = MaxPool2D((2, 2), name='max_pool_1')

        self.conv_2_1 = Conv2D(filters, (3, 3), name='conv_2_1')
        self.relu_2_1 = Activation('relu', name='relu_2_1')
        self.conv_2_2 = Conv2D(filters, (3, 3), name='conv_2_2')
        self.relu_2_2 = Activation('relu', name='relu_2_2')
        self.max_pool_2 = MaxPool2D((2, 2), name='max_pool_2')

        self.flatten = Flatten()
        self.fc = Dense(NUM_CLASS, activation='softmax')

    def call(self, x):
        x = self.conv_1_1(x)
        x = self.relu_1_1(x)
        x = self.conv_1_2(x)
        x = self.relu_1_2(x)
        x = self.max_pool_1(x)

        x = self.conv_2_1(x)
        x = self.relu_2_1(x)
        x = self.conv_2_2(x)
        x = self.relu_2_2(x)
        x = self.max_pool_2(x)

        x = self.conv_3_1(x)
        x = self.relu_3_1(x)
        x = self.conv_3_2(x)
        x = self.relu_3_2(x)
        x = self.max_pool_3(x)

        x = self.flatten(x)
        return self.fc(x)


@tf.function
def train_step(image_batch, label_batch):
    with tf.GradientTape() as tape:
        # Predict
        predictions = tiny_vgg(image_batch)

        # Update gradient
        loss = loss_object(label_batch, predictions)
        gradients = tape.gradient(loss, tiny_vgg.trainable_variables)
        optimizer.apply_gradients(zip(gradients, tiny_vgg.trainable_variables))

        train_mean_loss(loss)
        train_accuracy(label_batch, predictions)


@tf.function
def vali_step(image_batch, label_batch):
    predictions = tiny_vgg(image_batch)
    vali_loss = loss_object(label_batch, predictions)

    vali_mean_loss(vali_loss)
    vali_accuracy(label_batch, predictions)


@tf.function
def test_step(image_batch, label_batch):
    predictions = tiny_vgg(image_batch)
    test_loss = loss_object(label_batch, predictions)

    test_mean_loss(test_loss)
    test_accuracy(label_batch, predictions)


WIDTH = 64
HEIGHT = 64
EPOCHS = 1000
PATIENCE = 50
LR = 0.001
NUM_CLASS = 10
BATCH_SIZE = 32

# Create training and validation dataset
tiny_class_dict = load(open('./data/class_dict_10.json', 'r'))
tiny_val_class_dict = load(open('./data/val_class_dict_10.json', 'r'))

training_images = './data/class_10_train/*/images/*.JPEG'
vali_images = './data/class_10_val/val_images/*.JPEG'
test_images = './data/class_10_val/test_images/*.JPEG'

# Create training dataset
train_path_dataset = tf.data.Dataset.list_files(training_images)

train_labeld_dataset = train_path_dataset.map(
    lambda path: tf.py_function(
        process_path_train,
        [path],
        [tf.float32, tf.float32]
    )
)

# Create vali dataset
vali_path_dataset = tf.data.Dataset.list_files(vali_images)

vali_labeld_dataset = vali_path_dataset.map(
    lambda path: tf.py_function(
        process_path_test,
        [path],
        [tf.float32, tf.float32]
    )
)

# Create test dataset
test_path_dataset = tf.data.Dataset.list_files(test_images)

test_labeld_dataset = test_path_dataset.map(
    lambda path: tf.py_function(
        process_path_test,
        [path],
        [tf.float32, tf.float32]
    )
)

train_dataset = prepare_for_training(train_labeld_dataset,
                                     batch_size=BATCH_SIZE)
vali_dataset = prepare_for_training(vali_labeld_dataset,
                                    batch_size=BATCH_SIZE)
test_dataset = prepare_for_training(test_labeld_dataset,
                                    batch_size=BATCH_SIZE)

# Create an instance of the model
# tiny_vgg = TinyVGG()

# Use Keras Sequential API instead, since it is easy to save the model
filters = 10
tiny_vgg = Sequential([
    Conv2D(filters, (3, 3), input_shape=(64, 64, 3), name='conv_1_1'),
    Activation('relu', name='relu_1_1'),
    Conv2D(filters, (3, 3), name='conv_1_2'),
    Activation('relu', name='relu_1_2'),
    MaxPool2D((2, 2), name='max_pool_1'),

    Conv2D(filters, (3, 3), name='conv_2_1'),
    Activation('relu', name='relu_2_1'),
    Conv2D(filters, (3, 3), name='conv_2_2'),
    Activation('relu', name='relu_2_2'),
    MaxPool2D((2, 2), name='max_pool_2'),

    Flatten(name='flatten'),
    Dense(NUM_CLASS, activation='softmax', name='output')
])

# "Compile" the model with loss function and optimizer
loss_object = tf.keras.losses.CategoricalCrossentropy()
# optimizer = tf.keras.optimizers.Adam(learning_rate=LR)
optimizer = tf.keras.optimizers.SGD(learning_rate=LR)

train_mean_loss = tf.keras.metrics.Mean(name='train_mean_loss')
train_accuracy = tf.keras.metrics.CategoricalAccuracy(name='train_accuracy')

vali_mean_loss = tf.keras.metrics.Mean(name='vali_mean_loss')
vali_accuracy = tf.keras.metrics.CategoricalAccuracy(name='vali_accuracy')

# Initialize early stopping parameters
no_improvement_epochs = 0
best_vali_loss = np.inf
start_time = time()
print('Start training.\n')

for epoch in range(EPOCHS):
    # Train
    for image_batch, label_batch in train_dataset:
        train_step(image_batch, label_batch)

    # Predict on the test dataset
    for image_batch, label_batch in vali_dataset:
        vali_step(image_batch, label_batch)

    template = 'epoch: {}, train loss: {:.4f}, train accuracy: {:.4f}, '
    template += 'vali loss: {:.4f}, vali accuracy: {:.4f}'
    print(template.format(epoch + 1,
                          train_mean_loss.result(),
                          train_accuracy.result() * 100,
                          vali_mean_loss.result(),
                          vali_accuracy.result() * 100))

    # Early stopping
    if vali_mean_loss.result() < best_vali_loss:
        no_improvement_epochs = 0
        best_vali_loss = vali_mean_loss.result()
        # Save the best model
        tiny_vgg.save('trained_vgg_best.h5')
    else:
        no_improvement_epochs += 1

    if no_improvement_epochs >= PATIENCE:
        print('Early stopping at epoch = {}'.format(epoch))
        break

    # Reset evaluation metrics
    train_mean_loss.reset_states()
    train_accuracy.reset_states()
    vali_mean_loss.reset_states()
    vali_accuracy.reset_states()

print('\nFinished training, used {:.4f} mins.'.format((time() -
                                                       start_time) / 60))
# Save trained model
tiny_vgg.save('trained_tiny_vgg.h5')
tiny_vgg = tf.keras.models.load_model('trained_vgg_best.h5')

# Test on hold-out test images
test_mean_loss = tf.keras.metrics.Mean(name='test_mean_loss')
test_accuracy = tf.keras.metrics.CategoricalAccuracy(name='test_accuracy')

for image_batch, label_batch in test_dataset:
    test_step(image_batch, label_batch)

template = '\ntest loss: {:.4f}, test accuracy: {:.4f}'
print(template.format(test_mean_loss.result(),
                      test_accuracy.result() * 100))




================================================
FILE: .github/workflows/build.yml
================================================
name: build

on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
  schedule:
    - cron: "0 0 * * *"

jobs:
  build:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        node-version: [16]
        os: [ubuntu-latest, macos-latest, windows-latest]

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build


