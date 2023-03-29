import express, { Express } from 'express';
import { Bundler } from '../bundler';

const createServer = (bundler: Bundler): Express => {
  const getAsset = (path: string) => {
    let asset = bundler.get(path);
    if (!asset) {
      path = path.endsWith('/') ? path + 'index.html' : path + '/index.html';
      asset = bundler.get(path);
    }
    return asset;
  };
  const app = express();
  app.get('/dev', (req, res) => {
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });
    res.flushHeaders();
    const path = req.query.path?.toString();
    if (!path) {
      res.status(400).send('Missing path');
      return;
    }
    const asset = getAsset(path);
    if (!asset) {
      res.status(404).send('Not found');
      return;
    }
    const reload = () => {
      res.write('data: reload\n\n');
    };
    asset.subscribe(reload);
    res.on('close', () => {
      asset.unsubscribe(reload);
    });
    res.on('error', () => {
      asset.unsubscribe(reload);
    });
    res.on('finish', () => {
      asset.unsubscribe(reload);
    });
  });
  app.use((req, res) => {
    let path = req.path;
    let asset = getAsset(path);
    if (asset) {
      asset.data
        .then((data) => {
          res.send(data.content);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err.message);
        });
    } else {
      res.status(404).send('Not found');
    }
  });

  return app;
};

export { createServer };
