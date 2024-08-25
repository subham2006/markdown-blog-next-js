import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const directoryPath = path.join(process.cwd(), 'src/app/blog');
  const files = fs.readdirSync(directoryPath).filter(file => {
    return fs.statSync(path.join(directoryPath, file)).isFile() && file.endsWith('.mdx');
  });

  return files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/app/blog', `${slug}.mdx`);
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { content, data: frontmatter } = matter(markdownWithMeta);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{frontmatter.title || slug}</h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
