import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../lib/supabase";

function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    // https://www.youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function DoubtDetail() {
  const { id } = useParams();

  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoubt() {
      const { data, error } = await supabase
        .from("doubts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching doubt:", error);
        setLoading(false);
        return;
      }

      setDoubt(data);
      setLoading(false);
    }

    fetchDoubt();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <p className="loading-text">
          Loading doubt...
        </p>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="detail-page">
        <h1>Doubt not found</h1>

        <Link to="/" className="primary-btn">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(
    doubt.solution_video_url
  );

  return (
    <div className="detail-page">

      <Link to="/" className="back-link">
        ← Back to doubts
      </Link>


      {/* HEADER */}

      <div className="detail-header">

        <div className="detail-meta">

          <span className="doubt-topic">
            {doubt.topic}
          </span>

          <span className="doubt-status">
            {doubt.status}
          </span>

        </div>

        <h1>
          {doubt.title}
        </h1>

        <p className="detail-date">
          Asked on{" "}
          {new Date(
            doubt.created_at
          ).toLocaleDateString()}
        </p>

      </div>


      {/* DOUBT */}

      <div className="detail-section">

        <p className="section-label">
          MY DOUBT
        </p>

        <p className="detail-description">
          {doubt.description}
        </p>

      </div>


      {/* STUDENT CODE */}

      {doubt.code && (

        <div className="detail-section">

          <p className="section-label">
            MY CODE
          </p>

          <pre className="code-block">
            <code>
              {doubt.code}
            </code>
          </pre>

        </div>

      )}


      {/* SOLUTION */}

      <div className="solution-section">

        <p className="section-label">
          SOLUTION
        </p>


        {/* NOTES */}

        {doubt.solution_notes ? (

          <div className="solution-content">

            <h2>
              Explanation
            </h2>

            <p className="detail-description">
              {doubt.solution_notes}
            </p>

          </div>

        ) : (

          <div className="coming-soon">

            <h2>
              Solution coming soon 🚀
            </h2>

            <p>
              The solution for this doubt
              will be added soon.
            </p>

          </div>

        )}


        {/* CORRECT CODE */}

        {doubt.solution_code && (

          <div className="solution-content">

            <h2>
              Correct Solution
            </h2>

            <pre className="code-block">
              <code>
                {doubt.solution_code}
              </code>
            </pre>

          </div>

        )}


        {/* YOUTUBE VIDEO */}

        {youtubeEmbedUrl && (

          <div className="solution-video">

            <h2>
              Video Solution
            </h2>

            <div className="youtube-wrapper">

              <iframe
                src={youtubeEmbedUrl}
                title="DSA Solution Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default DoubtDetail;