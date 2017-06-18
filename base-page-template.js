module.exports = function(data) {
  return `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>${data.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="${data.viewName}.css">
        </head>
        <body class="page-${data.viewName}">
          ${data.body}
          <script type="text/javascript" src="${data.viewName}.js"></script>
        </body>
    </html>
  }
  `;
}
