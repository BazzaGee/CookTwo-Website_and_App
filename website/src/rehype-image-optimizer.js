import { visit } from 'unist-util-visit';
import sharp from 'sharp';
import { existsSync } from 'fs';
import { resolve } from 'path';

export default function rehypeImageOptimizer(options = {}) {
  const publicDir = options.publicDir || './public';

  return function transform(tree, file) {
    const promises = [];

    visit(tree, 'element', function (node) {
      if (node.tagName !== 'img' || !node.properties) return;
      const src = node.properties.src;
      if (typeof src !== 'string') return;
      if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) return;
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';

      const filePath = resolve(publicDir, src.replace(/^\//, ''));
      if (!existsSync(filePath)) return;

      const p = sharp(filePath).metadata().then(function (meta) {
        if (meta.width && meta.height) {
          node.properties.width = meta.width;
          node.properties.height = meta.height;
        }
      }).catch(function () {});
      promises.push(p);
    });

    if (promises.length > 0) {
      return Promise.all(promises).then(function () {});
    }
  };
}
