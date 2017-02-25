'use babel';

import http from 'http';
import https from 'https';
import { insertText } from '../utility/editor/editor';

const REGEXP = {
  HTTP_LINK: /^(http[s]?:)\/\/([^\/]+)(:?\d*)([\/]?.*)$/
};

export default class HttpLink {


  static create(linkString, loadingView) {
    if (REGEXP.HTTP_LINK.test(linkString)) {
      const [protocol, hostname, port, path] = linkString.replace(REGEXP.HTTP_LINK, '$1, $2, $3, $4').split(', ');

      var options = {
        hostname: hostname,
        port: protocol === port ? port : (protocol === 'https:' ? 443 : 80),
        path: path,
        method: 'GET'
      };

      const requester = protocol === 'http:' ? http : https;

      loadingView.show();
      var req = requester.request(options, (res) => {
        let rawData = '';

        res.on('data', (chunk) => {
          rawData += chunk;
        });

        res.on('end', () => {
          const title = rawData.replace(/[\s\S]*<title>([\s\S]+)<\/title>[\s\S]*/, '$1');
          loadingView.hide();
          insertText('[' + title + '](' + linkString + ')');
        });
      });
      req.end();
    }

  }

}
