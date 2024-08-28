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

function extractHeaders(markdownContent: string) {
  const headerRegex = /^(#{1,6})\s+(.*)/gm;
  const headers = [];
  let match;

  while ((match = headerRegex.exec(markdownContent)) !== null) {
    headers.push({
      level: match[1].length, // Number of '#' characters indicates the header level
      text: match[2]
    });
  }

  return headers;
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/app/blog', `${slug}.mdx`);
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { content, data: frontmatter } = matter(markdownWithMeta);

  // Extract headers from the markdown content
  const headers = extractHeaders(content);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{frontmatter.title || slug}</h1>

      {/* Displaying the extracted headers */}
      {headers.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Table of Contents</h2>
          <ul>
            {headers.map((header, index) => (
              <li key={index} style={{ marginLeft: `${(header.level - 1) * 20}px` }}>
                {header.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
