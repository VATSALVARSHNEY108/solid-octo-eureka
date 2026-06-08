import Head from 'next/head';

export default function NeuralNetworks() {
  return (
    <>
      <Head>
        <title>Neural Networks </title>
        <meta name="description" content="Interactive TensorFlow Playground visualizing neural network configurations." />
      </Head>
      <section className="px-12 py-24 flex flex-col items-center bg-primary text-primary">
        <h1 className="text-3xl font-semibold mb-4">Neural Networks </h1>
        <iframe
          src="/tensorflow-playground-site/index.html"
          title="TensorFlow Playground"
          className="w-full h-[80vh] border rounded"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </section>
    </>
  );
}
