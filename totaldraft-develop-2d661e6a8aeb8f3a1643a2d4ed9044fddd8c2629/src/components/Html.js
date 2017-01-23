import React, { PropTypes } from 'react';
import { googleTagManagerCode, metrikaCode } from '../config';

function Html({ title, description, style, script, vendors, children, lang, state }) {
  return (
    <html className="no-js" lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="shortcut icon" href="/images/fav_football.gif" type="image/gif" />
        <link rel="apple-touch-icon" href="/images/app_icon_football.jpg" />
        <meta property="fb:app_id" content="790973104370747" />
        <meta property="og:url" content="http://totaldraft.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Тотал Драфт" />
        <meta property="og:description" content="Тотал Драфт - ежедневные фэнтези турниры" />
        <meta property="og:image" content="images/facebook_share.jpg" />
        <style id="css" dangerouslySetInnerHTML={{ __html: style }} />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {vendors &&
          <script src={vendors} />}
        {script && (
          <script
            id="source"
            src={script}
            data-initial-state={JSON.stringify(state)}
          />
        )}
        {metrikaCode &&
          <script dangerouslySetInnerHTML={{ __html: metrikaCode }} async />}
        {googleTagManagerCode &&
          <script dangerouslySetInnerHTML={{ __html: googleTagManagerCode }} defer />}
      </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  script: PropTypes.string,
  vendors: PropTypes.string,
  children: PropTypes.string,
  state: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

export default Html;
