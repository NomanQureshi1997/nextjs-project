import React from "react";
import Link from "next/link";

const DisplayLink: React.FC<{ link: string }> = ({ link }) => {
  const maxLength = 50; // Define your own length based on your needs

  let displayLink = link;
  if (link.length > maxLength) {
    displayLink = `${link.substring(0, maxLength)}...`;
  }

  displayLink = displayLink.replace(/^https?:\/\//, '');

  const parts = displayLink.split("/").filter(Boolean);

  return (
    <div
      className="flex items-center overflow-hidden text-sm text-gray-400 !hover:no-underline"
      style={{ maxWidth: "100%", color: "#4B5563", lineHeight: "2.2rem", fontWeight: 400 }}
    >
      {parts.map((part, index) => (
        <div key={index} className="flex">
          <div className="text-gray-500 no-underline !hover:no-underline">
            {part}
          </div>
          {index < parts.length - 1 && (
            <span className="mx-1 text-gray-400 !hover:no-underline">
              ›
            </span>
          )}
        </div>
      ))}
    </div>
  );
}; //TODO make this a link, use individual spans for each part of the link

export default DisplayLink;
