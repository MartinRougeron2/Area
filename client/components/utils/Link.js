import React from "react";
import { useRouter } from 'next/router'

const LinkText = ({ text, linktext, link }) => {
  const router = useRouter()

  return (
    <p>
      {text}
      <a href={link} onClick={(e) => {e.preventDefault(); router.push(link)}} className="text-dark font-bold cursor-pointer">{` ${linktext}`}</a>
    </p>
  )
}

export default LinkText;
