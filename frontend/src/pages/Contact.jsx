import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout title="Contact Us" testId="contact-page">
      <div className="toy-card p-5 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-700 mb-4">
          Contact Us
        </h1>

        <p className="text-slate-700 text-lg leading-7 mb-4">
          Thank you for visiting Computer Champ.  
          If you have any questions, feedback, suggestions, or learning ideas,
          feel free to contact us anytime.
        </p>

        <div className="bg-white rounded-2xl p-5 border-2 border-sky-100 shadow-sm">
          <p className="text-slate-800 font-bold text-lg mb-2">
            📧 Email Support
          </p>

          <p className="text-slate-700 text-lg break-all">
            shahi0jyoti@gmail.com
          </p>
        </div>

        <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
          <p className="text-slate-700 leading-7">
            We try to reply as quickly as possible and improve the learning
            experience for all students and children using Computer Champ.
          </p>
        </div>

        <p className="text-slate-500 text-sm mt-6">
          Created with ❤️ for young learners.
        </p>
      </div>
    </Layout>
  );
}