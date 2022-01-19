import React from "react";

const LinkText = ({ text, linktext, link }) => (
  <p>
    {text}
    <a href={link} className="text-dark font-bold cursor-pointer">{` ${linktext}`}</a>
  </p>
);

export default LinkText;
