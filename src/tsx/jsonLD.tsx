import React from 'react';
import siteData from "../data/siteData.json";
import { slugify } from "./utils.tsx";

interface Post {
  title: string;
  description: string;
  image: {
    src: string;
  };
  author: string;
  date: string;
}

interface JsonLDGeneratorProps {
  type: "post" | "website";
  post?: Post;
  url: string;
}

const jsonLDGenerator: React.FC<JsonLDGeneratorProps> = ({ type, post, url }) => {
  if (type === "post" && post) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            },
            "headline": post.title,
            "description": post.description,
            "image": post.image.src,
            "author": {
              "@type": "Person",
              "name": post.author,
              "url": `/author/${slugify(post.author)}`
            },
            "datePublished": post.date
          })
        }}
      />
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebSite",
          "name": siteData.title,
          "url": import.meta.env.SITE
        })
      }}
    />
  );
};

export default jsonLDGenerator;
