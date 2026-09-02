// Add this object to the array that already has "Jewellery" and "Clothing".
// href is "/reels" (internal) instead of an instagram.com URL, so it routes
// to your new page above instead of opening a new tab.
{
  label: "Jewellery",
  href: "https://www.instagram.com/thelabel18_accessories?igsi=MW8yOGFlYzdwd2ZoOQ%3D%3D&utm_source=qr",
  path: instagramPath,
},
{
  label: "Clothing",
  href: "https://www.instagram.com/thelabel_18?igsi=c3E5YW8weXNrajJo&utm_source=qr",
  path: instagramPath,
},
{
  label: "Reels",
  href: "/reels",
  path: reelsPath, // add a play/reel icon path here, or reuse an existing one
},

// --------------------------------------------------------------------------
// Wherever this array is currently mapped over to render links, it's
// presumably rendering everything as an <a target="_blank">. Since "Reels"
// is an internal route, branch on whether href starts with "/":
// --------------------------------------------------------------------------

import Link from "next/link";

{socialLinks.map((item) =>
  item.href.startsWith("/") ? (
    <Link
      key={item.label}
      href={item.href}
      className="flex flex-col items-center gap-2" // reuse your existing classes here
    >
      {/* your existing icon render using item.path */}
      <span>{item.label}</span>
    </Link>
  ) : (
    <a
      key={item.label}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2" // reuse your existing classes here
    >
      {/* your existing icon render using item.path */}
      <span>{item.label}</span>
    </a>
  )
)}