import React from 'react';
import { motion } from 'framer-motion';

export function WhatIs() {
  return (
    <section className="max-w-4xl mx-auto text-center">
      <motion.h2
        className="text-4xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        What is Regularization?
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Regularization adds a penalty to the loss function to keep model weights small, reducing over‑fitting and improving
        generalisation. Think of it as "shrink‑the‑weights" to keep the model from memorising noise.
      </motion.p>
    </section>
  );
}
