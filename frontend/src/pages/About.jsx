import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout title="About Us" testId="about-page">
      <div className="toy-card p-5 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-sky-700 mb-4">
          About Computer Champ
        </h1>

        <p className="text-slate-700 text-lg leading-7 mb-4">
          Computer Champ is a fun learning app made for children of Class 1 and 2.
          It helps kids learn computer basics, spelling, phonics, matching, and
          quick question-answer games in a simple and interactive way.
        </p>

        <p className="text-slate-700 text-lg leading-7 mb-4">
          Our goal is to make learning easy, enjoyable, and memorable through
          games, pictures, voice, and colorful activities.
        </p>

        <p className="text-slate-700 text-lg leading-7">
          Created by Jyoti Singh for young learners.
        </p>
      </div>
    </Layout>
  );
}