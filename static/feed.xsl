<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — Feed</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          body {
            margin: 0;
            background: #f5f4f1;
            color: #111110;
            font-family: Georgia, "Palatino Linotype", serif;
            font-size: 1rem;
            line-height: 1.7;
          }
          .feed-shell {
            max-width: 48rem;
            margin: 0 auto;
            padding: 3rem 1.5rem 4rem;
          }
          .feed-notice {
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #a03b10;
            margin-bottom: 0.6rem;
          }
          h1 {
            font-size: 2.4rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            line-height: 1;
            margin: 0 0 0.75rem;
          }
          .feed-desc {
            color: #66615b;
            margin: 0 0 2.5rem;
          }
          .feed-item {
            padding: 1.4rem 0;
            border-top: 1px solid #d4d1ca;
          }
          .feed-item__date {
            font-size: 0.76rem;
            color: #6e6860;
            margin-bottom: 0.25rem;
          }
          .feed-item__title {
            font-size: 1.2rem;
            font-weight: 700;
            margin: 0 0 0.4rem;
          }
          .feed-item__title a {
            color: #111110;
            text-decoration: none;
          }
          .feed-item__title a:hover {
            text-decoration: underline;
          }
          .feed-item__summary {
            color: #66615b;
            font-size: 0.95rem;
            margin: 0;
          }
          @media (prefers-color-scheme: dark) {
            body { background: #141312; color: #f0ede8; }
            .feed-desc, .feed-item__summary { color: #9e9890; }
            .feed-item { border-top-color: #2c2a27; }
            .feed-item__date { color: #827c74; }
            .feed-item__title a { color: #f0ede8; }
            .feed-notice { color: #d4694a; }
          }
        </style>
      </head>
      <body>
        <div class="feed-shell">
          <p class="feed-notice">RSS Feed — paste this URL into your feed reader</p>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="feed-desc"><xsl:value-of select="/rss/channel/description"/></p>
          <xsl:for-each select="/rss/channel/item">
            <div class="feed-item">
              <p class="feed-item__date"><xsl:value-of select="pubDate"/></p>
              <h2 class="feed-item__title">
                <a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                <xsl:value-of select="title"/></a>
              </h2>
              <p class="feed-item__summary"><xsl:value-of select="description"/></p>
            </div>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
