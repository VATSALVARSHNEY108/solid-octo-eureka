const cvProjectCategories: Array<{ title: string; projects: string[] }> = [
  {
    title: "Image Classification",
    projects: ["Plant disease classifier", "Waste sorting classifier", "Animal species recognizer", "Fashion category classifier"],
  },
  {
    title: "Object Detection",
    projects: ["Traffic object detector", "PPE compliance detector", "Retail shelf product detector", "Wildlife camera trap detector"],
  },
  {
    title: "Image Segmentation",
    projects: ["Road lane segmentation", "Satellite land-cover segmentation", "Building footprint segmentation", "Background removal tool"],
  },
  {
    title: "OCR and Document Vision",
    projects: ["Invoice data extraction", "Handwritten text recognition", "ID card parser", "License plate recognition"],
  },
  {
    title: "Face and Biometrics",
    projects: ["Face detection and alignment", "Face recognition attendance system", "Emotion analysis", "Anti-spoofing detector"],
  },
  {
    title: "Pose and Human Activity",
    projects: ["Workout form analyzer", "Yoga pose correction", "Fall detection for elderly care", "Gesture-controlled interface"],
  },
  {
    title: "Tracking and Video Analytics",
    projects: ["Multi-object tracking in surveillance", "People counting system", "Vehicle speed estimation", "Sports player tracking"],
  },
  {
    title: "Image Enhancement and Restoration",
    projects: ["Low-light image enhancement", "Image denoising pipeline", "Super-resolution app", "Old photo restoration"],
  },
  {
    title: "Generative Vision",
    projects: ["Text-to-image generation", "Image-to-image style transfer", "Inpainting and object removal", "Synthetic data generation"],
  },
  {
    title: "3D Computer Vision",
    projects: ["Depth estimation from monocular images", "3D reconstruction from multiple views", "SLAM for indoor mapping", "Point cloud object detection"],
  },
  {
    title: "Medical Imaging",
    projects: ["Tumor detection in MRI scans", "Pneumonia detection in X-rays", "Retinal disease classification", "Cell segmentation in microscopy"],
  },
  {
    title: "Industrial and Edge Vision",
    projects: ["Defect detection on production lines", "Barcode and QR scanner", "Smart parking occupancy detection", "Real-time edge inference dashboard"],
  },
];

export default function AllSimulation() {
  return (
    <section className="px-12 py-24">
      <header className="max-w-4xl">
        <h1 className="text-3xl font-semibold">All Types of Computer Vision Projects</h1>
        <p className="mt-4 text-base">
          This page gives you a complete map of practical CV project types. Pick one category, build a baseline model, and then iterate with better data,
          augmentation, architecture, and deployment.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {cvProjectCategories.map((category) => (
          <article key={category.title} className="rounded-lg border p-6" style={{ borderColor: "var(--border-primary)" }}>
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {category.projects.map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
