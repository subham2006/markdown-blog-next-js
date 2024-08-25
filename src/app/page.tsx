import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Blog() {
  const directoryPath = path.join(process.cwd(), 'src/app/blog');
  const files = fs.readdirSync(directoryPath).filter(file => {
    // Filter out directories and only keep .mdx files
    return fs.statSync(path.join(directoryPath, file)).isFile() && file.endsWith('.mdx');
  });

  const posts = files.map((filename) => {
    const slug = filename.replace('.mdx', '');
    const markdownWithMeta = fs.readFileSync(path.join(directoryPath, filename), 'utf-8');
    const { data: frontmatter } = matter(markdownWithMeta);
    return {
      slug,
      title: frontmatter.title || slug,
    };
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Blog</h1>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {posts.map((post) => (
          <li key={post.slug} style={{ marginBottom: '10px' }}>
            <Link href={`/blog/${post.slug}`} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
