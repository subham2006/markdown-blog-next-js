// next.config.mjs
import withMDX from '@next/mdx';

export default withMDX({
  extension: /\.mdx?$/
})({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
});
