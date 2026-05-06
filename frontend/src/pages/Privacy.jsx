import Layout from "../components/Layout";

export default function Privacy() {
  return (
    <Layout title="Privacy Policy" testId="privacy-page">
      <div className="toy-card p-5 sm:p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-700 mb-4">
          Privacy Policy
        </h1>

        <p className="text-slate-700 mb-4 leading-7">
          Welcome to <b>Computer Champ</b>. We respect your privacy and are committed
          to keeping your information safe. This Privacy Policy explains what we
          collect, how we use it, and your choices when using our website.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Information We Collect
        </h2>
        <p className="text-slate-700 mb-4 leading-7">
          We may collect limited information such as the name entered for
          certificates, game progress, scores, and basic analytics to improve
          the learning experience. We do not ask for unnecessary personal details.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          How We Use Information
        </h2>
        <ul className="list-disc pl-6 text-slate-700 mb-4 leading-7 space-y-2">
          <li>To show your progress and scores inside the learning games.</li>
          <li>To generate certificates with the child’s name.</li>
          <li>To improve app performance, design, and learning content.</li>
          <li>To display ads through Google AdSense when enabled.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Cookies and Ads
        </h2>
        <p className="text-slate-700 mb-4 leading-7">
          This website may use cookies and third-party services like Google
          AdSense to show ads and measure performance. These services may use
          cookies or similar technologies according to their own policies.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Children’s Privacy
        </h2>
        <p className="text-slate-700 mb-4 leading-7">
          Computer Champ is made for children’s learning. We try to keep the
          experience safe, simple, and child-friendly. Parents or guardians can
          contact us anytime if they have privacy concerns.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Third-Party Services
        </h2>
        <p className="text-slate-700 mb-4 leading-7">
          We may use trusted third-party services such as hosting platforms,
          analytics tools, and advertising networks. Their use of data is governed
          by their own privacy policies.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Data Security
        </h2>
        <p className="text-slate-700 mb-4 leading-7">
          We take reasonable steps to keep your data safe, but no online platform
          can guarantee 100% security. Please use the website responsibly.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Changes to This Policy
        </h2>
        <p className="text-slate-700 mb-4 leading-7">
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page with the updated date.
        </p>

        <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
          Contact Us
        </h2>
        <p className="text-slate-700 leading-7">
          If you have any questions about this Privacy Policy, contact us at{" "}
          <b>your-email@gmail.com</b>.
        </p>

        <p className="text-slate-500 text-sm mt-6">
          Last updated: May 2026
        </p>
      </div>
    </Layout>
  );
}